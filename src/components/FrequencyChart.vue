<template>
  <div class="chart-wrapper" ref="chartWrapper">
    <svg :width="availableWidth" :height="availableHeight">
      <g class="top-text" :transform="`translate(${margin.left}, 0)`">
        <text
          v-if="activeBar"
          text-anchor="middle"
          font-size="0.8rem"
          font-weight="light"
          fill="#9cb0bf"
        >
          <tspan
            text-anchor="middle"
            :x="xScale(activeBar.week)"
            :y="margin.top / 2"
          >
            Semana {{ activeBar.week.split('-')[1] }} ({{
              getFirstDayOfWeek(activeBar.week).toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
              })
            }})
          </tspan>
          <tspan
            text-anchor="middle"
            dy="0.9rem"
            :x="xScale(activeBar.week)"
            :y="margin.top / 2"
          >
            Iniciativas:
            <tspan font-weight="bold">{{ activeBar.initiatives }}</tspan>
          </tspan>
        </text>
      </g>
      <!--  axis -->
      <g
        class="axis yaxis"
        :transform="`translate(${margin.left - MARGIN_AXIS}, ${margin.top})`"
      >
        <!-- vertical line for y axis-->
        <line x1="0" x2="0" :y1="height" :y2="0" />
        <g
          class="tick"
          v-for="(tick, index) in yScale.nice().ticks(5)"
          :key="index"
          :transform="`translate(0, ${yScale(tick)})`"
        >
          <line x1="-6" :x2="width" class="ticks" />
          <text x="-9" dy=".32em" text-anchor="end">
            {{ tick }}
          </text>
        </g>
      </g>

      <g
        class="axis xaxis"
        :transform="`translate(${margin.left},${margin.top})`"
      >
        <!-- horizontal line for x axis-->
        <line
          :y1="height"
          :y2="height"
          :x1="0"
          :x2="width"
          stroke="currentColor"
          stroke-width="1"
        ></line>
        <g
          class="tick"
          v-for="(tick, index) in xScaleTicks"
          :key="index"
          :transform="`translate(${
            xScaleTimeForAxis(xScaleTicksPositions[index]) + barWidth / 2
          }, ${height + 20})`"
        >
          <line y2="6" />
          <text y="9" dy=".71em" text-anchor="middle">
            {{ tick }}
          </text>
        </g>
      </g>

      <!-- bars -->
      <g class="rects" :transform="`translate(${margin.left}, ${margin.top})`">
        <g v-for="(bar, index) in bars" :key="index">
          <!-- a "background rect" invisible ocupying full height above each one of the previous rects useful only for interaction-->
          <rect
            :x="xScale(bar.week)"
            :y="0"
            :width="barWidth"
            :height="height"
            class="bar-background"
            :class="{
              active: activeBar && activeBar.week === bar.week,
            }"
            @mouseover="activeBar = bar"
            @mouseout="activeBar = null"
          ></rect>
          <!-- visible-->
          <rect
            :x="xScale(bar.week)"
            :width="barWidth"
            v-tr3nsition:init="{
              height: 0,
              y: height,
            }"
            v-tr3nsition:to="{
              height:
                height - yScale(bar.initiatives) <= 0
                  ? 0.00001
                  : height - yScale(bar.initiatives),
              y: yScale(bar.initiatives),
              transition: {
                duration: 60,
                delay: index * 15,
              },
            }"
            :class="{
              active: activeBar && activeBar.week === bar.week,
            }"
            class="bar"
            :style="{
              fill: currentStyle.color,
              stroke: currentStyle.color,
            }"
          />

          <!-- a line above the rect on its top side-->
          <line
            :x1="xScale(bar.week)"
            :x2="xScale(bar.week) + barWidth"
            v-tr3nsition:init="{
              y1: height,
              y2: height,
            }"
            v-tr3nsition:to="{
              y1: yScale(bar.initiatives),
              y2: yScale(bar.initiatives),
              transition: {
                duration: 600,
                delay: index * 15,
              },
            }"
            :stroke="currentStyle.color"
            stroke-width="3"
          ></line>
        </g>
        <g v-if="isRelativeModeReady">
          <g v-for="(bar, index) in globalBars" :key="index">
            <rect
              :x="xScale(bar.week)"
              :width="barWidth"
              v-tr3nsition:init="{
                height: 0,
                y: height,
              }"
              v-tr3nsition:to="{
                height:
                  height - yScale(bar.initiatives) <= 0
                    ? 0.00001
                    : height - yScale(bar.initiatives),
                y: yScale(bar.initiatives),
                transition: {
                  duration: 60,
                  delay: index * 15,
                },
              }"
              class="bar"
              :style="{
                fill: '#999',
                stroke:'#000'
              }"
            />
          </g>
        </g>
      </g>
    </svg>

    <div class="yearSelectors">
      <a
        href="#"
        class="c-button c-button--compact"
        :class="{
          'c-button--secondary': activeYear != year,
          'c-button--primary': activeYear == year,
        }"
        v-for="year in datasetAnalytics.allYears"
        :key="year"
        @click.prevent="activeYear = year"
        >{{ year }}</a
      >
    </div>
    <div>
      <UiSwitch
        label="Mostrar Evolución relativa"
        :checked="showRelativeMode"
        @update:checked="showRelativeMode = $event"
      ></UiSwitch>
    </div>
  </div>
</template>

<script setup>
// test at http://localhost:5173/ods/ods-2
import { ref, computed, onMounted, nextTick, onUnmounted, watch } from 'vue';
import * as d3 from 'd3';
import vTr3nsition from './vTr3nsition.js';
import UiSwitch from './UiSwitch.vue';
const props = defineProps({
  defaultHeight: {
    type: Number,
    default: 400,
  },

  topicsStyles: {
    type: Object,
    default: () => ({
      'ODS 1 Fin de la pobreza': {
        shortname: 'ODS 1',
        color: '#eb1c2d',
        image: 'ods-1.svg',
        orgs_logos: ['caritas.png'],
      },
      'ODS 2 Hambre cero': {
        shortname: 'ODS 2',
        color: '#d3a029',
        image: 'ods-2.svg',
        orgs_logos: ['fao.png'],
      },
      'no-topic': { shortname: 'Sin relación con la Agenda2030' },
    }),
  },
  topic: {
    type: Object,
    default: () => ({
      knowledgebase: 'ods',
      name: 'ODS 2 Hambre cero',
      shortname: 'ODS 2',
      id: 'ods-2',
      description: [
        'Poner fin al hambre, lograr la seguridad alimentaria y la mejora de la nutrición y promover la agricultura sostenible',
      ],
    }),
  },
  dataset: {
    type: Array,
    default: () => [[]],
  },
  globalDataset: {
    type: Array,
    default: () => [[]],
  },
});

//*** set responsive width and  heights */
const chartWrapper = ref(null);
const availableWidth = ref(800);
const availableHeight = ref(props.defaultHeight);
// adjust on resize

onMounted(() => {
  availableWidth.value = chartWrapper.value.clientWidth;
  window.addEventListener('resize', () => {
    availableWidth.value = chartWrapper.value.clientWidth;
  });
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    availableWidth.value = chartWrapper.value.clientWidth;
  });
});
//*******/

const currentStyle = computed(() => props.topicsStyles[props.topic.name]);
const data = computed(() => {
  if (props.dataset.length > 0) {
    // props .dataset.weeks is a string with the format YYYY-WW where WW is the week number
    return props.dataset;
    // generate data points for a full year one for each week:
  } else {
    const arr = [];
    for (let i = 0; i < 90; i++) {
      arr.push({
        week: d3.timeFormat('%Y-%W')(
          d3.timeWeek.offset(new Date('2022-01-01'), i)
        ),
        initiatives: Math.floor(Math.random() * 100),
      });
    }

    return arr;
  }
});

const datasetAnalytics = computed(() => {
  // data.value contais the an array of objects with the format {week: '2021-01', initiatives: 10}
  const a = {
    initDate: d3.min(data.value, (d) => d.week),
    endDate: d3.max(data.value, (d) => d.week),
    firstYear: d3.min(data.value, (d) => d.week).split('-')[0],
    lastYear: d3.max(data.value, (d) => d.week).split('-')[0],
    maxInitiatives: d3.max(data.value, (d) => d.initiatives),
    minInitiatives: d3.min(data.value, (d) => d.initiatives),
  };
  // allyears is an array going from firstYear to lastYear (both included)
  a.countYears = parseInt(a.lastYear) - parseInt(a.firstYear);

  a.allYears = d3.range(parseInt(a.firstYear), parseInt(a.lastYear) + 1);
  return a;
});

const globalDatasetAnalytics = computed(() => {
  const a = {
    initDate: d3.min(props.globalDataset, (d) => d.week),
    endDate: d3.max(props.globalDataset, (d) => d.week),
    firstYear: d3.min(props.globalDataset, (d) => d.week).split('-')[0],
    lastYear: d3.max(props.globalDataset, (d) => d.week).split('-')[0],
    maxInitiatives: d3.max(props.globalDataset, (d) => d.initiatives),
    minInitiatives: d3.min(props.globalDataset, (d) => d.initiatives),
  };
  // allyears is an array going from firstYear to lastYear (both included)
  a.countYears = parseInt(a.lastYear) - parseInt(a.firstYear);

  a.allYears = d3.range(parseInt(a.firstYear), parseInt(a.lastYear) + 1);
  return a;
});

const activeData = computed(() => {
  if (multiYearMode.value === true)
    return data.value.filter((d) => d.week.split('-')[0] == activeYear.value);
  else return data.value;
});

const activeDataGlobal = computed(() => {
  if (multiYearMode.value === true)
    return props.globalDataset.filter(
      (d) => d.week.split('-')[0] == activeYear.value
    );
  else return props.globalDataset;
});

const activeDataAnalytics = computed(() => {
  if (
    multiYearMode.value === true &&
    activeData.value != null &&
    activeData.value.length > 0
  ) {
    return {
      initDate: d3.min(activeData.value, (d) => d.week),
      endDate: d3.max(activeData.value, (d) => d.week),
      firstYear: d3.min(activeData.value, (d) => d.week).split('-')[0],
      lastYear: d3.max(activeData.value, (d) => d.week).split('-')[0],
      maxInitiatives: d3.max(activeData.value, (d) => d.initiatives),
      minInitiatives: d3.min(activeData.value, (d) => d.initiatives),
    };
  } else return datasetAnalytics.value;
});

const activeDataAnalyticsGlobal = computed(() => {
  if (
    multiYearMode.value === true &&
    activeDataGlobal.value != null &&
    activeDataGlobal.value.length > 0
  ) {
    return {
      initDate: d3.min(activeDataGlobal.value, (d) => d.week),
      endDate: d3.max(activeDataGlobal.value, (d) => d.week),
      firstYear: d3.min(activeDataGlobal.value, (d) => d.week).split('-')[0],
      lastYear: d3.max(activeDataGlobal.value, (d) => d.week).split('-')[0],
      maxInitiatives: d3.max(activeDataGlobal.value, (d) => d.initiatives),
      minInitiatives: d3.min(activeDataGlobal.value, (d) => d.initiatives),
    };
  } else return globalDatasetAnalytics.value;
});

const margin = { top: 40, right: 40, bottom: 60, left: 50 };
const MARGIN_AXIS = 10;

const width = computed(() => availableWidth.value - margin.left - margin.right);
const height = computed(
  () => availableHeight.value - margin.top - margin.bottom
);

const xScale = computed(() =>
  d3
    .scaleBand()
    .domain(activeData.value.map((d) => d.week))
    .range([0, width.value])
    .padding(0)
);

const xScaleTimeForAxis = computed(() => {
  // const initDate = d.datasetAnalytics.countYears>1 ?
  //   new Date(`${datasetAnalytics.firstYear}-01-01`) // first day of the year
  //   : d3.timeWeek.offset(new Date(`${datasetAnalytics.firstYear}`), datasetAnalytics.initDate.split('-')[1] ) // first
  // console.log(initDate)
  // const endDate = d.datasetAnalytics.countYears>1 ?
  //   new Date(`${datasetAnalytics.lastYear}-12-31`) // last day of the year
  //   : d3.timeWeek.offset(new Date(`${datasetAnalytics.lastYear}`), datasetAnalytics.endDate.split('-')[1] ) // first

  const scale = d3
    .scaleTime()
    .domain([
      new Date(`${activeDataAnalytics.value.firstYear}-01-01`),
      new Date(`${activeDataAnalytics.value.lastYear}-12-31`),
    ])
    .range([0, width.value]);

  return scale;
});
const xScaleTicks = computed(() => {
  const format = d3.timeFormat('%V %Y'); // short version of the date
  return xScaleTimeForAxis.value
    .nice()
    .ticks(d3.timeMonth.every(3))
    .map(format); // ticks every 3 months
});

const xScaleTicksPositions = computed(() =>
  xScaleTimeForAxis.value.nice().ticks(d3.timeMonth.every(3))
);

const yScale = computed(() =>
  isRelativeModeReady.value
    ? d3
        .scaleLinear()
        .domain([0, activeDataAnalyticsGlobal.value.maxInitiatives])
        .range([height.value, 0])
    : d3
        .scaleLinear()
        .domain([0, activeDataAnalytics.value.maxInitiatives])
        .range([height.value, 0])
);
const barWidth = computed(() => xScale.value.bandwidth());
const bars = computed(() => activeData.value);
const globalBars = computed(() => activeDataGlobal.value);

//** interaction */
const activeBar = ref(null);
const activeYear = ref(null);
const multiYearMode = computed(() => datasetAnalytics.value.countYears > 1);

onMounted(() => {
  // Code to fetch data and update the 'data' ref can be added here
  nextTick(() => {
    activeYear.value = datasetAnalytics.value.lastYear;
  });
});
const theme = ref({
  lightGray: '#9cb0bf',
});

// relative view

const emit = defineEmits(['update:showRelativeMode']);

const showRelativeMode = ref(false);
watch(showRelativeMode, (newValue, oldValue) => {
  console.log('emit update:showRelativeMode', newValue);
  emit('update:showRelativeMode', newValue);
});

const isRelativeModeReady = computed(
  () => showRelativeMode.value === true && props.globalDataset?.length > 0
);

// utils
function getFirstDayOfWeek(yearWeek) {
  const [year, week] = yearWeek.split('-');
  const date = new Date(year, 0, 1 + (week - 1) * 7);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}
</script>

<style scoped>
.bar {
  fill-opacity: 0.1;
  stroke-opacity: 0.05;
  pointer-events: none;
  transition: 0.1s;
}
.bar:hover,
.bar.active {
  fill-opacity: 1;
  stroke-opacity: 1;
}

.bar-background {
  fill: transparent;
}
.bar-background.active {
  fill: #f8f8f8;
  transition: 0.1s;
}

.axis text {
  font-size: 0.8rem;
  font-weight: light;
  fill: v-bind('theme.lightGray');
}
.axis line {
  stroke: v-bind('theme.lightGray');
}
.axis line.ticks {
  stroke-opacity: 0.2;
}

.yearSelectors {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 2px;
  margin-bottom: 1rem;
}
.yearSelectors a:first-child {
  border-radius: 0.4rem 0 0 0.4rem;
}
.yearSelectors a:last-child {
  border-radius: 0 0.4rem 0.4rem 0;
}
.yearSelectors a {
  border-radius: 0;
}
</style>
