<template>
  <div
    v-if="parliamentarygroup"
    id="group"
    class="o-container o-section u-margin-bottom-10"
  >
    <tipi-header v-if="parliamentarygroup" :title="parliamentarygroup.name" />

    <div class="o-container o-zection u-margin-top-8 u-margin-bottom-4">
      <SdgBarchartFootprint
        v-if="footprintByTopics.length > 0"
        :footprint="footprintByTopics"
        :styles="topicsStyles"
        :linkToSearchField="'author'"
        :linkToSearchValue="parliamentarygroup.name"
      />
      <footprint-info />
    </div>

    <div
      v-if="latestInitiatives && latestInitiatives.length"
      class="o-container o-section u-margin-bottom-4"
    >
      <h4 class="u-margin-bottom-4">Últimas iniciativas</h4>
      <tipi-results
        layout="tiny"
        :initiatives="latestInitiatives"
        :topicsStyles="topicsStyles"
      />
    </div>
    <div class="o-container o-section" v-else>
      <tipi-message type="info" icon>
        Sin actividad parlamentaria relacionada con la Agenda 2030 en esta
        legislatura
      </tipi-message>
    </div>

    <AlertBlock
      :text="'No te pierdas nada de la actividad del '"
      :value="parliamentarygroup.name"
      :searchParams="{ author: parliamentarygroup.name }"
      v-if="use_alerts"
    />

    <div class="o-container o-section">
      <h4 class="u-margin-bottom-4">Diputados/as</h4>
      <div class="o-grid">
        <div class="o-grid__col u-12 u-4@sm">
          <tipi-text
            meta=""
            :value="dividedDeputies[0]"
            type="deputy"
            :source="store.allDeputies"
            hideGroup
          />
        </div>
        <div class="o-grid__col u-12 u-4@sm">
          <tipi-text
            meta=""
            :value="dividedDeputies[1]"
            type="deputy"
            :source="store.allDeputies"
            hideGroup
          />
        </div>
        <div class="o-grid__col u-12 u-4@sm">
          <tipi-text
            meta=""
            :value="dividedDeputies[2]"
            type="deputy"
            :source="store.allDeputies"
            hideGroup
          />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="o-container o-section u-margin-bottom-10">
    <tipi-loader title="Cargando datos" subtitle="Puede llevar unos segundos" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import {
  TipiHeader,
  TipiMessage,
  TipiResults,
  TipiText,
  TipiLoader,
} from '@politicalwatch/tipi-uikit';

import api from '@/api';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';
import SdgBarchartFootprint from '@/components/SdgBarchartFootprint.vue';
import FootprintInfo from '@/components/FootprintInfo.vue';
import AlertBlock from '@/components/AlertBlock.vue';

const route = useRoute();
const router = useRouter();
const store = useParliamentStore();

const use_alerts = config.USE_ALERTS;
const topicsStyles = config.STYLES.topics;

const parliamentarygroup = ref(null);
const latestInitiatives = ref([]);
const topicsRanking = ref(null);
const errors = ref([]);

const headTitle = computed(() => {
  return parliamentarygroup.value?.name
    ? `${parliamentarygroup.value.name} - Parlamento2030`
    : 'Parlamento2030';
});

useHead({
  title: headTitle,
});

const deputies = computed(() => {
  if (parliamentarygroup.value) {
    return store
      .getDeputiesByParliamentaryGroup(parliamentarygroup.value.shortname)
      .filter((deputy) => deputy.active)
      .map((deputy) => deputy);
  }
  return [];
});

const dividedDeputies = computed(() => {
  let results = [];
  let divided = deputies.value;

  for (let i = 3; i > 0; i--) {
    results.push(divided.splice(0, Math.ceil(divided.length / i)));
  }

  return results;
});

const footprintByTopics = computed(() => {
  return parliamentarygroup.value
    ? parliamentarygroup.value.footprint_by_topics.filter((item) =>
        store.allTopics.some((topic) => topic.name === item.name)
      )
    : [];
});

const getParliamentaryGroup = () => {
  api
    .getGroup(route.params.id)
    .then((response) => {
      parliamentarygroup.value = response;
      getTopicsRanking();
      getLatestInitiatives();
    })
    .catch((error) => {
      errors.value = error;
      router.push({ name: 'Page404', params: { 0: '404' } });
    });
};

const getLatestInitiatives = () => {
  api
    .getInitiatives({ author: parliamentarygroup.value.name, per_page: 12 })
    .then((response) => {
      if (response.initiatives) latestInitiatives.value = response.initiatives;
    })
    .catch((error) => (errors.value = error));
};

const getTopicsRanking = () => {
  api
    .getTopicsByParliamentaryGroupRanking(parliamentarygroup.value.name)
    .then((response) => {
      topicsRanking.value = response;
    })
    .catch((error) => (errors.value = error));
};

onMounted(() => {
  getParliamentaryGroup();
});
</script>
