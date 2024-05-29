<template>
  <div>
    <div
      id="footer"
      class="o-container o-container--fluid o-section u-bg-secondary-light"
    >
      <div class="o-container">
        <div class="o-grid">
          <div class="o-grid__col u-7@sm u-margin-top-4">
            <p class="u-text-overline">Impulsado por</p>
            <div class="o-grid">
              <div class="o-grid__col u-7@sm">
                <a
                  href="http://www.exteriores.gob.es/Portal/es/Ministerio/SecretariosDeEstado/SecretariaDeEstadoCooperacionInternacional/Paginas/Inicio.aspx"
                  target="_blank"
                  ><img
                    src="/img/maeuec-seci.jpg"
                    class="big u-margin-top-3"
                    alt="Logo de la Secretaria de Estado de Cooperación (Ministerio de Asuntos Exteriores, Unión Europea y Cooperación) del Gobierno de España"
                /></a>
              </div>
              <div class="o-grid__col u-5@sm">
                <a href="http://politicalwatch.es" target="_blank"
                  ><img
                    src="/img/logo-politicalwatch.png"
                    class="big"
                    alt="Logo de Political Watch"
                /></a>
              </div>
            </div>
          </div>
          <div class="o-grid__col u-4@sm u-offset-1@sm u-margin-top-4">
            <p class="u-text-overline">Enlaces de interés</p>
            <router-link
              :to="{ name: 'faq' }"
              class="u-color-secondary-dark u-text-tbody2"
              >Preguntas frecuentes</router-link
            >
            <br />
            <router-link
              :to="{ name: 'footprint' }"
              class="u-color-secondary-dark u-text-tbody2"
              >Huella</router-link
            >
            <br />
            <tipi-icon icon="github" class="c-icon--secondary-dark" />&nbsp;<a
              class="u-color-secondary-dark u-text-tbody2"
              href="http://github.com/politicalwatch/"
              title="github.com/politicalwatch"
              target="_blank"
              >Consulta nuestro código en Github</a
            >
            <br />
            <tipi-icon icon="mail" class="c-icon--secondary-dark" />&nbsp;<a
              class="u-color-secondary-dark u-text-tbody2"
              href="mailto:parlamento2030@politicalwatch.es"
              title="parlamento2030@politicalwatch.es"
              target="_blank"
              >Escribe a parlamento2030@politicalwatch.es</a
            >
          </div>
        </div>
        <div class="o-grid">
          <div class="o-grid__col u-12@sm u-margin-top-4">
            <p class="u-color-secondary-dark u-text-tbody2">
              &copy; 2018-{{ new Date().getFullYear() }} Political Watch -
              <router-link
                :to="{ name: 'legalnotice' }"
                class="u-color-secondary-dark"
                >Aviso legal</router-link
              >
              -
              <router-link
                :to="{ name: 'privacypolicy' }"
                class="u-color-secondary-dark"
                >Política de privacidad</router-link
              >
              -
              <router-link
                :to="{ name: 'cookiepolicy' }"
                class="u-color-secondary-dark"
                >Política de cookies</router-link
              >
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      class="c-decorator"
      style="background-image: url('/img/multicolor.jpg')"
    ></div>

    <vue-cookie-accept-decline
      :debug="false"
      :disableDecline="false"
      :showPostponeButton="false"
      @clicked-accept="cookieClickedAccept"
      @clicked-decline="cookieClickedDecline"
      @status="cookieStatus"
      elementId="cookiePanel"
      ref="cookiePanel"
      transitionName="slideFromBottom"
      type="floating"
    >
      <template #message>
        Este sitio usa cookies para asegurarte la mejor experiencia web.
      </template>

      <template #declineContent>Rechazar</template>
      <template #acceptContent>Aceptar</template>
    </vue-cookie-accept-decline>
  </div>
</template>

<script setup>
import VueCookieAcceptDecline from 'vue-cookie-accept-decline';
import 'vue-cookie-accept-decline/dist/vue-cookie-accept-decline.css';
import { bootstrap } from 'vue-gtag';
import { TipiIcon } from '@politicalwatch/tipi-uikit';

const cookieStatus = (val) => {
  // console.log('Cookie status: ' + val);
  if (val === 'decline' || val == null) {
    if (gtag) {
      gtag('consent', 'default', {
        ad_storage: 'denied',
        analytics_storage: 'denied',
      });
    }
  } else if (val === 'accept') {
    bootstrap().then(() => {
      gtag('consent', 'update', {
        ad_storage: 'granted',
        analytics_storage: 'granted',
      });
    });
  }
};

const cookieClickedAccept = () => {
  bootstrap().then(() => {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
    });
  });
};

const cookieClickedDecline = () => {
  gtag('consent', 'default', {
    ad_storage: 'denied',
    analytics_storage: 'denied',
  });
};
</script>

<style scoped lang="scss"></style>
