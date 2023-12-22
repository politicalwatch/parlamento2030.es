<template>
  <div class="sankey-chart-initiatives-flow ">
    <svg id="canvas" :height="height" :width="width">
      <g
        :transform="`translate(${SANKEY_GLOBAL_PADDING_X},${SANKEY_GLOBAL_PADDING_Y})`"
        ref="canvas"
      ></g>
    </svg>
    <transition name="popup">
      <div
        class="simple-tooltip"
        v-show="selectedSubtopic"
        :style="{ top: tooltipInfo.y + 'px', left: tooltipInfo.x + 'px' }"
      >
        <div
          class="simple-tooltip-inner"
          v-if="selectedSubtopic"
          :style="{
            'background-color': tooltipInfo.color,
          }"
        >
          <div>
            <i v-html="selectedSubtopic.name"></i>
          </div>

          <div style="margin-top:1rem">
            Apariciones: <strong>{{ selectedSubtopic.value }} </strong>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import * as d3 from 'd3';
import * as d3sankey from 'd3-sankey';
import slugify from 'slugify';
import { textWrap } from 'd3plus-text';
// testing at: http://localhost:5173/iniciativas/162-001066

import { computed, ref, onMounted } from 'vue';
import { sub } from 'date-fns';

const props = defineProps({
  initiative: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  topics: {
    type: Array,
    required: true,
    default: () => [],
  },
  styles: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  totalWidth: {
    type: Number,
    default: 1100,
  },
});

const selectedSubtopic = ref(null);
const tooltipInfo = ref({ x: 0, y: 0 });

//**** data processing  */
const buildNodes = (allTags) => {
  const root = {
    name: 'root',
    children: [],
  };
  const subtopics = [];
  const stdTags = allTags.map((t) => ({
    name: t.tag,
    value: t.times,
    subtopic: t.subtopic,
    topic: t.topic,
    color: '#D4D5E1',
    type: 'tag',
  }));

  for (const tag of stdTags) {
    const subtopic = subtopics.find((s) => s.name === tag.subtopic);
    if (subtopic) {
      subtopic.value += tag.value;
      subtopic.children.push(tag);
    } else {
      subtopics.push({
        name: tag.subtopic,
        topic: tag.topic,
        children: [tag],
        value: tag.value,
        type: 'subtopic',
        color: props.styles.topics[tag.topic].color,
      });
    }
    if(tag.subtopic === '2.1 Acceso universal a alimentos')
    console.log(tag)
  }



  

  const topics = [];
  for (const subtopic of subtopics) {
    const topic = topics.find((t) => t.name === subtopic.topic);
    if (topic) {
      topic.value += subtopic.value;
      topic.children.push(subtopic);
    } else {
      topics.push({
        name: subtopic.topic,
        children: [subtopic],
        value: subtopic.value,
        type: 'topic',
        color: props.styles.topics[subtopic.topic].color,
      });
    }
  }
  // fix: I found that a tag can be present several times for different subtopics
  // lets merge duplicate tags in the stdTags array
  const stdTagsMap = {};
  for (const tag of stdTags) {
    if (stdTagsMap[tag.name]) {
      // stdTagsMap[tag.name].value += tag.value;
    } else {
      stdTagsMap[tag.name] = tag;
    }
  }
  const stdTagsMapValues = Object.values(stdTagsMap);
  console.log(stdTagsMapValues);
  
  
  console.log(subtopics);
  return [...topics, ...subtopics, ...stdTagsMapValues];
};

function buildLinksFromNodes(nodes) {
  const topicNodes = nodes.filter((n) => n.type === 'topic');
  const subtopicNodes = nodes.filter((n) => n.type === 'subtopic');
  const links = [];
  for (const node of topicNodes) {
    if (node.children) {
      for (const child of node.children) {
        links.push({
          source: node.name,
          target: child.name,
          value: child.value,
          id: `${node.name}-${child.name}`,
        });
      }
    }
  }
  for (const node of subtopicNodes) {
    if (node.children) {
      for (const child of node.children) {
        links.push({
          source: node.name,
          target: child.name,
          value: child.value,
          id: `${node.name}-${child.name}`,
        });
      }
    }
  }
  return links;
}

const nodes = buildNodes(props.initiative.tagged[0].tags);
const links = buildLinksFromNodes(nodes);
console.log(nodes);
console.log(links);

