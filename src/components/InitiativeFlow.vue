<template>
    <div class="sankey-chart-initiatives-flow">
        <svg id="canvas" :height="height" :width="width" ref="canvas">
        </svg>
    </div>
</template>

<script setup>
// testing at: http://localhost:5173/iniciativas/162-001066

import * as d3 from "d3";
import * as d3sankey from "d3-sankey";
import slugify from "slugify";
import { textWrap } from "d3plus-text";

import { computed, ref, onMounted } from 'vue';  
import { sub } from "date-fns";

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
      default: 1200,
    },
})


//**** data processing  */
const buildNodes = (allTags) => {
    const root = {
        name: 'root',
        children: [],
    };
    const  subtopics = [];
    const stdTags=  allTags.map((t) => ({
            name: t.tag,
            value: t.times,
            subtopic: t.subtopic,
            topic: t.topic,
            color: '#D4D5E1',
         type: 'tag'}))

    for (const tag of stdTags){
        const subtopic = subtopics.find((s) => s.name === tag.subtopic);
        if (subtopic){
            subtopic.value += tag.value;
            subtopic.children.push(tag)
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
    }

    const topics = [];
    for(const subtopic of subtopics){
        const topic = topics.find((t) => t.name === subtopic.topic);
        if (topic){
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
    console.log(subtopics)
    return [...topics, ...subtopics, ...stdTags
       ];
};



function buildLinksFromNodes(nodes)  {
    const topicNodes = nodes.filter((n) => n.type === 'topic');
    const subtopicNodes = nodes.filter((n) => n.type === 'subtopic');
    const links = [];
    for (const node of topicNodes){
        if (node.children){
            for (const child of node.children){
                links.push({
                    source: node.name,
                    target: child.name,
                    value: child.value,
                    id: `${node.name}-${child.name}`,
                });
            }
        }
    }
    for (const node of subtopicNodes){
        if (node.children){
            for (const child of node.children){
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
};

const nodes= buildNodes(props.initiative.tagged[0].tags);
const links = buildLinksFromNodes(nodes);
console.log(nodes);
console.log(links);


/** sizes block */
const margin = { top: 10, right: 10, bottom: 10, left: 10 };
const width = computed(() => props.totalWidth - margin.left - margin.right);
const height = computed(() => 800 - margin.top - margin.bottom);

const NODE_WIDTH = 300;
const NODE_PADDING = 10;

const VERT_PADDING = 10;
const TEXT_SPACING_EXTREMES = 80;
const TEXT_PADDING = VERT_PADDING;
const SMALL_NODE_WIDTH = 20;
const CENTER_NODE_WIDTH = NODE_WIDTH - VERT_PADDING;


const SANKEY_GLOBAL_PADDING_X = 50;
const SANKEY_GLOBAL_PADDING_Y = 40;

/****************  Sankey building ************************/
onMounted(() => {
    initChart();
    updateChart();
});

let sankey = null;
let svg = null
let graph = null
const canvas = ref(null);
const initChart= function(){
    sankey = sankeyGenerator();    
      try {
        graph= sankey({
          nodes: nodes.map((d) => Object.assign({}, d)),
          links: links.map((d) => Object.assign({}, d)),
        });
      } catch (e) {
        console.log(e);
        return;
      }

      svg = d3.select(canvas.value)
      svg.selectAll("g").remove();
      svg.append("g").classed("links", true);
      svg.append("g").classed("nodes", true);
      updateChart("init chart mounted");
}

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
          .iterations( 0) // 6
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
      graph= sankey({
        nodes: nodes.map((d) => Object.assign({}, d)),
        links: links.map((d) => Object.assign({}, d)),
      });
      
        let links_update = svg
          .select("g.links")
          .selectAll("path")
          .data(graph.links, (d) => d.name);

        let links_enter = links_update.enter().append("path");

        links_enter
          .merge(links_update)
          .attr("class", (d) => {
            return (
              "link " +
              "n-" +
              slugify(d.source.name, { strict: true, lower: true }) +
              " n-" +
              slugify(d.target.name, { strict: true, lower: true })
            );
          })
          .transition()
          .duration(1000)
          .attr("d", d3sankey.sankeyLinkHorizontal())
          .attr("fill", "none")
          .attr("stroke-width", (d) => d.width)
          .attr("stroke-opacity", 0.7)
          .style("stroke", (d) => {
            return '#ccc'
          })

        links_enter
          .on("mousemove", (event, d) => {
            d3.select(event.target).raise();
            d3.selectAll(".link").classed("greyed", true);

            d3.select(event.target).classed("greyed", false);

            //       grey out nodes
            d3.selectAll("g.node").classed("greyed", true);
            // select adjacent nodes
            d3.selectAll(
              "g.node.n-" + slugify(d.source.name, { strict: true, lower: true })
            ).classed("greyed", false);
            d3.selectAll(
              "g.node.n-" + slugify(d.target.name, { strict: true, lower: true })
            ).classed("greyed", false);
          })

        links_update.exit().remove();

        let nodes_update = svg
          .select("g.nodes")
          .selectAll("g.node")
          .data(graph.nodes, (d) => d.name);

        let nodes_enter = nodes_update
          .enter()
          .append("g")
          .attr(
            "class",
            (d) => "n-" + slugify(d.name, { strict: true, lower: true })
          )
          .classed("node", true)
          .classed(
            "interactive",
            (d) => d.type !== !d.name.includes("Bilateral")
          );
        nodes_enter
          .merge(nodes_update)
          .attr("transform", (d) => `translate(${d.x0 }, ${d.y0})`)
          .on("click", (event, d) => {
           
          });

        //nested general update pattern: https://bl.ocks.org/curran/1b162368fd3b5a3c623b038c4cd64d37
        nodes_enter
          .append("rect")
          .merge(nodes_update.select("rect"))
          .attr("fill", (d) => d.color
          )
          .attr("stroke", (d) => {
            
             return "#262E6A";
          })
          .transition()
          .duration(1000)
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", (d) => NODE_WIDTH)
          .attr("height", (d) => d.y1 - d.y0)
          .attr("opacity", 0.8);

        //.append("title")

        // add in the title for the nodes
        let textnode = nodes_enter
          .append("text")
          .merge(nodes_update.select("text"))
          .attr("text-anchor", (d) => {
            return "middle";
          })
          .attr("x", (d) => {
            return CENTER_NODE_WIDTH / 2;
          })
          .attr("y", (d) => {
               return  (d.y1 - d.y0)/2 + 7;
              })
          .attr("class", (d) => {
            if (d.type === "category") return "category";
            else return "entity";
          })
          .text((d) => {
            return d.name;
          })
          textnode.raise()
          

        nodes_update.exit().remove();
        textnode.exit().remove();      
    }
</script>

<style lang="scss" >
.sankey-chart-initiatives-flow{
    .greyed {
    
    }

    .nodes text {
    font-size: 14px;
    font-weight: bold;
    pointer-events: none;
    fill: #222;
    }

    .node.interactive {
    cursor: pointer;
    }

    .nodes text.entity tspan {
    font-weight: 300;
    font-size: 12px;
    }

    .nodes text.category tspan {
    font-weight: 400;
    font-size: 11px;
    }
    .node rect.selected {
    fill: #dad5d5 !important;
    stroke-width: 2px;
    }

    path.link.selected {
    stroke: black !important;
    }

}

</style>