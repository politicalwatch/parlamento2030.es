<template>
  <div>
    <div id="footer" class="o-container o-container--fluid o-section u-bg-secondary-light">

      <div class="o-container">
        <div class="o-grid">
          <div class="o-grid__col u-7@sm u-margin-top-4">
            <p class="u-text-overline">Impulsado por</p>
            <div class="o-grid">
              <div class="o-grid__col u-7@sm">
                <a href="http://www.exteriores.gob.es/Portal/es/Ministerio/SecretariosDeEstado/SecretariaDeEstadoCooperacionInternacional/Paginas/Inicio.aspx" target="_blank"><img src="/img/maeuec-seci.jpg" class="big u-margin-top-3" alt="Logo de la Secretaria de Estado de Cooperación (Ministerio de Asuntos Exteriores, Unión Europea y Cooperación) del Gobierno de España"></a>
              </div>
              <div class="o-grid__col u-5@sm">
                <a href="http://politicalwatch.es" target="_blank"><img src="/img/logo-politicalwatch.png" class="big" alt="Logo de Political Watch"></a>
              </div>
            </div>
          </div>
          <div class="o-grid__col u-4@sm u-offset-1@sm u-margin-top-4">
            <p class="u-text-overline">Contacto</p>
            <tipi-icon icon="github" class="c-icon--secondary-dark" />&nbsp;<a class="u-color-secondary-dark u-text-tbody2" href="http://github.com/politicalwatch/" title="github.com/politicalwatch" target="_blank">Consulta nuestro código en Github</a>
            <br>
            <tipi-icon icon="mail" class="c-icon--secondary-dark" />&nbsp;<a class="u-color-secondary-dark u-text-tbody2" href="mailto:parlamento2030@politicalwatch.es" title="parlamento2030@politicalwatch.es" target="_blank">Escribe a parlamento2030@politicalwatch.es</a>
          </div>
        </div>
        <div class="o-grid">
          <div class="o-grid__col u-12@sm u-margin-top-4">
            <p class="u-color-secondary-dark u-text-tbody2">{{ (new Date()).getFullYear()  }} Political Watch - <router-link :to="{name: 'legalnotice'}" class="u-color-secondary-dark">Aviso legal</router-link> - <router-link :to="{name: 'privacypolicy'}" class="u-color-secondary-dark">Política de privacidad</router-link> - <router-link :to="{name: 'cookiepolicy'}" class="u-color-secondary-dark">Política de cookies</router-link> - <router-link :to="{name: 'faq'}" class="u-color-secondary-dark">Preguntas frecuentes</router-link></p>
          </div>
        </div>
      </div>

    </div>

    <div class="c-decorator" style="background-image: url('/img/multicolor.jpg')"></div>

    <cookie-law theme="base" buttonText="Entendido" buttonClass="btn btn-custom" message="Este sitio usa cookies para asegurarte la mejor experiencia web."></cookie-law>

  </div>
</template>

<script>
  import CookieLaw from 'vue-cookie-law';
  import { TipiIcon } from 'tipi-uikit';

  export default {
    name: "footer-block",
    components: {
      CookieLaw,
      TipiIcon
    }
  }
</script>

<style scoped lang="scss">
</style>