/** sizes block */
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const width = computed(() => props.totalWidth - margin.left - margin.right);
const height = computed(() => 700 - margin.top - margin.bottom);

const NODE_WIDTH = 32;
const NODE_PADDING = 14;

const VERT_PADDING = 20;
const TEXT_SPACING_EXTREMES = 20;
const TEXT_PADDING = VERT_PADDING;
const SMALL_NODE_WIDTH = 20;
const CENTER_NODE_WIDTH = NODE_WIDTH;

const SANKEY_GLOBAL_PADDING_X = 300;
const SANKEY_GLOBAL_PADDING_Y = 40;

/****************  Sankey building ************************/
onMounted(() => {
  initChart();
  updateChart();
});

let sankey = null;
let svg = null;
let graph = null;
const canvas = ref(null);
const initChart = function () {
  sankey = sankeyGenerator();
  try {
    graph = sankey({
      nodes: nodes.map((d) => Object.assign({}, d)),
      links: links.map((d) => Object.assign({}, d)),
    });
  } catch (e) {
    console.log(e);
    return;
  }

  svg = d3.select(canvas.value);
  svg.selectAll('g').remove();
  svg.append('g').classed('links', true);
  svg.append('g').classed('nodes', true);
  updateChart('init chart mounted');
};

function sankeyGenerator() {
  return (
    d3sankey
      .sankey() //generator
      //.nodeAlign(d3[`sankey${align[0].toUpperCase()}${align.slice(1)}`])
      .nodeWidth(NODE_WIDTH)
      .nodePadding(NODE_PADDING)
      .nodeAlign(d3sankey.sankeyJustify)
      .nodeId((d) => {
        return d.name;
      })
      .iterations(0) // 6
      .extent([
        [0, 0],
        [
          width.value - SANKEY_GLOBAL_PADDING_X * 2,
          height.value - SANKEY_GLOBAL_PADDING_Y * 2,
        ],
      ])
  );
}

