<template>
  <div class="initiativechart">
    <D3SlicesChart
      :config="config"
      :datum="datum"
      :height="220"
    ></D3SlicesChart>
  </div>
</template>

<script>
import { D3SlicesChart } from '@politicalwatch/tipi-uikit';

export default {
  name: 'InitiativeChart',
  components: {
    D3SlicesChart,
  },
  data() {
    return {
      config: {
        key: 'name',
        value: 'value',
        color: { key: 'color', default: '#CCC' },
        radius: { outter: 104, inner: 63, padding: 0.05, round: 0 },
        transition: { duration: 200 },
      },
    };
  },
  props: {
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
  },
  computed: {
    datum() {
      const datum = [];
      Object.keys(this.styles.topics)
        .filter((k) => k !== 'no-topic')
        .forEach((k) => {
          let tags = [];
          for (const tagged of this.initiative.tagged) {
            tags = tags.concat(tagged.tags);
          }
          datum.push({
            name: this.styles.topics[k].shortname,
            color: this.styles.topics[k].color,
            value: tags
              .filter((d) => d.topic === k)
              .reduce((cnt, o) => cnt + o.times, 0),
          });
        });
      return datum;
    },
  },
};
</script>

<style lang="scss">
.initiativechart {
  max-width: 300px;
  display: block;
  margin: 0 auto;
}
</style>
