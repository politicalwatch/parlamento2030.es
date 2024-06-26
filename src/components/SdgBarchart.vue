<template>
  <transition-group tag="div" class="tipichart" name="barfade">
    <div class="tipichart__row" v-for="d in rows" :key="d.topic">
      <router-link
        :to="{ name: 'results', params: { data: 'topic=' + d.topic } }"
      >
        <div class="tipichart__tooltip">
          <div class="tipichart__tip">
            {{ d.topic }}
            <hr />
            {{ d.times }} iniciativas ({{
              ((d.times / totalInitiatives) * 100).toFixed(2)
            }}%)
          </div>
        </div>

        <div class="tipichart__bar">
          <div class="tipichart__overbar" :style="d.overbarStyle"></div>
        </div>

        <div class="tipichart__icon" :style="d.iconStyle"></div>
      </router-link>
    </div>
  </transition-group>
</template>

<script setup>
import { ref, computed, toRefs, watch, onMounted } from 'vue';

const props = defineProps({
  ranking: {
    type: Array,
    required: false,
    default: () => [],
  },
  styles: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  linkToSearchField: {
    type: String,
    required: false,
    default: 'author',
  },
  linkToSearchValue: {
    type: String,
    required: false,
    default: '',
  },
});

const rows = ref([]);
const totalInitiatives = ref(0);

const calculateRows = () => {
  totalInitiatives.value = ranking.reduce((cnt, o) => cnt + o.initiatives, 0);

  const higherCount = ranking.reduce((max, o) => {
    if (max > o.initiatives) {
      return max;
    }
    return o.initiatives;
  }, 0);

  rows.value = ranking.map((d) => {
    const percentage = (d.initiatives / higherCount) * 100;
    if (d.topic in styles) {
      return {
        topic: d.topic,
        times: d.initiatives,
        iconStyle: {
          backgroundImage: `url(/img/topics/${styles[d.topic].image})`,
          backgroundColor: styles[d.topic].color,
        },
        overbarStyle: {
          height: `${percentage}%`,
          backgroundColor: styles[d.topic].color,
        },
      };
    }
  });
};

onMounted(() => {
  calculateRows();
});
</script>

<style lang="scss">
.tipichart {
  justify-content: center;
  &__row {
    display: inline-block;
    width: 64px;
    height: 100%;
    padding-left: 6px;
    padding-right: 6px;

    &:hover .tipichart__tooltip {
      display: block;
    }
  }
  &__tooltip {
    position: absolute;
    left: 0;
    width: 250%;
    z-index: 99;
    text-align: center;
    display: none;
    pointer-events: none;
  }
  &__tip {
    background: black;
    color: white;
    font-size: small;
    display: inline-block;
    padding: 0 4px;
    line-height: 1.5;
  }
  &__icon {
    width: 52px;
    height: 48px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 55%;
  }
  &__bar {
    height: 234px;
    margin-bottom: 8px;
    display: flex;
    border-radius: 0;
  }
  &__overbar {
    width: 100%;
    transition: width 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95) 350ms;
    align-self: flex-end;
    position: inherit;
    border-radius: 0;
  }
}
hr {
  border-top: 2px solid #fff;
  border-bottom: 0;
  width: 50%;
}
</style>
