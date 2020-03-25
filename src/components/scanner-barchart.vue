<template>
  <D3BarChart :config="config" :datum="datum"></D3BarChart>
</template>


<script>
import { D3BarChart } from 'tipi-uikit';

export default {
  name: 'ScannerBarchart',
  components: {
    D3BarChart,
  },
  data() {
    return {
      datum: [],
      config: {
        key: 'name',
        values: ['Resultado'],
        orientation: 'horizontal',
        color: { key: 'color' },
        margin: { left: 220 },
      },
    };
  },
  props: {
    result: {
      type: Object || null,
      required: true,
    },
    styles: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  created() {
    this.parseResults();
  },
  methods: {
    parseResults() {
      /**
      * Map tags array to custom array
      */
      if (!this.result.tags) return;

      const topics = [];

      this.result.tags.forEach((d) => {
        const idx = topics.map(d => d.name).indexOf(d.topic)
        if (idx === -1) {
          topics.push({ name: d.topic, result: 1});
        } else {
          topics[idx].result += 1;
        }
      });

      this.datum = topics.map(d => ({
        name: d.name,
        Resultado: d.result,
        color: this.styles.topics[d.name].color,
      }));
    },
  },
  watch: {
    result() {
      this.parseResults();
    },
  },
};
</script>
