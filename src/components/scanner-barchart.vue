<template>
  <D3BarChart :config="config" :datum="datum" :height="height"></D3BarChart>
</template>


<script>
import { D3BarChart, Utils } from 'tipi-uikit';

export default {
  name: 'ScannerBarchart',
  components: {
    D3BarChart,
  },
  data() {
    return {
      datum: [],
      config: {
        key: 'key',
        values: ['Texto original'],
        orientation: 'horizontal',
        color: { key: 'color' },
        margin: { left: 60 },
        tooltip: { suffix: 'aparición', suffixPlural: 'apariciones' },
      },
      height: 500,
      barHeight: 40,
      maxHeight: 900,
    };
  },
  props: {
    result: {
      type: Object || null,
      required: true,
    },
    resultToCompare: {
      type: Object || null,
      default: () => ({}),
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
  computed: {
    isComparing(){
      return this.resultToCompare
        && this.resultToCompare.result.tags;
    }
  },
  methods: {
    parseResults() {
      /**
      * Map tags array to custom array
      */
      if (!this.result.tags) return;

      const topics = [];

      // Add comparation result to array
      this.result.tags.forEach((d) => {
        const names = d.topic.split(' ');
        const shortname = `${names[0]} ${names[1]}`;
        const idx = topics.map(d => d.shortname).indexOf(shortname)
        if (idx === -1) {
          topics.push({
            shortname,
            name: d.topic,
            result: d.times,
            compared: 0,
          });
        } else {
          topics[idx].result += d.times;
        }
      });

      // Add comparation result to array if exists
      if(this.isComparing) {
        this.resultToCompare.result.tags.forEach((d) => {
          const names = d.topic.split(' ');
          const shortname = `${names[0]} ${names[1]}`;
          const idx = topics.map(d => d.shortname).indexOf(shortname)
          if (idx === -1) {
            topics.push({
              shortname,
              name: d.topic,
              result: 0,
              compared: d.times,
            });
          } else {
            topics[idx].compared += d.times;
          }
        });
      }

      // Set chart height
      this.height = topics.length * this.barHeight > this.maxHeight
       ? this.maxHeight
       : topics.length * this.barHeight;

      // Map values
      this.datum = topics.map(d => ({
        key: d.shortname,
        'Texto original': d.result,
        'Texto comparado': d.compared,
        color: this.styles.topics[d.name].color,
      })).sort((a, b) => Utils.naturalSort(a.key, b.key));

      // Change chart's configuration
      this.config.values = this.isComparing
        ? ['Texto original', 'Texto comparado']
        : ['Texto original'];

    },
  },
  watch: {
    result() {
      this.parseResults();
    },
    resultToCompare() {
      this.parseResults();
    }
  },
};
</script>
