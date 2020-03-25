<template>
  <D3WordsCloud :config="config" :datum="datum" :height="600"></D3WordsCloud>
</template>


<script>
import { D3WordsCloud } from 'tipi-uikit';

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
        angle: [0, 90],
        color: {key: 'color'},
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

      this.datum = this.result.tags.map(d => ({
        tag: d.tag,
        size: d.times * 10,
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
