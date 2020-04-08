<template>
  <div>
    <div class="u-padding-top-10">
      <h5>Distribución de los resultados:</h5>

      <div class="o-grid">
        <div class="o-grid__col u-12 u-padding-bottom-4">
          <ScannerLegend :result="result" :styles="styles"></ScannerLegend>
        </div>
        <div class="o-grid__col u-12 u-6@sm">
          <ScannerSunburst :result="result" :styles="styles"></ScannerSunburst>
          <tipi-message type="info" icon>Puedes hacer zoom haciendo click en cada una de las porciones.</tipi-message>
        </div>
        <div class="o-grid__col u-12 u-6@sm u-text-center">
          <ScannerWordsCloud :result="result" :maxResults="tagsInWordCloud" :styles="styles"></ScannerWordsCloud>
          <tipi-message type="info" icon>Se muestran un máximo de {{tagsInWordCloud}} etiquetas</tipi-message>
        </div>
      </div>
    </div>
    <div class="u-padding-top-10">
      <h5>Compara los resultados:</h5>
      <tipi-message type="info" icon>Selecciona un texto de referencia para poder comparar tus resultados con él.</tipi-message>
      <div class="c-select-label u-block">
        <label for="topic">Comparar con...</label>
        <multiselect
          v-model="textToCompare"
          :options="preScannedTexts.map(pst => pst.title)"
          name="pre-scanned-text" id="pre-scanned-text" placeholder="Selecciona uno">
        </multiselect>
      </div>
      <ScannerBarchart :result="this.result" :resultToCompare="resultToCompare" :styles="styles"></ScannerBarchart>
    </div>

    <div class="u-padding-top-10">
      <h5>Resultados en detalle:</h5>
      <ScannerTable :result="result"></ScannerTable>
    </div>

    <div class="o-grid__col u-12 u-margin-top-4">
      <tipi-csv-download
        :initiatives="csvItems || []"
        :csvItems="csvItems"
        :csvFields="csvFields"
        :canDownloadCSV="true"
        button-class="c-button--primary"
        label="Descárgalos en CSV"
        />
    </div>
  </div>
</template>

<script>
  import { TipiMessage, TipiCsvDownload } from 'tipi-uikit';
import ScannerWordsCloud from '@/components/scanner-wordscloud.vue';
import ScannerSunburst from '@/components/scanner-sunburst.vue';
import ScannerBarchart from '@/components/scanner-barchart.vue';
import ScannerTable from '@/components/scanner-table.vue';
import ScannerLegend from '@/components/scanner-legend.vue';
import Multiselect from 'vue-multiselect';
import preScannedTexts from '@/scanned';
import config from '@/config';

export default {
  name: "ScannerVisualizations",
  components: {
    TipiMessage,
    TipiCsvDownload,
    ScannerWordsCloud,
    ScannerSunburst,
    ScannerBarchart,
    ScannerTable,
    ScannerLegend,
    Multiselect,
  },
  props: {
    result: {
      type: Object || null,
      required: true,
    }
  },
  data() {
    return {
      preScannedTexts: preScannedTexts,
      resultToCompare: null,
      textToCompare: null,
      csvItems: this.result.tags,
      csvFields: ['topic', 'subtopic', 'tag', 'times'],
      scanned: {},
      tagsInWordCloud: 25,
      styles: config.STYLES,
    };
  },
  methods: {
    getNameFromCSV: function() {
      let d = new Date();
      return "export-scanner-" + d.toISOString() + ".csv";
    },
  },
  watch: {
    textToCompare(val) {
      const compareWith = preScannedTexts.filter(d => d.title === val);
      this.resultToCompare = compareWith.length
        ? compareWith[0]
        : null;
    }
  }
}
</script>
