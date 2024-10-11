<template>
  <div>
    <div id="dashboard" class="o-container o-section u-margin-bottom-10">
      <tipi-header
        :title="'Métricas'"
        :subtitle="'Elige un Objetivo de Desarrollo Sostenible o profundiza en sus Metas y descubre cuánto de la Agenda 2030 se está tratando en el Congreso de los Diputados'"
      />
      <div class="o-grid u-margin-bottom-4">
        <div class="o-grid__col u-12">
          <form @submit.prevent="getResults">
            <div class="o-grid">
              <div class="o-grid__col u-12 u-6@sm">
                <div class="c-select-label u-block">
                  <label for="topic">Objetivos</label>
                  <multiselect
                    @select="fillSubtopics"
                    v-model="data.topic"
                    :options="store.allTopics.map((topic) => topic.name)"
                    name="topic"
                    id="topic"
                    placeholder="Todos"
                  >
                  </multiselect>
                </div>
              </div>
              <div class="o-grid__col u-12 u-6@sm">
                <div class="c-select-label u-block">
                  <label for="subtopics">Metas</label>
                  <multiselect
                    v-model="data.subtopic"
                    :options="subtopics"
                    name="subtopic"
                    id="subtopic"
                    placeholder="Todas"
                  >
                  </multiselect>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <div
        v-if="data.isSelected"
        class="o-grid u-margin-bottom-8 u-padding-top-8 u-border-top u-border-bottom u-margin-top-8"
      >
        <div class="o-grid__col u-12">
          <div class="o-grid">
            <div class="o-grid__col u-8@sm">
              <h4 class="u-margin-bottom-4">Comparando objetivos y metas</h4>
              <p class="u-margin-bottom-0">
                <strong
                  >¿Cuánta atención recibe
                  {{ data.selection.selected._id }}?</strong
                >
              </p>
              <p class="u-margin-top-0">
                Descubre su volumen de actividad frente al más popular.
              </p>
              <p class="u-text-subtitle">
                Hay {{ data.selection.selected.initiatives }} iniciativas
                relacionadas con <span v-show="!data.selectedTarget">el</span
                ><span v-show="data.selectedTarget">la meta</span>&nbsp;{{
                  data.selection.selected._id
                }}&nbsp;<span v-show="data.sameSelection"
                  >(<span v-show="!data.selectedTarget">el más popular</span
                  ><span v-show="data.selectedTarget"
                    >la meta más popular del {{ data.topic }}</span
                  >)</span
                >.<span v-show="!data.sameSelection">
                  ¿Suficientes? Compáralo con
                  <span v-show="!data.selectedTarget">el</span
                  ><span v-show="data.selectedTarget">la meta</span>&nbsp;{{
                    data.selection.compareswith._id
                  }}
                  que, con
                  {{ data.selection.compareswith.initiatives }} iniciativas, es
                  <span v-show="!data.selectedTarget">el</span
                  ><span v-show="data.selectedTarget">la</span> que más
                  actividad concentra.
                  </span>
              </p>
            </div>
            <div class="o-grid__col u-4@sm u-text-right">
              <tipi-two-circles
                :selection="data.selection"
                :topic="data.topic"
                :styles="styles"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="o-grid u-margin-bottom-4"
        v-show="data.selection.selected.initiatives"
      >
        <div class="o-grid__col u-12">
          <div class="o-grid">
            <div
              class="o-grid__col u-6@sm"
              v-if="data.parliamentarygroups && data.parliamentarygroups.length"
            >
              <tipi-message type="info" v-if="data.isSelected" icon
                >Ránking de los grupos que más iniciativas presentan
                relacionadas con
                <strong>{{ data.selection.selected._id }}</strong></tipi-message
              >
              <tipi-text
                meta="Grupos parlamentarios más activos"
                :value="
                  data.parliamentarygroups.map(
                    (group) =>
                      `${group._id} (${
                        group.initiatives
                      } ${pluralizeInitiatives(group.initiatives)})`
                  )
                "
                type="parliamentarygroups"
                :source="store.allParliamentaryGroups"
              />
            </div>
            <div
              class="o-grid__col u-6@sm"
              v-if="data.places && data.places.length"
            >
              <tipi-message type="info" v-if="data.isSelected" icon
                >Descubre cuáles son los lugares más habituales en los que se
                tramitan las iniciativas relacionadas con
                <strong>{{ data.selection.selected._id }}</strong></tipi-message
              >
              <tipi-text
                meta="¿Dónde se tramitan las iniciativas?"
                :value="
                  data.places.map(
                    (place) =>
                      `${place._id} (${
                        place.initiatives
                      } ${pluralizeInitiatives(place.initiatives)})`
                  )
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import {
  TipiHeader,
  TipiMessage,
  TipiTwoCircles,
  TipiText,
} from '@politicalwatch/tipi-uikit';
import Multiselect from 'vue-multiselect';

