<template>
  <D3WordsCloud :config="config" :datum="datum" :height="400" title="Etiquetas más comunes"></D3WordsCloud>
</template>


<script>
import { D3WordsCloud } from 'tipi-uikit';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';

const d3 = { scaleLinear, max };

export default {
  name: 'ScannerWordsCloud',
  components: {
    D3WordsCloud,
  },
  data() {
    return {
      datum: [],
      config: {
        key: 'tag',
        value: 'size',
        angle: [0],
        color: {key: 'color'},
        fontFamily: "Rubik",
      },
      minFontSize: 12,
      maxFontSize: 36,
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

      const textScale = d3.scaleLinear()
        .range([this.minFontSize, this.maxFontSize])
        .domain([1, d3.max(this.result.tags, (d) => d.times)]);

      this.datum = this.result.tags.map(d => ({
        tag: d.tag,
        size: textScale(d.times),
        color: this.styles.topics[d.topic].color,
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
