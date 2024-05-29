<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <div>
        <TipiNavbar
          pre-image="/img/multicolor.jpg"
          :links="MENU"
          :disclaimerLink="DISCLAIMER"
          :logo="LOGO"
        />
        <router-view />
        <FooterBlock />
      </div>
    </transition>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { TipiNavbar } from '@politicalwatch/tipi-uikit';

import config from '@/config';
import { useParliamentStore } from '@/stores/parliament';
import FooterBlock from '@/components/FooterBlock.vue';

const store = useParliamentStore();

const MENU = config.MENU;
const DISCLAIMER = config.DISCLAIMER;
const LOGO = config.LOGO;

onMounted(() => {
  store.getStatus();
  store.getPlaces();
  store.getTypes();
  store.getTopics();
  store.getParliamentaryGroups();
  store.getDeputies();
});
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

input[type='email'].swal2-input {
  width: auto;
}
</style>
