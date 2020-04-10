<template>
  <div>
    <div id="scanner" class="o-container o-section u-margin-bottom-10" v-if="result">
      <tipi-header :title="title"/>

        <div id="result" class="o-section o-grid">
          <div class="o-grid__col u-12 result">

            <div class="u-padding-bottom-10">
              <h5>Extracto del texto:</h5>
              <div class="o-grid__col u-12 u-8@sm u-12@xs">
                <p class="u-color-secondary">{{ excerpt }}</p>
              </div>
            </div>


            <scanner-visualizations :result="result"></scanner-visualizations>

          </div>


          <!-- Begin CTAs -->
          <div class="o-grid o-grid--wide o-grid--center u-bg-primary-light u-padding-top-8 u-padding-bottom-8 u-margin-top-8">
            <div class="o-grid__col u-12 u-12@xs u-10@sm u-text-center">
              <h5>Lorem fistrum amatomaa</h5>
              <p>Sexuarl mamaar no te digo trigo por no llamarte Rodrigor la caidita por la gloria de mi madre ese pedazo de quietooor sexuarl a gramenawer. Amatomaa va usté muy cargadoo sexuarl de la pradera benemeritaar tiene musho peligro quietooor te voy a borrar el cerito jarl. Tiene musho peligro qué dise usteer ese pedazo de sexuarl al ataquerl quietooor al ataquerl. </p>
              <router-link :to="{name:'scanner'}" class="c-button c-button--primary">Escanear ahora</router-link>
            </div>
          </div>
          <!-- End CTAs -->


        </div>
    </div>
  </div>
</template>

<script>
  import { TipiHeader } from 'tipi-uikit';
import ScannerVisualizations from '@/components/scanner-visualizations.vue';
import preScannedTexts from '@/scanned';
import api from '@/api';

export default {
  name: 'scanned',
  components: { 
    TipiHeader,
    ScannerVisualizations
  },
  data() {
    return {
      preScannedTexts: preScannedTexts,
      resultToCompare: null,
      textToCompare: null,
      csvItems: [],
      csvFields: ['topic', 'subtopic', 'tag', 'times'],
      title: null,
      excerpt: null,
      result: null,
      tagsInWordCloud: 25,
    };
  },
  methods: {
    getScanned: function() {
      api.getScanned(this.$route.params.id)
        .then(response => {
          this.title = response.title
          this.excerpt = response.excerpt
          this.result = response.result
        })
        .catch(error => {
          this.errors = error
          this.$router.push({name: 'Page404', params: { '0': '404'}})
        });
    }
  },
  created: function() {
    this.getScanned()
  },
  watch: {
    '$route': 'getScanned'
  }
};
</script>

