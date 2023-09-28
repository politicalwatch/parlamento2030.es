<template>
  <div>
    <div
      v-if="loaded"
      id="initiative"
      class="o-container o-section u-margin-bottom-10"
    >
      <div v-if="!initiative.id">
        <div class="o-grid u-padding-top-10 u-padding-bottom-10">
          <div
            class="o-grid__col u-12 u-10@sm u-offset-1@sm u-text-center u-padding-top-4 u-padding-bottom-4"
          >
            <h1>Iniciativa no encontrada</h1>
            <p class="u-padding-top-4">
              Esto puede deberse a que la iniciativa no tiene relación directa
              con la Agenda 2030 y sus ODS o que aún no han sido procesados los
              últimos datos del Congreso de los Diputados. Accede nuevamente en
              unos días para comprobar si ya se ha actualizado o suscríbete a
              una alerta personalizada para recibir en tu mail todas las
              actualizaciones del Congreso.
            </p>
            <p>
              Encuentra
              <router-link :to="{ name: 'about' }">más información</router-link>
              sobre la herramienta o utiliza el
              <router-link :to="{ name: 'search' }">buscador</router-link> para
              encontrar iniciativas similares.
            </p>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="o-grid o-grid--between">
          <div class="o-grid__col u-12 u-8@md">
            <h1 class="u-text-th4 u-margin-bottom-4">{{ initiative.title }}</h1>
            <div class="o-grid">
              <div class="o-grid__col u-12 u-5@sm u-text-center u-text-left@sm">
                <tipi-initiative-meta :initiative="initiative" />
              </div>
              <div
                class="o-grid__col u-12 u-7@sm u-text-left u-text-center u-text-right@sm"
              >
                <conversation-link
                  v-if="initiative.status == 'Respondida'"
                  :id="initiative.id"
                  :isAnswer="initiative.initiative_type_alt == 'Respuesta'"
                ></conversation-link>
                <tipi-congress-link :url="initiative.url"></tipi-congress-link>
              </div>
            </div>

            <div
              class="o-grid u-padding-top-4 u-border-top u-border-bottom u-margin-bottom-4"
            >
              <div class="o-grid__col o-grid__col--fill">
                <tipi-text
                  meta="Tipo de acto parlamentario"
                  :value="initiative.initiative_type_alt"
                />
              </div>
              <div class="o-grid__col u-12 u-3@sm">
                <tipi-text meta="Referencia" :value="initiative.reference" />
              </div>
              <div class="o-grid__col u-12 u-3@sm">
                <tipi-text meta="Registro" :value="formattedDate" />
              </div>
            </div>
            <tipi-topics
              class="u-hide u-block@md"
              meta="ODS tratados"
              :topics="getTopics()"
              :tags="getTags()"
              :topicsStyles="styles.topics"
            />

            <div
              class="o-grid u-margin-top-4 u-padding-top-4 u-border-top u-hide u-block@md"
              v-if="initiative.related && initiative.related.length"
            >
              <div class="o-grid__col o-grid__col--fill">
                <h4 id="related" class="u-margin-bottom-4">
                  Iniciativas relacionadas
                </h4>
                <tipi-results
                  :initiatives="initiative.related"
                  :topicsStyles="styles.topics"
                />
              </div>
            </div>
          </div>
          <div class="o-grid__col u-12 u-3@md">
            <div class="u-padding-bottom-4 u-border-bottom u-margin-bottom-4">
              <InitiativeChart
                :initiative="initiative"
                :topics="allTopics"
                :styles="styles"
                v-if="dataLoaded"
              ></InitiativeChart>
              <span class="u-text-tbody2"
                >Relación de esta iniciativa con los ODS
                <sup
                  title="El gráfico muestra los ODS relacionados con la iniciativa y el grado de relación con cada uno de ellos, cuya intensidad se refleja en la barra circular que los rodea."
                  >?</sup
                ></span
              >
            </div>
            <div class="u-border-bottom u-margin-bottom-4">
              <tipi-text
                meta="Autor"
                :value="initiative.authors"
                type="parliamentarygroup"
                :source="allParliamentaryGroups"
              />
              <tipi-text
                meta="Diputada/o"
                :value="initiative.deputies"
                type="deputy"
                :source="allDeputies"
              />
            </div>
          </div>
        </div>
        <div class="u-hide@md">
          <tipi-topics
            meta="ODS tratados"
            :topics="getTopics()"
            :tags="getTags()"
            :topicsStyles="styles.topics"
          />

          <div
            class="u-margin-top-4 u-padding-top-4 u-border-top"
            v-if="initiative.related && initiative.related.length"
          >
            <h4 id="related" class="u-margin-bottom-4">
              Iniciativas relacionadas
            </h4>
            <tipi-results
              :initiatives="initiative.related"
              :topicsStyles="styles.topics"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else class="o-container o-section u-margin-bottom-10">
      <tipi-loader
        title="Cargando datos"
        subtitle="Puede llevar unos segundos"
      />
    </div>
  </div>
</template>

<script>
import {
  TipiHeader,
  TipiCongressLink,
  TipiText,
  TipiTopics,
  TipiInitiativeMeta,
  TipiNeuron,
  TipiTopicPill,
  TipiResults,
  TipiLoader,
} from 'tipi-uikit';
import api from '@/api';
import config from '@/config';
import { mapState } from 'vuex';
import format from 'date-fns/format';
import InitiativeChart from '@/components/initiative-chart.vue';
import ConversationLink from '@/components/conversation-link.vue';

export default {
  name: 'initiative',
  components: {
    ConversationLink,
    TipiCongressLink,
    TipiHeader,
    TipiText,
    TipiTopics,
    TipiInitiativeMeta,
    TipiNeuron,
    TipiTopicPill,
    TipiResults,
    InitiativeChart,
    TipiLoader,
  },
  data: function () {
    return {
      initiative: {},
      styles: config.STYLES,
      loaded: false,
    };
  },
  computed: {
    ...mapState(['allDeputies', 'allTopics', 'allParliamentaryGroups']),
    dataLoaded: function () {
      return Object.keys(this.initiative).length && this.allTopics.length > 0;
    },
    formattedDate: function () {
      return format(new Date(this.initiative.created), 'dd/MM/Y');
    },
  },
  methods: {
    getInitiative: function () {
      api
        .getInitiative(this.$route.params.id)
        .then((response) => {
          this.initiative = response;
          this.loaded = true;
          window.document.title =
            window.document.head.querySelector(
              'meta[property="og:title"]'
            ).content =
            window.document.head.querySelector(
              'meta[name="twitter:title"]'
            ).content =
              `${this.initiative.title} - ${config.DEFAULT_PAGE_TITLE}`;
        })
        .catch((error) => {
          this.errors = error;
          this.loaded = true;
        });
    },
    getTopics: function () {
      let topics = [];
      for (const tagged of this.initiative['tagged']) {
        topics = topics.concat(tagged['topics']);
      }
      return topics;
    },
    getTags: function () {
      let tags = [];
      for (const tagged of this.initiative['tagged']) {
        tags = tags.concat(tagged['tags']);
      }
      return tags;
    },
  },
  created: function () {
    this.getInitiative();
  },
  watch: {
    $route: 'getInitiative',
  },
};
</script>

<style lang="scss">
.c-initiative-meta,
.c-congress-link {
  display: inline-block;
  margin-bottom: 37px;
}
</style>
