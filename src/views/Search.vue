<template>
  <div>
    <div id="search" class="o-container o-section u-margin-bottom-10">
      <tipi-header
        :title="'Buscar'"
        :subtitle="'Bucea en la actividad parlamentaria relacionada con los ODS con las múltiples opciones que te ofrece el buscador de Parlamento 2030'"
      />

      <search-form v-model:formData="formData" @getResults="getResults" />

      <div class="o-grid o-grid--align-center u-margin-bottom-4" id="results">
        <div class="o-grid__col o-grid__col--fill">
          <h4 v-if="query_meta.page">{{ message.message }}</h4>
          <tipi-message
            v-if="initiatives.length > 0 && !canDownloadCSV"
            icon
            type="info"
            >Se ha superado el número máximo de datos para
            descargar</tipi-message
          >
        </div>
        <div class="o-grid__col o-grid__col--right">
          <tipi-csv-download
            :initiatives="initiatives || []"
            :csvItems="csvItems"
            :canDownloadCSV="canDownloadCSV"
            @loadCSVItems="loadCSVItems"
          />
          <SaveAlert
            :searchParams="formData"
            v-show="alertsIsEnabled() && query_meta.page"
          />
        </div>
      </div>
      <tipi-results
        :loadingResults="loadingResults"
        :initiatives="initiatives || []"
        :topicsStyles="topicsStyles"
        :queryMeta="query_meta"
        @loadMore="loadMore"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onUpdated, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import qs from 'qs';
import VueScrollTo from 'vue-scrollto';
import {
  TipiHeader,
  TipiCsvDownload,
  TipiMessage,
  TipiResults,
} from '@politicalwatch/tipi-uikit';

import api from '@/api';
import config from '@/config';
import SearchForm from '@/components/SearchForm.vue';
import SaveAlert from '@/components/SaveAlert.vue';

const route = useRoute();
const router = useRouter();

const LIMITCSV = 1000;
const topicsStyles = config.STYLES.topics;

const errors = ref(null);
const initiatives = ref([]);
const query_meta = ref({});
const formData = ref({
  topic: '',
  author: '',
  deputy: '',
  startdate: '',
  enddate: '',
  place: '',
  reference: '',
  page: 1,
  tags: [],
  subtopics: [],
});
const loadingResults = ref(false);
const csvItems = ref([]);
const scrollToID = ref('#results');

const canDownloadCSV = computed(() => query_meta.value.total < LIMITCSV);

const message = computed(() => {
  if (errors.value) {
    return { icon: true, type: 'error', message: errors.value };
  }
  if (query_meta.value.total) {
    return {
      icon: true,
      type: 'success',
      message: `Se han encontrado ${query_meta.value.total} iniciativas`,
    };
  }
  return {
    icon: true,
    type: 'error',
    message: `No se han encontrado iniciativas que cumplan los criterios`,
  };
});

const loadMore = () => {
  let node = document.querySelectorAll('.c-initiative-card');
  node = node[node.length - 1];
  scrollToID.value = `#${node.id}`;
  formData.value.page++;
  getResults();
};

const alertsIsEnabled = () => config.USE_ALERTS === 'true';

const loadCSVItems = (event) => {
  if (!canDownloadCSV.value) return false;
  event.target.innerText = 'Procesando descarga...';
  let params = Object.assign({ per_page: LIMITCSV }, formData.value);
  api
    .getInitiatives(params)
    .then((response) => {
      csvItems.value = response.initiatives.map((initiative) => ({
        ...initiative,
        topics: initiative.tagged[0].topics.join(', '),
        tags: initiative.tagged[0].tags.map((tag) => tag.tag).join(', '),
      }));
      event.target.innerText = 'Descarga los datos';
    })
    .catch((error) => (errors.value = error));
};

const getResults = (event) => {
  loadingResults.value = true;
  csvItems.value = [];
  const isNewSearch = event?.type === 'submit';
  const params =
    route.params.data && !isNewSearch
      ? qs.parse(route.params.data)
      : formData.value;
  formData.value = Object.assign(formData.value, params);
  const urlParams = Object.assign({}, formData.value);

  if (isNewSearch) {
    scrollToID.value = '#results';
    event.preventDefault();
  }

  Object.keys(urlParams).forEach(
    (key) => (!urlParams[key] || key === 'page') && delete urlParams[key]
  );

  router
    .push({
      name: 'results',
      params: {
        data: qs.stringify(urlParams, { arrayFormat: 'repeat' }),
      },
    })
    .catch((e) => e);

  api
    .getInitiatives(formData.value)
    .then((response) => {
      if (!isNewSearch) {
        initiatives.value.push.apply(initiatives.value, response.initiatives);
      } else {
        initiatives.value = response.initiatives;
      }
      query_meta.value = response.query_meta;
      loadingResults.value = false;
      nextTick().then(() => {
        VueScrollTo.scrollTo(scrollToID.value, 1500);
      });
    })
    .catch((error) => (errors.value = error));
};

onMounted(() => {
  if (route.name == 'results') {
    getResults();
  }
});

onUpdated(() => {
  if (document.getElementById('downloadCSV')) {
    document.getElementById('downloadCSV').click();
  }
});
</script>
