<template>
  <div>
    <table class="scanner-table">
      <thead>
        <tr>
          <th>Topic</th>
          <th>Subtopic</th>
          <th>Etiqueta</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in datum" :key="i">
          <td data-label="Topic">{{d.topic}}</td>
          <td data-label="Subtopic">{{d.subtopic}}</td>
          <td data-label="Etiqueta">{{d.tag}}</td>
        </tr>
      </tbody>
    </table>
    <tipi-message
      v-if="totalRows > limitRows"
      type="info"
      icon>Se muestran {{limitRows}} resultados de un total de {{totalRows}} encontrados.</tipi-message>
  </div>
</template>

<script>
import { TipiMessage, Utils } from 'tipi-uikit';

export default {
  name: 'scanner-table',
  components: {
    TipiMessage,
  },
  data() {
    return {
      datum: [],
      totalRows: 0,
      limitRows: 20,
    };
  },
  created() {
    this.parseResults();
  },  
  props: {
    result: {
      type: Object || null,
      required: true,
    },
  },
  methods: {
    parseResults() {
      /**
      * Map tags array to custom array
      */
      if (!this.result.tags) return;

      const totaltags = this.result.tags
        .reduce((cnt, o) => (cnt + o.times), 0);

      this.totalRows = this.result.tags.length;

      this.datum = this.result.tags.map(d => {
        const item = { ...d };
        item.percent = Math.floor((d.times / totaltags)*100);
        return item;
      }).sort((a, b) => Utils.naturalSort(a.topic, b.topic)).slice(0, this.limitRows);
    },
  },
};
</script>

<style lang="scss">
.scanner-table {
  .number {
    text-align: right;
  }
}
</style>