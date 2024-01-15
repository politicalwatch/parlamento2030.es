<template>
  <div class="sankey-chart-initiatives-flow" ref="chartWrapper">
    <div class="o-grid chart-titles" style="">
      <div class="o-grid__col u-4"> ODS </div>
      <div class="o-grid__col u-4"> META</div>
      <div class="o-grid__col u-4"> ETIQUETA </div>
    </div>
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

          <div style="margin-top: 1rem">
            Apariciones: <strong>{{ selectedSubtopic.value }} </strong>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
/*
 * This component paints a sankey diagram with the tags of an initiative
 * The sankey takes the whole width of the parent container
 * for a smaller or larger sankey the parent container of ref="chartWrapper" should be resized accordingly
 * Is relatively responsive, but the nodes are not resized. Since tags are long this requieres at least 960px
 * This implementation is not reactive to changes in the data (not necessary since data is static), but it is reactive to changes in the width of the parent container
 * canvas height is relative to the number of nodes
 */
import { select, selectAll, color } from 'd3';
import * as d3sankey from 'd3-sankey';
import slugify from 'slugify';
import { textWidth } from 'd3plus-text';
// testing at: http://localhost:5173/iniciativas/162-001066
// more complex: http://localhost:5173/iniciativas/162-000605

import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { ca } from 'date-fns/locale';

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
    color: props.styles.topics[t.topic].color,
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
    // if (tag.subtopic === '2.1 Acceso universal a alimentos') console.log(tag);
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

  // sort topics by ods number
  try {
    topics.sort((a, b) => {
      const aNum = a.name.split(' ')[1];
      const bNum = b.name.split(' ')[1];
      if (parseInt(aNum) < parseInt(bNum)) return -1;
      else return 1;
    });
    
  } catch (e) {
    console.log('error on sorting, not sorting topics');
  }
// sort subtopics
  try {
    subtopics.sort((a, b) => {
      const aNum = a.topic.split(' ')[1];
      const bNum = b.topic.split(' ')[1];
      if (parseInt(aNum) < parseInt(bNum)) return -1;
      else return 1;
    });
    
  } catch (e) {
    console.log('error on sorting, not sorting topics');
  }

  // sort tags
  try {
    stdTagsMapValues.sort((a, b) => {
      const aNum = a.topic.split(' ')[1];
      const bNum = b.topic.split(' ')[1];
      if (parseInt(aNum) < parseInt(bNum)) return -1;
      else return 1;
    });
    
  } catch (e) {
    console.log('error on sorting, not sorting topics');
  }

  

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
const countOfTags = nodes.filter((n) => n.type === 'tag').length;
const countOfSubtopics = nodes.filter((n) => n.type === 'subtopic').length;
const countOfTopics = nodes.filter((n) => n.type === 'topic').length;
const maxNodesCount = Math.max(countOfTags, countOfSubtopics, countOfTopics);

/** sizes block */
const chartWrapper = ref(null);
const availableWidth = ref(800);
const margin = { top: 0, right: 0, bottom: 0, left: 0 };
const width = computed(() => availableWidth.value - margin.left - margin.right);
const height = computed(() => {
  const OPTIM_HEIGHT = 50;
  const MIN_HEIGHT = 18;
  // minimun space for each node is MIN_HEIGHTpx but it is too narrow. Spacing must go from MIN_HEIGHT to OPTIM_HEIGHTpx according to the number of nodes
  //
  // between countOfTags* OPTIM_HEIGHT < screen height *0.8  return OPTIM_HEIGHT
  let h = margin.top + margin.bottom;
  if (maxNodesCount * OPTIM_HEIGHT < window.innerHeight * 0.9) {
    h += maxNodesCount * OPTIM_HEIGHT;
  } else {
    // then the newHeight is  linear function that goes from OPTIM_HEIGHT to MIN_HEIGHT keeping the height of the chart at 80% of the screen until it reaches MIN_HEIGHT.
    let nodeHeight = (window.innerHeight * 0.8) / maxNodesCount;
    if (nodeHeight < MIN_HEIGHT) nodeHeight = MIN_HEIGHT;
    if (nodeHeight > OPTIM_HEIGHT) nodeHeight = OPTIM_HEIGHT;
    h += nodeHeight * maxNodesCount;
  }
  return Math.max(h, 200);

  return h;
});

onMounted(() => {
  availableWidth.value = chartWrapper.value.clientWidth;
  window.addEventListener('resize', () => {
    availableWidth.value = chartWrapper.value.clientWidth;
  });
});

watch(width, (newValue, oldValue) => {
  if (newValue !== oldValue) {
    updateChart();
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', () => {
    availableWidth.value = chartWrapper.value.clientWidth;
  });
});

const NODE_WIDTH = 32;
const NODE_PADDING = 14;

const VERT_PADDING = 20;
const TEXT_SPACING_EXTREMES = 20;
const TEXT_PADDING = VERT_PADDING;
const SMALL_NODE_WIDTH = 20;
const CENTER_NODE_WIDTH = NODE_WIDTH;

