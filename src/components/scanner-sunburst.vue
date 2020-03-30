<template>
  <D3Sunburst class="scanner-sunburst" :config="config" :datum="datum" :height="400" title="Clasificación de resultados"></D3Sunburst>
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
        },
        tooltip: { suffix: 'ocurrencias' },
        transition: { duration: 1000 },
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
        const topicname = `${d.topic.split(' ')[0]} ${d.topic.split(' ')[1]}`;
        const subtopicname = d.subtopic;
        const tagname = `${topicname} | ${d.tag}`;

        if (topics.indexOf(topicname) === -1) {
          // Topic is new -> append topic, subtopic and tag
          sunburstitems.children.push({
            name: topicname,
            color: this.styles.topics[d.topic].color,
            children: [{
              name: subtopicname,
              color: d3.color(this.styles.topics[d.topic].color).brighter(0.5).formatHex(),
              children: [{
                name: tagname,
                color: d3.color(this.styles.topics[d.topic].color).brighter(1).formatHex(),
                value: d.times,
              }]
            }]
          });
        } else {
          // Topic exists -> check for subtopic
          const subtopics = sunburstitems
            .children[topics.indexOf(topicname)]
            .children.map(d => d.name);
          if(subtopics.indexOf(subtopicname) === -1) {
            // Subtopic is new -> append subtopic and tag
            sunburstitems
              .children[topics.indexOf(topicname)]
              .children.push({
              name: subtopicname,
              color: d3.color(this.styles.topics[d.topic].color).brighter(0.5).formatHex(),
              children: [{
                name: tagname,
                color: d3.color(this.styles.topics[d.topic].color).brighter(1).formatHex(),
                value: d.times,
              }]
            })
          } else {
            // Subtopic exists -> check for tag
            const tags = sunburstitems
              .children[topics.indexOf(topicname)]
              .children[subtopics.indexOf(subtopicname)]
              .children.map(d => d.name);

            if(tags.indexOf(tagname) === -1) {
              // Tag is new -> append tag
              sunburstitems
                .children[topics.indexOf(topicname)]
                .children[subtopics.indexOf(subtopicname)]
                .children.push({
                name: tagname,
                color: d3.color(this.styles.topics[d.topic].color).brighter(1).formatHex(),
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

<style lang="scss">
.scanner-sunburst {
  .chart__source {
    text-align: center;
  }
}
</style>