function updateChart(from) {
  graph = sankey({
    nodes: nodes.map((d) => Object.assign({}, d)),
    links: links.map((d) => Object.assign({}, d)),
  });

  let links_update = svg
    .select('g.links')
    .selectAll('path')
    .data(graph.links, (d) => d.name);

  let links_enter = links_update.enter().append('path');

  links_enter
    .merge(links_update)
    .attr('class', (d) => {
      return (
        'link ' +
        'n-' +
        slugify(d.source.name, { strict: true, lower: true }) +
        ' n-' +
        slugify(d.target.name, { strict: true, lower: true })
      );
    })
    .transition()
    .duration(1000)
    .attr('d', d3sankey.sankeyLinkHorizontal())
    .attr('fill', 'none')
    .attr('stroke-width', (d) => d.width)
    .attr('stroke-opacity', 0.5)
    .style('stroke', (d) => {
      return d3.color(d.source.color).brighter(0.2);
    });

  // nouse interaction
  links_enter
    .on('mousemove', (event, d) => {
      d3.select(event.target).raise();
      d3.selectAll('.link').classed('faded', true);

      d3.select(event.target).classed('faded', false);

      //       grey out nodes
      d3.selectAll('g.node').classed('faded', true);
      // select adjacent nodes
      d3.selectAll(
        'g.node.n-' + slugify(d.source.name, { strict: true, lower: true })
      ).classed('faded', false);
      d3.selectAll(
        'g.node.n-' + slugify(d.target.name, { strict: true, lower: true })
      ).classed('faded', false);

      // show tooltip:
      selectedSubtopic.value = {
        name: d.source.name +'<br>' + "&#8593" +'<br/>'+ d.target.name,
        value: d.value,
      }
      tooltipInfo.value = {
        x: event.pageX,
        y: event.pageY,
        color: '#444'
      };
    })
    .on('mouseout', (event) => {
      selectedSubtopic.value = null;
      // d3.select(event.target)
      //   //.attr("stroke", (d)=> { return this.color(d) } )
      //   .classed("selected", false);
      d3.selectAll('.link').classed('faded', false);
      d3.selectAll('.node').classed('faded', false);
    });

  links_update.exit().remove();

  let nodes_update = svg
    .select('g.nodes')
    .selectAll('g.node')
    .data(graph.nodes, (d) => d.name);

  let nodes_enter = nodes_update
    .enter()
    .append('g')
    .attr('class', (d) => 'n-' + slugify(d.name, { strict: true, lower: true }))
    .classed('node', true);

  nodes_enter
    .merge(nodes_update)
    .attr('transform', (d) => getNodePosition(d)) //`translate(${d.x0}, ${d.y0})`)
    .on('click', (event, d) => {});

  //nested general update pattern: https://bl.ocks.org/curran/1b162368fd3b5a3c623b038c4cd64d37
  nodes_enter
    .append('rect')
    .merge(nodes_update.select('rect'))
    .attr('fill', (d) => d.color)
    .transition()
    .duration(1000)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', (d) => NODE_WIDTH)
    .attr('height', (d) => Math.max(d.y1 - d.y0, 14));

  //.append("title")

  // add in the title for the nodes
  let textnode = nodes_enter
    .append('text')
    .merge(nodes_update.select('text'))
    .attr('text-anchor', (d) => {
      if (d.layer === 0) return 'end';
      if (d.layer === 2) return 'start';
      else return 'middle';
    })
    .attr('x', (d) => {
      if (d.layer === 0) return -TEXT_PADDING;
      else if (d.layer === 2) return TEXT_PADDING + SMALL_NODE_WIDTH;
      else return CENTER_NODE_WIDTH / 2;
    })
    .attr('y', (d) => {
      return (d.y1 - d.y0) / 2 + 7;
    })
    .attr('class', (d) => {
      return 'layer-' + d.layer;
    })
    .text((d) => {
      if (d.layer === 0) return d.name;
      if (d.layer === 2) return d.name;
      else return d.name.split(' ')[0];
    });
  textnode.raise();

  nodes_update.exit().remove();
  textnode.exit().remove();

  nodes_enter
    .on('mouseover', (event, d) => {
      selectedSubtopic.value = d;
      tooltipInfo.value = {
        x: event.pageX,
        y: event.pageY-20,
        color: d.layer===2 ? '#444':  d.color,
      };
      d3.select(event.target).classed('selected',true);
      // grey out the other nodes and links and highlight only the ones connected to this node
      d3.selectAll('.link').classed('faded', true);
      d3.selectAll(
              ".link.n-" + slugify(d.name, { strict: true, lower: true })
            ).classed("faded", false);
    })
    .on('mouseout', () => {
      selectedSubtopic.value = null;
      d3.select('.selected')
              //.attr("stroke", (d)=> { return this.color(d) } )
              .classed("selected", false);
            d3.selectAll("g.node").classed("faded", false);
           d3.selectAll(".link").classed("faded", false);
    });

  function getNodePosition(d) {
    if (d.layer == 1) {
      return `translate(${d.x0}, ${d.y0})`;
    }
    if (d.layer === 0) {
      return `translate(${d.x0}, ${d.y0})`;
    }
    if ((d.layer = 2)) {
      return `translate(${d.x0}, ${d.y0})`;
    }
  }
}
</script>

<style lang="scss">
.sankey-chart-initiatives-flow {
  .faded {
  }

  .nodes text {
    font-size: 15px;
    font-weight: lighter;
    pointer-events: none;
    fill: #444;
  }
  .nodes text.layer-1 {
    font-weight: bolder;
    font-size: 13px;
    fill: white;
  }

  .node.interactive {
    cursor: pointer;
  }

  
  .node rect {
    opacity: 0.9;
    transition: opacity 0.2s ease-out;
  }

  path.link.selected {
    stroke: black !important;
  }

  path.link {
    opacity: 0.8;
    transition: opacity 0.2s ease-out;
  }

  .node:hover {
    filter: opacity(1);
  }
}

.simple-tooltip {
  position: absolute;
  z-index: 10;
  padding: 0px;
  border-radius: 5px;
  pointer-events: none;
  width: auto;
  min-width: 100px;
  min-height: 50px;
  font-size: 14px;
}
.simple-tooltip-inner {
  padding: 12px;
  color: white;
  transform: translate(-50%, 0);
  opacity: 0.99;
  border: 2px solid white;
}

.popup-enter-active,
.popup-leave-active {
  transition: transform 0.2s ease-out;
}

.popup-enter,
.popup-leave-to {
  transform: scale(0);
}

.node.faded rect {
  opacity: 0.2;
}

.link.faded {
  opacity: 0.2!important;
}

rect.selected  {
  opacity:1!important;
  stroke-width: 2px!important;
  stroke:white!important;
}
</style>
