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
          <h4>Resultado del escáner:</h4>
          <tipi-message v-if="!result.topics.length" type="error" icon>No hemos encontrado ninguna coincidencia entre tu texto y nuestras etiquetas.</tipi-message>
          <div v-else>

            <div class="o-grid">
              <div class="o-grid__col u-12 u-7@sm">
                <tipi-message type="info" icon>Si haces clic en cualquiera de las etiquetas relacionadas con tu texto podrás conocer además toda la actividad parlamentaria asociada con dicha etiqueta.</tipi-message >
                <tipi-topics meta="ODS tratados" :topics="result.topics" :tags="result.tags" :topicsStyles="styles.topics"/>
              </div>

              <div class="o-grid__col u-12 u-offset-2@sm u-3@sm">
                <tipi-message type="info" icon>Aquí tienes una relación visual de tu texto, para que de un vistazo puedas ver las conexiones temáticas existentes</tipi-message>
                <InitiativeChart :initiative="fakeInitiative" :topics="allTopics" :styles="styles"></InitiativeChart>
                <span class="u-text-tbody2">Relación del resultado con los ODS <sup title="El gráfico muestra los ODS relacionados con el texto y el grado de relación con cada uno de ellos, cuya intensidad se muestra en cuánto de coloreado está cada ODS en al gráfica."><i class="fa fa-question-circle"></i></sup></span>
              </div>
            </div>

            <div class="u-padding-top-10">
              <h5>Distribución de los resultados:</h5>
              <tipi-message type="info" icon>Puedes hacer zoom haciendo click en cada una de las porciones.</tipi-message>
              <div class="o-grid">
                <div class="o-grid__col u-12 u-6@sm">
                  <ScannerSunburst :result="this.result" :styles="styles"></ScannerSunburst>
                </div>
                <div class="o-grid__col u-12 u-6@sm">
                  <ScannerWordsCloud :result="this.result" :styles="styles"></ScannerWordsCloud>
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
              <ScannerTable :result="this.result"></ScannerTable>
            </div>

            <div class="o-grid__col u-12 u-text-center u-margin-top-4 u-padding-top-4 u-border-top">
              <tipi-csv-download
                :initiatives="csvItems || []"
                :csvItems="csvItems"
                :csvFields="csvFields"
                :canDownloadCSV="true"
                button-class="c-button--primary"
                label="Descárgalo en CSV"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { TipiMessage, TipiHeader, TipiLoader, TipiTopics, TipiNeuron, TipiCsvDownload } from 'tipi-uikit'
import Multiselect from 'vue-multiselect';
import config from '@/config';
import preScannedTexts from '@/scanned';
import api from '@/api';
import { mapState } from 'vuex';
import ScannerWordsCloud from '@/components/scanner-wordscloud.vue';
import ScannerSunburst from '@/components/scanner-sunburst.vue';
import ScannerBarchart from '@/components/scanner-barchart.vue';
import ScannerTable from '@/components/scanner-table.vue';
import InitiativeChart from '@/components/initiative-chart.vue';

const VueScrollTo = require('vue-scrollto');

export default {
  name: 'tagger',
  components: {
    TipiHeader,
    TipiTopics,
    TipiNeuron,
    TipiCsvDownload,
    ScannerWordsCloud,
    ScannerSunburst,
    ScannerBarchart,
    ScannerTable,
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
      csvFields: ['topic', 'subtopic', 'tag'],
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

      /**
      * Mock API response
      * Remove from here when work is done
      */
      const response = {"status": "SUCCESS", "result": {"topics": ["ODS 13 Acci\u00f3n por el clima", "ODS 14 Vida submarina", "ODS 3 Salud y bienestar", "ODS 7 Energ\u00eda asequible y no contaminante", "ODS 8 Trabajo decente y crecimiento econ\u00f3mico"], "tags": [{"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.1 Adaptaci\u00f3n frente a desastres naturales", "tag": "Crisis clim\u00e1tica", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.1 Adaptaci\u00f3n frente a desastres naturales", "tag": "Emergencia clim\u00e1tica", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.1 Adaptaci\u00f3n frente a desastres naturales", "tag": "Riesgos relacionados con el clima y los desastres naturales", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Acuerdo de Par\u00eds", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Calentamiento global", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Cambio clim\u00e1tico", "times": 15}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Cambio clim\u00e1tico e impacto", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Contaminaci\u00f3n atmosf\u00e9rica", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Descarbonizaci\u00f3n", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Efecto invernadero", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Emisiones de CO2", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Emisiones de gases de efecto invernadero", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Estrategia de Transici\u00f3n Justa", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Gases efecto invernadero", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Grupo Intergubernamental de Expertos sobre el Cambio Clim\u00e1tico (IPCC)", "times": 2}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "IPCC", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Ley de Cambio Clim\u00e1tico y Transici\u00f3n Energ\u00e9tica", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Plan Nacional Integrado de Energ\u00eda y Clima", "times": 3}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Transici\u00f3n energ\u00e9tica", "times": 1}, {"topic": "ODS 13 Acci\u00f3n por el clima", "subtopic": "13.2 Planes nacionales contra el cambio climatico", "tag": "Transici\u00f3n justa", "times": 1}, {"topic": "ODS 14 Vida submarina", "subtopic": "14.3 Acidificaci\u00f3n de los oc\u00e9anos", "tag": "Nivel del mar", "times": 1}, {"topic": "ODS 3 Salud y bienestar", "subtopic": "3.9 Productos qu\u00edmicos y contaminaci\u00f3n", "tag": "Enfermedad y factores ambientales", "times": 1}, {"topic": "ODS 3 Salud y bienestar", "subtopic": "3.9 Productos qu\u00edmicos y contaminaci\u00f3n", "tag": "Enfermedades causadas por la poluci\u00f3n", "times": 1}, {"topic": "ODS 7 Energ\u00eda asequible y no contaminante", "subtopic": "7.1 Acceso universal a energ\u00eda", "tag": "Ley de transici\u00f3n energ\u00e9tica", "times": 1}, {"topic": "ODS 7 Energ\u00eda asequible y no contaminante", "subtopic": "7.2 Aumento de energ\u00edas renovables", "tag": "Transici\u00f3n energ\u00e9tica", "times": 1}, {"topic": "ODS 8 Trabajo decente y crecimiento econ\u00f3mico", "subtopic": "8.5 Trabajo decente", "tag": "Creaci\u00f3n de empleo", "times": 1}, {"topic": "ODS 8 Trabajo decente y crecimiento econ\u00f3mico", "subtopic": "8.5 Trabajo decente", "tag": "Transici\u00f3n justa", "times": 1}]}}
      this.result = response.result;
      this.csvItems = this.result.tags
      this.fakeInitiative = {
        'topics': this.result.topics,
        'tags': this.result.tags
      }
      this.inProgress = false;
      document.getElementById('start').text = 'Iniciar proceso'
      VueScrollTo.scrollTo('#result', 1500)
      // Remove up to here when work is done

      /**
      * Uncomment this when work is done

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
        */
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
