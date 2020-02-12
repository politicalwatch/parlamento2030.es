<template>
  <D3Sunburst :config="config" :datum="datum" :height="600"></D3Sunburst>
</template>


<script>
import { color } from 'd3-color';
import { D3Sunburst } from 'tipi-uikit';
const d3 = {color};

export default {
  name: 'ScannerSunburst',
  components: {
    D3Sunburst,
  },
  data() {
    return {
      datum: [{
        name:'Resultados',
        children: [],
        color: '#EEE',
      }],
      config: {
        key: 'name',
        value: 'value',
        color: {
          key: 'color',
        }
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
      * Generate hierarchycal data from
      * tags array
      */
      if (!this.result.tags) return;

      // Parent element
      const sunburstitems = {
        name: 'Resultados',
        children: [],
        color: '#EEE',
      }

      this.result.tags.forEach((d) => {
        const topics = sunburstitems.children.map(d => d.name);
        const topiccode = d.topic.split("-")[0].trim();

        if (topics.indexOf(d.topic) === -1) {
          // Topic is new -> append topic, subtopic and tag
          sunburstitems.children.push({
            name: d.topic,
            color: this.odsColors[d.topic],
            children: [{
              name: d.subtopic,
              color: d3.color(this.odsColors[d.topic]).brighter(0.5).formatHex(),
              children: [{
                name: `${topiccode}: ${d.tag}`,
                color: d3.color(this.odsColors[d.topic]).brighter(1).formatHex(),
                value: d.times,
              }]
            }]
          });
        } else {
          // Topic exists -> check for subtopic
          const subtopics = sunburstitems
            .children[topics.indexOf(d.topic)]
            .children.map(d => d.name);
          if(subtopics.indexOf(d.subtopic) === -1) {
            // Subtopic is new -> append subtopic and tag
            sunburstitems
              .children[topics.indexOf(d.topic)]
              .children.push({
              name: d.subtopic,
              color: d3.color(this.odsColors[d.topic]).brighter(0.5).formatHex(),
              children: [{
                name: `${topiccode}: ${d.tag}`,
                color: d3.color(this.odsColors[d.topic]).brighter(1).formatHex(),
                value: d.times,
              }]
            })
          } else {
            // Subtopic exists -> check for tag
            const tags = sunburstitems
              .children[topics.indexOf(d.topic)]
              .children[subtopics.indexOf(d.subtopic)]
              .children.map(d => d.name);

            if(tags.indexOf(`${topiccode}: ${d.tag}`) === -1) {
              // Tag is new -> append tag
              sunburstitems
                .children[topics.indexOf(d.topic)]
                .children[subtopics.indexOf(d.subtopic)]
                .children.push({
                name: `${topiccode}: ${d.tag}`,
                color: d3.color(this.odsColors[d.topic]).brighter(1).formatHex(),
                value: d.times,
              })
            }
          }
        }
      });

      this.datum = [sunburstitems];
    }
  },
  watch: {
    result() {
      this.parseResults();
    },
  },
};
</script>