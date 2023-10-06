<template>
  <div class="o-container o-section u-padding-bottom-10 u-margin-bottom-10">
    <tipi-header title="Temáticas" />
    <div class="o-grid">
      <div
        class="o-grid__col u-6 u-3@sm u-2@md"
        v-for="topic in this.store.allTopics"
        :key="topic.id"
      >
        <tipi-topic-link
          path="ods"
          :topic="topic"
          :image="topicsStyles[topic.name].image"
          :color="topicsStyles[topic.name].color"
        />
      </div>
      <div class="o-grid__col u-6 u-3@sm u-2@md">
        <a
          target="_blank"
          href="https://www.un.org/sustainabledevelopment/es/objetivos-de-desarrollo-sostenible/"
          class="c-topic-link__image-link"
          ><img
            src="/img/topics/ods-18.jpg"
            alt="Imagen general de los ODS de Naciones Unidfas"
            class="c-topic-link__image"
            style="max-width: 100%; max-height: 100%"
        /></a>
      </div>
    </div>
  </div>
</template>

<script>
import { TipiHeader, TipiTopicLink } from '@politicalwatch/tipi-uikit';
import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';

export default {
  name: 'topics',
  components: {
    TipiHeader,
    TipiTopicLink,
  },
  setup() {
    const store = useParliamentStore();
    return { store };
  },
  data: function () {
    return {
      topicsStyles: config.STYLES.topics,
    };
  },
};
</script>
