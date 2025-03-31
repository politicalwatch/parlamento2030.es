import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import { createHead } from '@unhead/vue/client';
import router from '@/router';
import { MotionPlugin } from '@vueuse/motion';
import VueGtag from 'vue-gtag';
import VueScrollTo from 'vue-scrollto';

const app = createApp(App);

app.use(router);
app.use(createPinia());
app.use(createHead());
app.use(
  VueGtag,
  {
    config: { id: import.meta.env.VITE_GA_ID },
    boootstrap: false,
  },
  router
);
app.use(MotionPlugin);

app.directive('scroll-to', VueScrollTo);

app.mount('#app');
