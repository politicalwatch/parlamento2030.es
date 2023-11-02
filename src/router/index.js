import { createRouter, createWebHistory } from 'vue-router';
import sha1 from 'crypto-js/sha1';
import Search from '@/views/Search.vue';
import config from '@/config';

const routes = [
  {
    path: '/',
    name: 'search',
    component: Search,
    meta: {
      title: 'Buscar - Parlamento 2030',
      metaTags: [
        {
          name: 'description',
          content: 'Test Buscar',
        },
        {
          property: 'og:description',
          content: 'Test Buscar',
        },
        {
          property: 'og:title',
          content: 'Test Buscar',
        },
        ...config.DEFAULT_METATAGS,
      ],
    },
  },
  {
    path: '/resultados/:data?',
    name: 'results',
    component: Search,
    meta: {
      title: 'Resultados - Parlamento 2030',
      metaTags: [
        {
          name: 'description',
          content: 'Test Resultados',
        },
        {
          property: 'og:description',
          content: 'Test Resultados',
        },
        ...config.DEFAULT_METATAGS,
      ],
    },
  },
  {
    path: '/iniciativas/:id',
    name: 'initiative',
    // component: Initiative,
    component: () => import('@/views/Initiative.vue'),
    meta: {
      title: 'Iniciativa - Parlamento 2030',
      metaTags: [
        {
          name: 'description',
          content: 'Test Iniciativa',
        },
        {
          property: 'og:title',
          content: 'Iniciativa OG title',
        },
        {
          property: 'og:description',
          content: 'Test Iniciativa',
        },
        ...config.DEFAULT_METATAGS,
      ],
    },
  },
  {
    path: '/initiatives/:id',
    redirect: (to) => {
      return { name: 'initiative', params: { id: to.params.id } };
    },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // component: Dashboard,
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/ods',
    name: 'ods',
    // component: Topics,
    component: () => import('@/views/Topics.vue'),
  },
  {
    path: '/ods/1',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 1 Fin de la pobreza') },
      };
    },
  },
  {
    path: '/ods/2',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 2 Hambre cero') },
      };
    },
  },
  {
    path: '/ods/3',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 3 Salud y bienestar') },
      };
    },
  },
  {
    path: '/ods/4',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 4 Educación de calidad') },
      };
    },
  },
  {
    path: '/ods/5',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 5 Igualdad de género') },
      };
    },
  },
  {
    path: '/ods/6',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 6 Agua limpia y saneamiento') },
      };
    },
  },
  {
    path: '/ods/7',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 7 Energía asequible y no contaminante') },
      };
    },
  },
  {
    path: '/ods/8',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 8 Trabajo decente y crecimiento económico') },
      };
    },
  },
  {
    path: '/ods/9',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 9 Industria, innovación e infraestructura') },
      };
    },
  },
  {
    path: '/ods/10',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 10 Reducción de las desigualdades') },
      };
    },
  },
  {
    path: '/ods/11',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 11 Ciudades y comunidades sostenibles') },
      };
    },
  },
  {
    path: '/ods/12',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 12 Producción y consumo responsables') },
      };
    },
  },
  {
    path: '/ods/13',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 13 Acción por el clima') },
      };
    },
  },
  {
    path: '/ods/14',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 14 Vida submarina') },
      };
    },
  },
  {
    path: '/ods/15',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 15 Vida de ecosistemas terrestres') },
      };
    },
  },
  {
    path: '/ods/16',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 16 Paz, justicia e instituciones sólidas') },
      };
    },
  },
  {
    path: '/ods/17',
    redirect: (to) => {
      return {
        path: '/topic',
        query: { id: sha1('ODS 17 Alianzas para lograr los objetivos') },
      };
    },
  },
  {
    path: '/ods/:id',
    name: 'topic',
    // component: Topic,
    component: () => import('@/views/Topic.vue'),
  },
  {
    path: '/diputados/:id',
    name: 'deputy',
    // component: Deputy,
    component: () => import('@/views/Deputy.vue'),
  },
  {
    path: '/grupos/:id',
    name: 'parliamentarygroup',
    // component: Parliamentarygroup,
    component: () => import('@/views/Parliamentarygroup.vue'),
  },
  {
    path: '/scanner',
    name: 'scanner',
    beforeEnter() {
      location.href = 'https://escaner2030.es';
    },
  },
  {
    path: '/acerca',
    name: 'about',
    // component: About,
    component: () => import('@/views/About.vue'),
  },
  {
    path: '/about-en',
    name: 'about-en',
    // component: AboutEnglish,
    component: () => import('@/views/AboutEnglish.vue'),
  },
  {
    path: '/aviso-legal',
    name: 'legalnotice',
    // component: LegalNotice,
    component: () => import('@/views/LegalNotice.vue'),
  },
  {
    path: '/politica-de-privacidad',
    name: 'privacypolicy',
    // component: PrivacyPolicy,
    component: () => import('@/views/PrivacyPolicy.vue'),
  },
  {
    path: '/politica-de-cookies',
    name: 'cookiepolicy',
    // component: CookiePolicy,
    component: () => import('@/views/CookiePolicy.vue'),
  },
  {
    path: '/alertas',
    name: 'alerts',
    // component: Alerts,
    component: () => import('@/views/Alerts.vue'),
  },
  {
    path: '/faq',
    name: 'faq',
    // component: Faq,
    component: () => import('@/views/Faq.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Page404',
    // component: Page404,
    component: () => import('@/views/Page404.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return {
      x: 0,
      y: 0,
    };
  },
  routes: routes,
});

router.beforeEach((to, from, next) => {
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;
  else document.title = config.DEFAULT_PAGE_TITLE;

  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(
    (el) => el.parentNode.removeChild(el)
  );

  let metaTags = !nearestWithMeta
    ? config.DEFAULT_METATAGS
    : nearestWithMeta.meta.metaTags;

  if (nearestWithMeta) {
    metaTags = metaTags.filter((obj, pos, arr) => {
      return (
        arr.map((mapObj) => mapObj['name']).indexOf(obj['name']) === pos ||
        arr.map((mapObj) => mapObj['property']).indexOf(obj['property']) === pos
      );
    });
  }

  metaTags
    .map((tagDef) => {
      const tag = document.createElement('meta');

      Object.keys(tagDef).forEach((key) => {
        tag.setAttribute(key, tagDef[key]);
      });

      tag.setAttribute('data-vue-router-controlled', '');

      return tag;
    })
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;
