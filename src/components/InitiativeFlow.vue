<template>
    <div>

    </div>
</template>

<script setup>
// testing at: http://localhost:5173/iniciativas/162-001066
import { ref } from 'vue';  



// initiative.tagged[0].tags is an array of objects with the following structure:
//{
    // subtopic: '',
    // tag: "",
    // times: 1,
    // topic: 0
//}
// I need an hierarchy of topics and subtopics, so I need to transform the data into a tree structure:

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
})


const transformData = (allTags) => {
    const root = {
        name: 'root',
        children: [],
    };
    const  subtopics = [];
    // subtopic is an object containing:
    // {
    //     name: '',
    //     topic: '', // parent topic
    //     children: [],
    // value: 0 aggregate of all the times of the tags in the subtopic
    // }
    for (const tag of allTags){
        const subtopic = subtopics.find((s) => s.name === tag.subtopic);
        if (subtopic){
            subtopic.value += tag.times;
            subtopic.children.push(tag)
        } else {
            subtopics.push({
                name: tag.subtopic,
                topic: tag.topic,
                children: [tag],
                value: tag.times,
            });
        }
    }

    const topics = [];
    // topic is an object containing:
    // {
    //     name: '',
    //     children: [],
    //     value: 0 aggregate of all the times of the subtopics in the topic
    // }
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
            });
        }  
    }
    return topics    
};

const baseData= transformData(props.initiative.tagged[0].tags);
console.log(baseData);




// initiative

</script>

<style lang="scss" scoped>

</style>