const SANKEY_GLOBAL_PADDING_X = 280; // this is the space for columns of text on both sides
const SANKEY_GLOBAL_PADDING_Y = 20;

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

  svg = select(canvas.value);
  svg.selectAll('g').remove();
  svg.append('g').classed('links', true);
  svg.append('g').classed('nodes', true);
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
  sankey = sankeyGenerator();
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
      return color(d.source.color).brighter(0.2);
    });

  // nouse interaction
  links_enter
    .on('mousemove', (event, d) => {
      select(event.target).raise();
      selectAll('.link').classed('faded', true);

      select(event.target).classed('faded', false);

      //       grey out nodes
      selectAll('g.node').classed('faded', true);
      // select adjacent nodes
      selectAll(
        'g.node.n-' + slugify(d.source.name, { strict: true, lower: true })
      ).classed('faded', false);
      selectAll(
        'g.node.n-' + slugify(d.target.name, { strict: true, lower: true })
      ).classed('faded', false);

      // show tooltip:
      selectedSubtopic.value = {
        name: d.source.name + '<br>' + '&#8593' + '<br/>' + d.target.name,
        value: d.value,
      };
      tooltipInfo.value = {
        x: event.pageX,
        y: event.pageY,
        color: d.source.color,
      };
    })
    .on('mouseout', (event) => {
      selectedSubtopic.value = null;
      // select(event.target)
      //   //.attr("stroke", (d)=> { return this.color(d) } )
      //   .classed("selected", false);
      selectAll('.link').classed('faded', false);
      selectAll('.node').classed('faded', false);
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
    .attr('fill', (d) => {
      if(d.depth == 0 || d.depth==1) return d.color      
      else return 'white'
    })
    .attr('stroke', (d) => {
      if(d.depth === 0 || d.depth===1) return 'transparent'
      if(d.targetLinks.length === 1) return d.color;
      return 'grey'
    })
    .attr('stroke-width', (d) => {
      
      return 1
    })
    .transition()
    .duration(1000)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', (d) => NODE_WIDTH)
    .attr('height', (d) => {
      if (d.layer === 1) return Math.max(d.y1 - d.y0, 14);
      else return d.y1 - d.y0;
    });

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
      if (d.layer === 0) return -TEXT_PADDING + SMALL_NODE_WIDTH / 2;
      else if (d.layer === 2) return TEXT_PADDING + SMALL_NODE_WIDTH;
      else return CENTER_NODE_WIDTH / 2;
    })
    .attr('y', (d) => {
      if (d.layer != 1) return (d.y1 - d.y0) / 2 + 7;
      else {
        const realHeight = Math.max(d.y1 - d.y0, 14);
        return realHeight / 2 + 5;
      }
    })
    .attr('class', (d) => {
      return 'layer-' + d.layer;
    })
    .text((d) => {
      if (d.layer === 0) return '';
      if (d.layer === 2) return d.name;
      else return d.name.split(' ')[0];
    })

    .each(function (p, j) {
      // divide text in two lines for ods
      if (p.layer != 0) return;
      // split the text in two lines each string stars with the words ODS X ZZZZ and we need to split it in two lines being ODS X the first line
      const words = p.name.split(' ');
      const firstLine = words.slice(0, 2).join(' ');
      const secondLine = words.slice(2).join(' ');
      select(this)
        .selectAll('tspan')
        .data([firstLine, secondLine])
        .enter()
        .append('tspan')
        .attr('text-anchor', 'right')
        .attr('x', (d, i) => -8)
        .attr('y', () => (p.y1 - p.y0) / 2)
        .attr('dy', (d, i) => (i ? '1.1em' : 0))
        .text((d) => d);
    });
  

  textnode.raise();

  nodes_update.exit().remove();
  textnode.exit().remove();

  nodes_enter
    .on('mouseover', (event, d) => {
      selectedSubtopic.value = d;
      tooltipInfo.value = {
        x: event.pageX,
        y: event.pageY - 20,
        color: d.layer === 2 ? d.color : d.color,
      };
      select(event.target).classed('selected', true);
      // grey out the other nodes and links and highlight only the ones connected to this node
      selectAll('.link').classed('faded', true);
      selectAll(
        '.link.n-' + slugify(d.name, { strict: true, lower: true })
      ).classed('faded', false);
    })
    .on('mouseout', () => {
      selectedSubtopic.value = null;
      select('.selected')
        //.attr("stroke", (d)=> { return this.color(d) } )
        .classed('selected', false);
      selectAll('g.node').classed('faded', false);
      selectAll('.link').classed('faded', false);
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

  function getTextWidth(text) {
    return textWidth(text, {
      font: 'sans-serif',
      size: 12,
    });
  }
}
</script>

<style lang="scss">
.sankey-chart-initiatives-flow {
  .faded {
  }

  .nodes text {
    font-size: 15px;
    font-weight: light;
    fill: #2d4252;
  }
  .nodes text {

  }
  .nodes text.layer-1 {
    font-weight: 800;
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
  opacity: 0.2 !important;
}

rect.selected {
  opacity: 1 !important;
  stroke-width: 2px !important;
}

.chart-titles div{
 font-size:12px;
 
}
.chart-titles div:nth-child(1){
  text-align:right;
  padding-right: 74px;
}
.chart-titles div:nth-child(2){
  text-align:center;
}
.chart-titles div:nth-child(3){
  text-align:left;
  padding-left: 76px;
}
</style>
