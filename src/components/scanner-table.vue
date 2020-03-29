<template>
  <div>
    <table class="scanner-table">
      <thead>
        <tr>
          <th>Topic</th>
          <th>Subtopic</th>
          <th>Etiqueta</th>
          <th>Ocurrencias</th>
          <th>Porcentaje</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in datum" :key="i">
          <td data-label="Topic">{{d.topic}}</td>
          <td data-label="Subtopic">{{d.subtopic}}</td>
          <td data-label="Etiqueta">{{d.tag}}</td>
          <td class="number" data-label="Ocurrencias">{{d.times}}</td>
          <td class="number" data-label="Porcentaje">{{d.percent}}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'scanner-table',
  data() {
    return {
      datum: [],
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

      this.datum = this.result.tags.map(d => {
        const item = { ...d };
        item.percent = Math.floor((d.times / totaltags)*100);
        return item;
      });
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