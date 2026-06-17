<template>
  <div id="app">
    <TipiNavbar
      pre-image="/img/multicolor.jpg"
      :links="MENU"
      :disclaimerLink="DISCLAIMER"
      :logo="LOGO"
    />
    <div class="page-container">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <FooterBlock />
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
.page-container {
  min-height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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
