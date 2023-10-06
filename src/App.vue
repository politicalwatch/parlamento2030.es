<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div>
        <tipi-navbar
          pre-image="/img/multicolor.jpg"
          :links="MENU"
          :disclaimerLink="DISCLAIMER"
          :logo="LOGO"
        />
        <router-view />
        <footer-block />
      </div>
    </transition>
  </div>
</template>

<script>
import { TipiNavbar } from '@politicalwatch/tipi-uikit';
import FooterBlock from '@/components/footer-block.vue';
import config from '@/config';
import { useParliamentStore } from "@/stores/parliament";

export default {
  name: 'app',
  components: {
    TipiNavbar,
    FooterBlock,
  },
  setup() {
    const store = useParliamentStore();
    return { store };
  },
  data: function () {
    return {
      MENU: config.MENU,
      DISCLAIMER: config.DISCLAIMER,
      LOGO: config.LOGO,
    };
  },
  created: function () {
    this.store.getDeputies();
    this.store.getTopics();
    this.store.getStatus();
    this.store.getPlaces();
    this.store.getTypes();
    this.store.getParliamentaryGroups();
  },
};
</script>

<style lang="scss">
.c-disclaimer {
  a {
    img {
      width: 25px !important;
      height: auto !important;
    }
  }
}
</style>