import api from '@/api';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';

const store = useParliamentStore();

const styles = config.STYLES;

const subtopics = ref([]);
const loadingResults = ref(false);
const errors = ref(null);
const data = ref({
  topic: '',
  subtopic: '',
  isSelected: false,
  selectedTarget: false,
  sameSelection: false,
  selection: {
    compareswith: {
      _id: '',
      initiatives: 0,
    },
    selected: {
      _id: '',
      initiatives: 0,
    },
  },
  parliamentarygroups: null,
  places: null,
});

const fillSubtopics = (selectedTopic, clearValues) => {
  data.value.subtopic = clearValues ? '' : data.value.subtopic;
  const currentTopic = store.allTopics.find(
    (topic) => topic.name === selectedTopic
  );
  getSubtopics(currentTopic.id);
};

const getSubtopics = (topicID) => {
  api
    .getTags(topicID)
    .then((tags) => {
      subtopics.value = [...new Set(tags.map((tag) => tag.subtopic))];
    })
    .catch((error) => (errors.value = error));
};

const pluralizeInitiatives = (number_of_initiatives) => {
  return number_of_initiatives == 1 ? 'iniciativa' : 'iniciativas';
};

const prepareForm = () => {
  if (data.value.topic) {
    fillSubtopics(data.value.topic, false);
  }
};

const getPgIdFromName = (name) => {
  return store.allParliamentaryGroups.find((s) => s.name == name).id;
};

const getResults = () => {
  // console.log('Get results:', config.KNOWLEDGEBASE);
  api
    .getOverallStats()
    .then((overall) => {
      // If a subtopic is selected
      if (data.value.subtopic) {
        if (data.value.selection === null) data.value.selection = {};
        data.value.selection.selected = overall.subtopics[
          config.KNOWLEDGEBASE
        ].find((el) => el._id === data.value.subtopic);
        if (data.value.selection.selected === undefined) {
          data.value.selection.selected = {};
          data.value.selection.selected._id = data.value.subtopic;
          data.value.selection.selected.initiatives = 0;
        }
        let compareswith_posibilities = overall.subtopics[
          config.KNOWLEDGEBASE
        ].filter((el) =>
          el._id.startsWith(data.value.selection.selected._id.split('.')[0])
        );
        data.value.selection.compareswith = compareswith_posibilities[0];
        data.value.isSelected = true;
        data.value.selectedTarget = true;
      }
      // If no subtopic is selected
      else {
        if (data.value.selection === null) data.value.selection = {};
        data.value.selection.selected = overall.topics[
          config.KNOWLEDGEBASE
        ].find((el) => el._id === data.value.topic);
        if (data.value.selection.selected === undefined) {
          data.value.selection.selected = {};
          data.value.selection.selected._id = data.value.topic;
          data.value.selection.selected.initiatives = 0;
        }
        //get the topic with more initiatives in overall.topics[config.KNOWLEDGEBASE]
        data.value.selection.compareswith = overall.topics[
          config.KNOWLEDGEBASE
        ].reduce((max, topic) =>
          max.initiatives > topic.initiatives ? max : topic
        );
        data.value.isSelected = true;
        data.value.selectedTarget = false;
      }
      data.value.sameSelection =
        data.value.selection.selected._id ==
        data.value.selection.compareswith._id
          ? true
          : false;
    })
    .catch((error) => (errors.value = error));

  api
    .getParliamentarygroupsRanking(data.value.topic, data.value.subtopic)
    .then((ranking) => {
      data.value.parliamentarygroups = ranking;
    })
    .catch((error) => (errors.value = error));

  api
    .getPlacesRanking(data.value.topic, data.value.subtopic)
    .then((ranking) => {
      data.value.places = ranking;
    })
    .catch((error) => (errors.value = error));
};

onMounted(() => {
  prepareForm();
});

watch(
  () => data.value.topic,
  () => {
    getResults();
  }
);

watch(
  () => data.value.subtopic,
  () => {
    if (data.subtopic !== '') getResults();
  }
);

watch(
  () => data.value.selection,
  () => {
    console.log('Change selection');
  }
);
</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
