<template>
  <div>
    <div id="scanner" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Scanner"/>
      <div class="o-grid u-margin-bottom-4">

        <div class="o-grid__col u-12 u-6@sm" v-if="config.SCANNER_HELPTEXT">
          <tipi-message type="info" icon><div v-html="config.SCANNER_HELPTEXT"></div></tipi-message>
        </div>

        <div class="o-grid__col u-12 u-6@sm">
          <p><textarea placeholder="Inserta aqui el texto que quieres escanear..." v-model="inputText" rows="9"/></p>
          <div class="c-input-label c-input-label--file u-block">
            <label for="file">Sube un archivo</label>
            <input type="file" id="file" name="file" placeholder="PDF, doc o txt">
          </div>
          <p>
            <a id="start" class="c-button c-button--primary" @click.prevent="annotate">Iniciar proceso</a>
            <a class="c-button" :class="{ disabled: inProgress }" v-if="inputText!=''" @click="cleanTextAndResult">Limpiar texto <span v-if="result">y resultados</span></a>
          </p>
        </div>

      </div>
      <div id="result" class="o-section o-grid">
        <div v-if="inProgress || errors" class="o-grid__col u-12">
          <tipi-message v-if="errors" type="error" icon>Has sobrepasado el límite de escaneos por hora. Vuelve a intentarlo pasado un tiempo</tipi-message>
          <tipi-loader v-if="inProgress" title="Escaneando resultados" :subtitle="subtitle" />
        </div>
        <div class="o-grid__col u-12 result" v-if="result">
          <tipi-message v-if="!result.topics.length" type="error" icon>No hemos encontrado ninguna coincidencia entre tu texto y nuestras etiquetas.</tipi-message>
          <div v-else>

            <div>
              <h5>Distribución de los resultados:</h5>
              <div class="o-grid">
                <div class="o-grid__col u-12 u-padding-bottom-4">
                  <ScannerLegend :result="result" :styles="styles"></ScannerLegend>
                </div>
                <div class="o-grid__col u-12 u-4@sm">
                  <ScannerSunburst :result="result" :styles="styles"></ScannerSunburst>
                  <tipi-message type="info" icon>Puedes hacer zoom haciendo click en cada una de las porciones.</tipi-message>
                </div>
                <div class="o-grid__col u-12 u-8@sm">
                  <ScannerWordsCloud :result="result" :styles="styles"></ScannerWordsCloud>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TipiMessage, TipiHeader, TipiLoader, TipiTopics, TipiCsvDownload } from 'tipi-uikit'
import Multiselect from 'vue-multiselect';
import config from '@/config';
import preScannedTexts from '@/scanned';
import api from '@/api';
import { mapState } from 'vuex';
import ScannerWordsCloud from '@/components/scanner-wordscloud.vue';
import ScannerSunburst from '@/components/scanner-sunburst.vue';
import ScannerBarchart from '@/components/scanner-barchart.vue';
import ScannerTable from '@/components/scanner-table.vue';
import ScannerLegend from '@/components/scanner-legend.vue';
import InitiativeChart from '@/components/initiative-chart.vue';

const VueScrollTo = require('vue-scrollto');

export default {
  name: 'tagger',
  components: {
    TipiHeader,
    TipiTopics,
    TipiCsvDownload,
    ScannerWordsCloud,
    ScannerSunburst,
    ScannerBarchart,
    ScannerTable,
    ScannerLegend,
    Multiselect,
    TipiMessage,
    TipiLoader,
    InitiativeChart,
  },
  data() {
    return {
      config: config,
      preScannedTexts: preScannedTexts,
      inputText: '',
      result: null,
      resultToCompare: null,
      errors: null,
      fakeInitiative: null,
      inProgress: false,
      estimatedTime: 0,
      textToCompare: null,
      csvItems: [],
      csvFields: ['topic', 'subtopic', 'tag', 'times'],
      styles: config.STYLES,
    };
  },
  computed: {
    ...mapState(['allTopics']),
    subtitle () {
      return this.estimatedTime ? `Tardaremos unos ${this.estimatedTime} segundos en mostrarte resultados. No te vayas` : "Ten paciencia, estamos trabajando duro"
    }
  },
  methods: {
    cleanText() {
      this.inputText = ""
    },
    cleanResult() {
      this.fakeInitiative = null
      this.result = null
    },
    cleanTextAndResult() {
      this.cleanText()
      this.cleanResult()
    },
    annotate() {
      this.cleanResult();
      this.inProgress = true;
      document.getElementById('start').text = 'Procesando...'
      this.fakeInitiative = null
      api.annotate(this.inputText)
        .then(response => {
          if (response.status==="SUCCESS") {
            this.result = response.result
            this.csvItems = this.result.tags
            this.fakeInitiative = {
              'topics': this.result.topics,
              'tags': this.result.tags
            }
            this.inProgress = false;
            document.getElementById('start').text = 'Iniciar proceso'
            VueScrollTo.scrollTo('#result', 1500)
          } else if (response.status==="PROCESSING") {
            this.estimatedTime = response.estimated_time
            setTimeout(() => {
              this.getAsyncResults(response.task_id)
            }, response.estimated_time * 1000);
          }
        })
        .catch(error => {
          this.errors = error.response.data.message
          this.inProgress = false;
          document.getElementById('start').text = 'Iniciar proceso'
        });
    },
    getNameFromCSV: function() {
      let d = new Date();
      return "export-scanner-" + d.toISOString() + ".csv";
    },
    getAsyncResults: function(taskID) {
      api.getScannerResult(taskID).then(response => {
        if (response.data.status==="SUCCESS") {
          this.result = response.data.result
          this.csvItems = this.result.tags
          this.fakeInitiative = {
            'topics': this.result.topics,
            'tags': this.result.tags
          }
          this.inProgress = false;
          document.getElementById('start').text = 'Iniciar proceso'
          VueScrollTo.scrollTo('#result', 1500)
        } else if (response.data.status==="PENDING") {
          setTimeout(() => {
            this.getAsyncResults(taskID)
          }, 3000);
        }
      }).catch(() => {
        setTimeout(() => {
          this.getAsyncResults(taskID)
        }, 3000);
      })
    }
  },
  watch: {
    textToCompare(val) {
      const compareWith = preScannedTexts.filter(d => d.title === val);
      this.resultToCompare = compareWith.length
        ? compareWith[0]
        : null;
    },
  },
};
</script>
