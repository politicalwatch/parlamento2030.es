<template>
  <div>
    <div id="scanner" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Scanner"/>

        <div class="o-grid u-margin-bottom-4">
          <div class="o-grid__col u-12 u-6@sm">
            <tipi-message type="info" icon><div v-html="'Abrimos nuestra tecnología al mundo para que puedas escanear y etiquetar en clave de los 17 ODS y sus metas cualquier tipo de texto de la misma manera que Parlamento 2030 lo hace con la actividad parlamentaria española.'"></div></tipi-message>
          </div>

          <div class="o-grid__col u-12 u-6@sm">
            <p><textarea placeholder="Inserta aqui el texto que quieres escanear..." v-model="inputText" rows="9"/></p>
            <div class="c-input-label c-input-label--file u-block">
              <label for="file">Sube un archivo</label>
              <input type="file" id="file" name="file" v-on:change="loadSelectedFile" placeholder="PDF, doc o txt">
              <small class="u-color-secondary">pdf, txt, doc, docx, odt, xls, xlsx, ppt, pptx, jpg, png, gif, html</small>
            </div>
            <p>
            <a id="start" class="c-button c-button--primary" @click.prevent="annotate">Iniciar proceso</a>
            <a class="c-button" :class="{ disabled: inProgress }" v-if="hasInput" @click="cleanTextAndResult">Limpiar</a>
            </p>
          </div>
        </div>

        <div id="result" class="o-section o-grid">
          <div v-if="inProgress || errors" class="o-grid__col u-12">
            <tipi-message v-if="errors" type="error" icon>{{errors}}</tipi-message>
            <tipi-loader v-if="inProgress" title="Escaneando resultados" :subtitle="subtitle" />
          </div>
          <div class="o-grid__col u-12 result" v-if="result">

            <tipi-message v-if="!result.topics.length" type="error" icon>No hemos encontrado ninguna coincidencia entre tu texto y nuestras etiquetas.</tipi-message>

            <div v-else>

              <scanner-visualizations :result="result"></scanner-visualizations>

            </div>


            <!-- Begin CTAs -->
            <div class="o-grid o-grid--wide o-grid--center u-bg-primary-light u-padding-top-8 u-padding-bottom-8 u-margin-top-8" v-if="result.topics.length">
              <div class="o-grid__col u-12 u-12@xs u-10@sm u-text-center">
                <h5>Lorem fistrum amatomaa</h5>
                <p>Sexuarl mamaar no te digo trigo por no llamarte Rodrigor la caidita por la gloria de mi madre ese pedazo de quietooor sexuarl a gramenawer. Amatomaa va usté muy cargadoo sexuarl de la pradera benemeritaar tiene musho peligro quietooor te voy a borrar el cerito jarl. Tiene musho peligro qué dise usteer ese pedazo de sexuarl al ataquerl quietooor al ataquerl. </p>
                <a @click="saveResult" class="c-button c-button--primary">Guarda el resultado</a>
              </div>
            </div>
            <!-- End CTAs -->


          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import { TipiMessage, TipiHeader, TipiLoader } from 'tipi-uikit';
import ScannerVisualizations from '@/components/scanner-visualizations.vue';
import swal from 'sweetalert2';
import api from '@/api';

const VueScrollTo = require('vue-scrollto');

export default {
  name: 'scanner',
  components: {
    TipiHeader,
    TipiMessage,
    TipiLoader,
    ScannerVisualizations
  },
  data() {
    return {
      inputText: '',
      inputFile: null,
      result: null,
      errors: null,
      inProgress: false,
      estimatedTime: 0,
      csvItems: [],
      csvFields: ['topic', 'subtopic', 'tag', 'times'],
      excerptText: '',
      scanned: {},
      tagsInWordCloud: 25,
    };
  },
  computed: {
    subtitle () {
      return this.estimatedTime ? `Tardaremos unos ${this.estimatedTime} segundos en mostrarte resultados. No te vayas` : "Ten paciencia, estamos trabajando duro"
    },
    hasInput () {
      return this.inputText!='' || this.inputFile!=null
    }
  },
  methods: {
    cleanText() {
      this.inputText = ""
      this.inputFile = null
      document.getElementById("file").value = "";
    },
    cleanResult() {
      this.result = null
      this.errors = null
    },
    cleanTextAndResult() {
      this.cleanText()
      this.cleanResult()
    },
    loadSelectedFile(event) {
      this.inputFile = event.target.files[0]
    },
    annotate() {
      this.cleanResult();
      this.inProgress = true;
      document.getElementById('start').text = 'Procesando...'
      api.annotate(this.inputText, this.inputFile)
        .then(response => {
          if (response.data.status==="SUCCESS") {
            this.result = response.data.result
            this.excerptText = response.data.excerpt
            this.inProgress = false;
            document.getElementById('start').text = 'Iniciar proceso'
            VueScrollTo.scrollTo('#result', 1500)
          } else if (response.data.status==="PROCESSING") {
            this.estimatedTime = response.data.estimated_time
            setTimeout(() => {
              this.getAsyncResults(response.data.task_id)
            }, response.data.estimated_time * 1000);
          }
        })
        .catch(error => {
          if (error.response.status == 429) this.errors = "Has sobrepasado el límite de escaneos por hora. Vuelve a intentarlo pasado un tiempo."
          else if (error.response.status == 413) this.errors = "Fichero demasiado pesado para procesarlo. Pruebe con otro más liviano."
          else this.errors = error.response.data.message
          this.inProgress = false;
          document.getElementById('start').text = 'Iniciar proceso'

        });
    },
    saveResult: function() {
      swal({
        title: 'Ponle un nombre',
        input: 'text',
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        confirmButtonAriaLabel: 'Guardar',
        cancelButtonText: 'Cancelar',
        cancelButtonAriaLabel: 'Cancelar'
      })
        .then(title => {
          if (!title.value) throw null;

          api.saveScanned(title.value, this.excerptText, this.result)
            .then(response => {

              swal({
                title: 'Guardado!',
                text: 'Texto escaneado guardado satisfactoriamente',
                focusConfirm: false,
                confirmButtonText: 'Continuar',
                confirmButtonAriaLabel: 'Continuar',
                type: 'success'
              }).then(function (){
                this.scanned.title = response.data.title
                this.scanned.excerpt = response.data.excerpt
                this.$router.replace({
                  name: 'scanned',
                  params: {
                    id: response.data.id
                  }
                });
              }.bind(this, response.data));
            })
            .catch(
              error => {
                const limited = error.response.status === 429;
                swal({
                  title: limited ? 'Limite excedido por hora' : 'Error al guardar el texto escaneado',
                  text: 'Inténtalo de nuevo más tarde',
                  focusConfirm: false,
                  type: 'error'
                });
              }
            );

        })
        .catch(error => {
          this.errors = error
        });
    },
    getAsyncResults: function(taskID) {
      api.getScannerResult(taskID).then(response => {
        if (response.data.status==="SUCCESS") {
          this.result = response.data.result
          this.excerptText = response.data.excerpt
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
  }
};
</script>
