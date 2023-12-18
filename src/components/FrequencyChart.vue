<template>
  <div>
    <svg :width="availableWidth" :height="availableHeight">
      <g class="top-text" :transform="`translate(${margin.left}, 0)`">
        <text
          v-if="activeBar"
          text-anchor="middle"
          font-size="0.9rem"
          font-weight="light"
        >
          <tspan
            text-anchor="middle"
            :x="xScale(activeBar.initDate)"
            :y="margin.top / 2"
          >
            {{ activeBar.initDate }}
          </tspan>
          <tspan
            text-anchor="middle"
            dy="0.9rem"
            :x="xScale(activeBar.initDate)"
            :y="margin.top / 2"
          >
            {{ activeBar.count }}
          </tspan>
        </text>
      </g>
      <g class="rects" :transform="`translate(${margin.left}, ${margin.top})`">
        <g v-for="(bar, index) in bars" :key="index">
          <!-- a "background rect" invisible ocupying full height above each one of the previous rects useful only for interaction-->
          <rect
            :x="xScale(bar.initDate)"
            :y="0"
            :width="barWidth"
            :height="height"
            class="bar-background"
            :class="{
              active: activeBar && activeBar.initDate === bar.initDate,
            }"
            @mouseover="activeBar = bar"
            @mouseout="activeBar = null"
          ></rect>
          <!-- visible rect :height="height - yScale(bar.count)" -->
          <rect
            :y="yScale(bar.count)"
            :x="xScale(bar.initDate)"
            :width="barWidth"
            v-tr3nsition:init="{
              height: 0,
            }"
            v-tr3nsition:mounted="{
              height: height - yScale(bar.count),
              transition: {
                duration: 500,
                delay: index *10,
              },
            }"
            :class="{
              active: activeBar && activeBar.initDate === bar.initDate,
            }"
            class="bar"
            :style="{
              fill: currentStyle.color,
              stroke: currentStyle.color,
            }"
          />

          <!-- a line above the rect on its top side-->
          <line
            :x1="xScale(bar.initDate)"
            :y1="yScale(bar.count)"
            :x2="xScale(bar.initDate) + barWidth"
            :y2="yScale(bar.count)"
            :stroke="currentStyle.color"
            stroke-width="3"
          ></line>
        </g>
      </g>

      <g
        class="y-axis"
        :transform="`translate(${margin.left - MARGIN_AXIS}, ${margin.top})`"
      >
        <!-- vertical line for y axis-->
        <line x1="0" x2="0" :y1="height" :y2="0" stroke="currentColor" />
        <g
          class="tick"
          v-for="(tick, index) in yScale.nice().ticks(5)"
          :key="index"
          :transform="`translate(0, ${yScale(tick)})`"
        >
          <line x1="-6" x2="0" stroke="currentColor" />
          <text x="-9" dy=".32em" text-anchor="end" fill="`currentColor`">
            {{ tick }}
          </text>
        </g>
      </g>

      <g class="x-axis" :transform="`translate(${margin.left},${margin.top})`">
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
          <line y2="6" stroke="currentColor" />
          <text y="9" dy=".71em" text-anchor="'middle'" fill="`currentColor`">
            {{ tick }}
          </text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script setup>
// test at http://localhost:5173/ods/ods-2
import { ref, computed, onMounted } from 'vue';
import * as d3 from 'd3';
import { el } from 'date-fns/locale';
import vTr3nsition from './vTr3nsition.js';
const props = defineProps({
  availableWidth: {
    type: Number,
    default: 700,
  },
  availableHeight: {
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
});

const currentStyle = computed(() => props.topicsStyles[props.topic.name]);
const data = computed(() =>
  // generate data points for a full year one for each week:
  {
    const arr = [];
    for (let i = 0; i < 52; i++) {
      arr.push({
        initDate: d3.timeFormat('%Y-%m-%d')(
          d3.timeWeek.offset(new Date('2022-01-01'), i)
        ),
        count: Math.floor(Math.random() * 100),
      });
    }
    console.log(arr);
    return arr;
  }
);
const margin = { top: 40, right: 40, bottom: 60, left: 50 };
const MARGIN_AXIS = 10;

const width = computed(() => props.availableWidth - margin.left - margin.right);
const height = computed(
  () => props.availableHeight - margin.top - margin.bottom
);

const xScale = computed(() =>
  d3
    .scaleBand()
    .domain(data.value.map((d) => d.initDate))
    .range([0, width.value])
    .padding(0)
);

const xScaleTimeForAxis = computed(() => {
  const scale = d3
    .scaleTime()
    .domain([
      d3.timeWeek.offset(new Date('2022-01-01'), 0),
      d3.timeWeek.offset(new Date('2022-01-01'), 52),
    ])
    .range([margin.left, width.value - margin.right]);

  return scale;
});
const xScaleTicks = computed(() => {
  const format = d3.timeFormat('%b %Y'); // short version of the date
  return xScaleTimeForAxis.value
    .nice()
    .ticks(d3.timeMonth.every(3))
    .map(format); // ticks every 3 months
});

const xScaleTicksPositions = computed(() =>
  xScaleTimeForAxis.value.ticks(d3.timeMonth.every(3))
);

const yScale = computed(() =>
  d3
    .scaleLinear()
    .domain([0, d3.max(data.value, (d) => d.count)])
    .range([height.value, 0])
);

const barWidth = computed(() => xScale.value.bandwidth());

const bars = computed(() =>
  data.value.map((d) => ({
    initDate: d.initDate,
    count: d.count,
  }))
);

//** interaction */
const activeBar = ref(null);
onMounted(() => {
  // Code to fetch data and update the 'data' ref can be added here
});


</script>

<style lang="scss" scoped>
.bar {
  fill-opacity: 0.1;
  stroke-opacity: 0.05;
  pointer-events: none;
  transition: 0.3s;
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
  transition: 0.3s;
}
</style>
