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
                <ConversationLink
                  v-if="initiative.status == 'Respondida'"
                  :id="initiative.id"
                  :isAnswer="initiative.initiative_type_alt == 'Respuesta'"
                ></ConversationLink>
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
            <div class="o-grid u-padding-top-4 u-margin-bottom-4">
              <div
                :class="
                  initiative.deputies.length
                    ? 'o-grid__col u-12 u-4@sm'
                    : 'o-grid__col u-12'
                "
                v-if="initiative.authors.length"
              >
                <tipi-text
                  meta="Autor"
                  :value="initiative.authors"
                  type="parliamentarygroup"
                  :source="store.allParliamentaryGroups"
                />
              </div>
              <div
                class="o-grid__col u-12 u-8@sm"
                v-if="initiative.deputies.length"
              >
                <tipi-text
                  class="c-text__list--deputies"
                  meta="Diputada/o"
                  :value="initiative.deputies"
                  type="deputy"
                  :source="store.allDeputies"
                />
              </div>
            </div>
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
                :topics="store.allTopics"
                :styles="styles"
                v-if="dataLoaded"
              ></InitiativeChart>
              <Tooltip
                text="El gráfico muestra los ODS relacionados con la iniciativa y el grado de relación con cada uno de ellos, cuya intensidad se refleja en la barra circular que los rodea."
              >
                <span>Relación de esta iniciativa con los ODS</span>
              </Tooltip>
            </div>
          </div>
          <div class="o-grid__col u-12">
            <h6 class="c-text__label u-margin-bottom-4">ODS tratados</h6>
            <tabs :tabs="[{ label: 'Modo visual' }, { label: 'Modo texto' }]">
              <template #tab-0>
                <div v-motion-fade>
                  <InitiativeFlow
                    :initiative="initiative"
                    :topics="store.allTopics"
                    :styles="styles"
                    v-if="dataLoaded"
                  />
                </div>
              </template>
              <template #tab-1>
                <tipi-topics
                  class="u-hide u-block@md"
                  meta="ODS tratados"
                  :topics="getTopics()"
                  :tags="getTags()"
                  :topicsStyles="styles.topics"
                  v-motion-fade
                />
              </template>
            </tabs>
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { format } from 'date-fns/format';
import {
  TipiCongressLink,
  TipiText,
  TipiTopics,
  TipiInitiativeMeta,
  TipiResults,
  TipiLoader,
} from '@politicalwatch/tipi-uikit';

import api from '@/api';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';
import InitiativeChart from '@/components/InitiativeChart.vue';
import ConversationLink from '@/components/ConversationLink.vue';
import Tabs from '@/components/Tabs.vue';
import Tooltip from '@/components/Tooltip.vue';
import InitiativeFlow from '@/components/InitiativeFlow.vue';

const route = useRoute();
const store = useParliamentStore();

const styles = config.STYLES;

const initiative = ref({});
const loaded = ref(false);
const errors = ref([]);

const headTitle = computed(() => {
  return initiative.value?.title
    ? `${initiative.value.title} - Parlamento2030`
    : 'Parlamento2030';
});

useHead({
  title: headTitle,
});

const dataLoaded = computed(() => {
  return Object.keys(initiative.value).length && store.allTopics.length > 0;
});

const formattedDate = computed(() => {
  return format(new Date(initiative.value.created), 'dd/MM/y');
});

const getInitiative = () => {
  api
    .getInitiative(route.params.id)
    .then((response) => {
      initiative.value = response;
      loaded.value = true;
    })
    .catch((error) => {
      errors.value = error;
      loaded.value = true;
    });
};

const getTopics = () => {
  return initiative.value['tagged'].reduce((topics, tagged) => {
    return topics.concat(tagged['topics']);
  }, []);
};

const getTags = () => {
  return initiative.value['tagged'].reduce((tags, tagged) => {
    return tags.concat(tagged['tags']);
  }, []);
};

onMounted(() => {
  getInitiative();
});

watch(route, () => {
  getInitiative();
});
</script>

<style lang="scss">
.c-initiative-meta,
.c-congress-link {
  display: inline-block;
  margin-bottom: 37px;
}

.c-text__list--deputies {
  .c-text__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }
}
</style>
