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
        ><tipi-icon icon="mail" /> {{ deputy.email }}</a
      >
      <a
        v-if="deputy.hasOwnProperty('twitter')"
        :href="deputy.twitter"
        target="_blank"
        ><tipi-icon icon="twitter" /> @{{
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
        :styles="topicsStyles"
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

    <alert-block
      :text="'No te pierdas nada de la actividad parlamentaria de '"
      :value="deputy.name"
      :searchparams="{ deputy: deputy.name }"
      v-if="use_alerts && deputy.active"
    />
  </div>
  <div v-else class="o-container o-section u-margin-bottom-10">
    <tipi-loader title="Cargando datos" subtitle="Puede llevar unos segundos" />
  </div>
</template>

<script>
import {
  TipiHeader,
  TipiCongressLink,
  TipiDeputy,
  TipiMessage,
  TipiResults,
  TipiIcon,
  TipiLoader,
} from '@politicalwatch/tipi-uikit';
import AlertBlock from '@/components/alert-block.vue';
import SdgBarchartFootprint from '@/components/sdg-barchart-footprint.vue';
import FootprintInfo from '@/components/FootprintInfo.vue';
import api from '@/api';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';

export default {
  name: 'deputy',
  components: {
    TipiCongressLink,
    TipiHeader,
    TipiDeputy,
    TipiMessage,
    TipiResults,
    TipiIcon,
    TipiLoader,
    AlertBlock,
    SdgBarchartFootprint,
    FootprintInfo,
  },
  setup() {
    const store = useParliamentStore();
    return { store };
  },
  data: function () {
    return {
      deputy: null,
      parliamentarygroup: null,
      latestInitiatives: null,
      topicsRanking: null,
      use_alerts: config.USE_ALERTS,
      topicsStyles: config.STYLES.topics,
      styles: config.STYLES,
    };
  },
  computed: {
    footprintByTopics: function () {
      if (this.deputy) {
        return this.deputy.footprint_by_topics.filter((item) =>
          this.store.allTopics.some((topic) => topic.name === item.name)
        );
      }
      return [];
    },
  },
  methods: {
    getDeputy: function () {
      api
        .getDeputy(this.$route.params.id)
        .then((response) => {
          this.deputy = response;
          this.parliamentarygroup = this.store.allParliamentaryGroups.find(
            (allPG) => allPG.shortname === this.deputy.parliamentarygroup
          );
          this.getLatestInitiatives();
        })
        .catch((error) => {
          this.errors = error;
          this.$router.push({ name: 'Page404', params: { 0: '404' } });
        });
    },
    getLatestInitiatives: function () {
      api
        .getInitiatives({ deputy: this.deputy.name, per_page: 12 })
        .then((response) => {
          if (response.initiatives)
            this.latestInitiatives = response.initiatives;
        })
        .catch((error) => (this.errors = error));
    },
    getTopicsRanking: function () {
      api
        .getTopicsByParliamentaryGroupRanking(this.parliamentarygroup.name)
        .then((response) => {
          this.topicsRanking = response;
        })
        .catch((error) => (this.errors = error));
    },
  },
  metaInfo() {
    const title = this.deputy?.name
      ? `${this.deputy.name} - Parlamento2030`
      : '- Parlamento2030';

    return {
      title,
      meta: [
        {
          property: 'og:title',
          content: title,
          vmid: 'og:title',
        },
        {
          property: 'twitter:title',
          content: title,
          vmid: 'twitter:title',
        },
      ],
    };
  },
  created: function () {
    this.getDeputy();
  },
};
</script>

<style scoped lang="scss"></style>
