<template>
  <div class="initiativechart">
    <D3SlicesChart
      :config="config"
      :datum="datum"
      :height="220"
    ></D3SlicesChart>
  </div>
</template>

<script setup>
import { computed } from 'vue';

import { D3SlicesChart } from '@politicalwatch/tipi-uikit';

const { initiative, topics, styles } = defineProps({
  initiative: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  topics: {
    type: Array,
    required: true,
    default: () => [],
  },
  styles: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const config = {
  key: 'name',
  value: 'value',
  color: { key: 'color', default: '#CCC' },
  radius: { outter: 104, inner: 63, padding: 0.05, round: 0 },
  transition: { duration: 200 },
};

const datum = computed(() => {
  return Object.keys(styles.topics)
    .filter((k) => k !== 'no-topic')
    .map((k) => {
      let tags = [];
      for (const tagged of initiative.tagged) {
        tags = tags.concat(tagged.tags);
      }
      return {
        name: styles.topics[k].shortname,
        color: styles.topics[k].color,
        value: tags
          .filter((d) => d.topic === k)
          .reduce((cnt, o) => cnt + o.times, 0),
      };
    });
});
</script>

<style lang="scss">
.initiativechart {
  max-width: 300px;
  display: block;
  margin: 0 auto;
}
</style>
