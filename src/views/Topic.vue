<template>
  <div v-if="loaded">
    <tipi-topic-card :topic="topic" :topicsStyles="styles" />

    <div id="topic" class="o-container o-section">
      <div class="u-margin-bottom-4">
        <h4 class="u-margin-bottom-4" v-if="latestInitiatives">
          Frecuencia de las iniciativas
        </h4>
        <FrequencyChart
          :topicsStyles="styles"
          :topic="topic"
          :dataset="topicsByWeek"
          :aggreagatedDataset="allTopicsByWeek"
          :loadingDynamicData="loadingDynamicData"
          @update:showComparativeMode="getAllTopicsByWeek()"
          v-if="topicsByWeek != null"
        />
      </div>

      <div class="o-grid c-ranking-actividad">
        <div class="o-grid__col u-12">
          <h4 class="u-margin-bottom-4" v-if="latestInitiatives">
            Ranking de actividad
          </h4>
        </div>
        <div class="o-grid__col u-12 u-4@sm" v-if="deputies">
          <tipi-text
            meta="Diputadas/os más activas/os"
            :value="deputies"
            type="deputy"
            :source="store.allDeputies"
          />
        </div>
        <div class="o-grid__col u-12 u-4@sm" v-if="parliamentarygroups">
          <tipi-text
            meta="Grupos más activos"
            :value="parliamentarygroups"
            type="parliamentarygroup"
            :source="parliamentarygroups"
          />
        </div>
        <div class="o-grid__col u-12 u-4@sm" v-if="places">
          <tipi-text meta="Dónde se trata más" :value="places" />
        </div>
      </div>

      <div
        class="u-border-top u-padding-top-4 c-ultimas-iniciativas"
        v-if="latestInitiatives"
      >
        <h4 class="u-margin-bottom-4" v-if="latestInitiatives">
          Últimas iniciativas
        </h4>
        <tipi-results
          layout="tiny"
          :initiatives="latestInitiatives"
          :topicsStyles="styles"
        />
      </div>
    </div>
    <AlertBlock
      :text="'No te pierdas nada de la actividad parlamentaria relacionada con el '"
      :value="topic.name"
      :searchParams="{ topic: topic.name }"
      v-if="use_alerts"
    />
    <div id="topic" class="o-container o-section">
      <div class="o-grid">
        <div
          class="o-grid__col u-12 u-12@sm"
          v-if="styles[topic.name].orgs_logos.length != 0"
        >
          <h4 class="u-margin-bottom-4">Entidades colaboradoras</h4>
        </div>
        <div class="o-grid__col u-12 u-12@sm u-margin-bottom-4">
          <img
            v-for="logo in styles[topic.name].orgs_logos"
            :key="logo"
            class="u-padding-right-4"
            :src="'/img/collaborators/' + logo"
            style="height: 100px"
          />
        </div>
      </div>
    </div>
    <div
      class="o-section o-section--double"
      v-if="latestInitiatives"
      :style="`background-color: ${styles[topic.name].color}`"
    >
      <div class="o-container">
        <p class="u-text-subtitle u-margin-0 u-color-white">
          MÁS INICIATIVAS SOBRE
        </p>
        <h4 class="u-text-th2 u-color-white">{{ topic.name.toUpperCase() }}</h4>
        <router-link
          class="c-button c-button--outline"
          :to="{ name: 'results', params: { data: 'topic=' + topic.name } }"
        >
          Explorar
        </router-link>
      </div>
    </div>
  </div>
  <div v-else class="o-container o-section u-margin-bottom-10">
    <tipi-loader title="Cargando datos" subtitle="Puede llevar unos segundos" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
import {
  TipiResults,
  TipiTopicCard,
  TipiText,
  TipiLoader,
} from '@politicalwatch/tipi-uikit';

import api from '@/api';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';
import FrequencyChart from '@/components/FrequencyChart.vue';
import AlertBlock from '@/components/AlertBlock.vue';

const router = useRouter();
const route = useRoute();
const store = useParliamentStore();

const use_alerts = config.USE_ALERTS;
const styles = config.STYLES.topics;

const topic = ref(null);
const deputies = ref([]);
const places = ref([]);
const parliamentarygroups = ref(null);
const latestInitiatives = ref(null);
const topicsByWeek = ref(null);
const allTopicsByWeek = ref(null);
const loaded = ref(false);
const loadingDynamicData = ref(false);
const errors = ref([]);

const headTitle = computed(() => {
  return topic.value?.name
    ? `${topic.value.name} - Qué hacen los diputados`
    : 'Qué hacen los diputados';
});

useHead({
  title: headTitle,
});

const getTopic = () => {
  api
    .getTopic(route.params.id)
    .then((response) => {
      topic.value = response;
      getLatestInitiatives(topic.value.name);
      getParliamentarygroupsRanking(topic.value.name);
      getDeputiesRanking(topic.value.name);
      getPlacesRanking(topic.value.name);
      getTopicsByWeek(topic.value.name);
    })
    .catch((error) => {
      errors.value = error;
      router.push({ name: 'Page404', params: { 0: '404' } });
    });
};

const getDeputiesRanking = (topic) => {
  api
    .getDeputiesRanking(topic, null, 3)
    .then((response) => {
      deputies.value = response;
      deputies.value.forEach((deputy, index) => {
        let foundDeputy = store.allDeputies.find(
          (allD) => allD.name === deputy._id
        );
        deputies.value[index] = deputies.value[index]._id;
      });
    })
    .catch((error) => (errors.value = error));
};

const getPlacesRanking = (topic) => {
  api
    .getPlacesRanking(topic, null, 3)
    .then((response) => {
      places.value = response.map((place) => `${place._id}`);
    })
    .catch((error) => (errors.value = error));
};

const getParliamentarygroupsRanking = (topic) => {
  api
    .getParliamentarygroupsRanking(topic)
    .then((response) => {
      parliamentarygroups.value = response;
      parliamentarygroups.value.forEach((group, index) => {
        let foundGroup = store.allParliamentaryGroups.find(
          (allPG) => allPG.name === group._id
        );
        parliamentarygroups.value[index].name =
          parliamentarygroups.value[index]._id;
        parliamentarygroups.value[index].id = foundGroup.id;
      });
    })
    .catch((error) => (errors.value = error));
};

const getLatestInitiatives = (topic) => {
  api
    .getInitiatives({ topic: topic, per_page: 12 })
    .then((response) => {
      if (response.initiatives) latestInitiatives.value = response.initiatives;
    })
    .catch((error) => (errors.value = error));
};

const getTopicsByWeek = (topic) => {
  loadingDynamicData.value = true;
  api
    .getTopicsByWeek(topic)
    .then((response) => {
      topicsByWeek.value = response.data;
    })
    .catch((error) => (errors.value = error))
    .finally(() => {
      loadingDynamicData.value = false;
      loaded.value = true;
    });
};

const getAllTopicsByWeek = () => {
  if (allTopicsByWeek.value !== null) return;
  loadingDynamicData.value = true;
  api
    .getAllTopicsByWeek(topic)
    .then((response) => {
      allTopicsByWeek.value = response.data;
    })
    .catch((error) => (errors.value = error))
    .finally(() => {
      loadingDynamicData.value = false;
    });
};

onMounted(() => {
  getTopic();
});
</script>

<style lang="scss" scoped>
.c-ranking-actividad,
.c-ultimas-iniciativas {
  min-height: 300px;
}
</style>
