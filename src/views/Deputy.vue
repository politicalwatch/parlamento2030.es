<template>
  <div v-if="deputy" id="deputy" class="u-margin-bottom-10">
    <tipi-deputy
      v-if="deputy"
      :deputy="deputy"
      :parliamentaryGroup="parliamentarygroup"
    >
      <a
        v-if="deputy.hasOwnProperty('email')"
        :href="`mailto:${deputy.email}`"
        target="_blank"
        ><Icon icon="mdi:email" /> {{ deputy.email }}</a
      >
      <a
        v-if="deputy.hasOwnProperty('twitter')"
        :href="deputy.twitter"
        target="_blank"
        ><Icon icon="mdi:twitter" /> @{{
          deputy.twitter.split('/').reverse()[0]
        }}</a
      >
      <div class="u-margin-top-2">
        <tipi-congress-link
          v-if="deputy.hasOwnProperty('url')"
          :url="deputy.url"
        ></tipi-congress-link>
      </div>
    </tipi-deputy>

    <div class="o-container" v-if="!deputy.active">
      <tipi-message type="info" icon>
        Causó baja en el Congreso de los Diputados
      </tipi-message>
    </div>
    <div class="o-container o-section">
      <h4 class="u-margin-bottom-4">Huella parlamentaria</h4>
      <SdgBarchartFootprint
        v-if="footprintByTopics.length > 0"
        :footprint="footprintByTopics"
        :styles="styles.topics"
        :linkToSearchField="'deputy'"
        :linkToSearchValue="deputy.name"
      />
      <footprint-info />
    </div>
    <div
      v-if="latestInitiatives && latestInitiatives.length"
      class="o-container o-section"
    >
      <h4 class="u-margin-bottom-4">Últimas iniciativas</h4>
      <tipi-results
        layout="tiny"
        :initiatives="latestInitiatives"
        :topicsStyles="styles.topics"
      />
    </div>
    <div class="o-container" v-else>
      <tipi-message type="info" icon>
        Sin actividad parlamentaria relacionada con la Agenda 2030 en esta
        legislatura
      </tipi-message>
    </div>

    <AlertBlock
      :text="'No te pierdas nada de la actividad parlamentaria de '"
      :value="deputy.name"
      :searchParams="{ deputy: deputy.name }"
      v-if="use_alerts && deputy.active"
    />
  </div>
  <div v-else class="o-container o-section u-margin-bottom-10">
    <tipi-loader title="Cargando datos" subtitle="Puede llevar unos segundos" />
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useSeoMeta } from '@unhead/vue';
import { Icon } from '@iconify/vue';
import {
  TipiCongressLink,
  TipiDeputy,
  TipiMessage,
  TipiResults,
  TipiLoader,
} from '@politicalwatch/tipi-uikit';

import api from '@/api';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';
import AlertBlock from '@/components/AlertBlock.vue';
import SdgBarchartFootprint from '@/components/SdgBarchartFootprint.vue';
import FootprintInfo from '@/components/FootprintInfo.vue';

const route = useRoute();
const router = useRouter();
const store = useParliamentStore();

const deputy = ref(null);
const parliamentarygroup = ref(null);
const latestInitiatives = ref(null);
const topicsRanking = ref(null);
const errors = ref(null);
const use_alerts = config.USE_ALERTS;
const styles = config.STYLES;

const headTitle = computed(() => {
  return deputy.value
    ? `${deputy.value.name} - Parlamento2030`
    : 'Parlamento2030';
});

const footprintByTopics = computed(() => {
  if (deputy.value) {
    return deputy.value.footprint_by_topics.filter((item) =>
      store.allTopics.some((topic) => topic.name === item.name)
    );
  }
  return [];
});

useSeoMeta({
  title: () => headTitle.value,
  ogTitle: () => headTitle.value,
  ogImage: () => (deputy.value ? deputy.value.image : null),
});

const getDeputy = async () => {
  api
    .getDeputy(route.params.id)
    .then((response) => {
      deputy.value = response;
      parliamentarygroup.value = store.allParliamentaryGroups.find(
        (allPG) => allPG.shortname === deputy.value.parliamentarygroup
      );
      getLatestInitiatives();
    })
    .catch((error) => {
      errors.value = error;
      router.push({ name: 'Page404' });
    });
};
const getLatestInitiatives = () => {
  api
    .getInitiatives({ deputy: deputy.value.name, per_page: 12 })
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

onBeforeMount(() => {
  getDeputy();
});
</script>

<style scoped lang="scss"></style>
