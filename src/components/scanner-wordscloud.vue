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
      odsColors: {
        'ODS 1 - Fin de la Pobreza': '#E5243C',
        'ODS 2 - Hambre Cero': '#DDA839',
        'ODS 3 - Salud y bienestar': '#4C9F38',
        'ODS 4 - Educación de calidad': '#C51A2D',
        'ODS 5 - Igualdad de género': '#F93A22',
        'ODS 6 - Agua limpia y saneamiento': '#2CBDE2',
        'ODS 7 - Energía asequible y no contaminante': '#FCC30A',
        'ODS 8 - Trabajo decente y crecimiento económico': '#A21943',
        'ODS 9 - Industrial, innovación e infraestructura': '#FA6926',
        'ODS 10 - Reducción de las desigualdades': '#DD1267',
        'ODS 11 - Ciudades y comunidades sostenibles': '#FB9E23',
        'ODS 12 - Producción y consumo responsables': '#BF8C2E',
        'ODS 13 - Acción por el clima': '#3F7D44',
        'ODS 14 - Vida submarina': '#1D97D9',
        'ODS 15 - Vida de ecosistemas terrestres': '#56C029',
        'ODS 16 - Paz, justicia e instituciones sólidas': '#10699D',
        'ODS 17 - Alianzas para lograr los objetivos': '#021D8D',
      },
    };
  },
  props: {
    result: {
      type: Object || null,
      required: true,
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
        color: this.odsColors[d.topic],
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
