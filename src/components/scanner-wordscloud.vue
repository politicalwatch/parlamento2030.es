<template>
  <D3WordsCloud :config="config" :datum="datum" :height="400" title="Etiquetas más comunes"></D3WordsCloud>
</template>


<script>
import { D3WordsCloud } from 'tipi-uikit';
import { scalePow } from 'd3-scale';
import { extent } from 'd3-array';

const d3 = { scalePow, extent };

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
        size: 'size',
        value: 'value',
        angle: [0, 90],
        color: {key: 'color'},
        fontFamily: "Rubik",
        tooltip: { suffix: 'aparición', suffixPlural: 'apariciones' },
      },
      minFontSize: 10,
      maxFontSize: 40,
      fontScaleExponent: 2,
      maxResults: 50,
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

      const tags = this.result.tags
        .sort((a, b) => b.times - a.times)
        .slice(0, this.maxResults);

      const textScale = d3.scalePow()
        .exponent(this.fontScaleExponent)
        .range([this.minFontSize, this.maxFontSize])
        .domain(d3.extent(tags, (d) => d.times));

      this.datum = tags.map(d => ({
        tag: d.tag,
        size: textScale(d.times),
        value: d.times,
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
