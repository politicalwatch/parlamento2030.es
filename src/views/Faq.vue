<template>
  <div>
    <div id="faq" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="FAQ"/>
      <div class="o-grid">
        <div class="o-grid__col u-8@sm u-offset-2@sm">
          <router-link class="c-button c-button--compact u-padding-left-0" :to="{name: 'faq-en'}">Read this page in English</router-link>
          <h4>¿Si ya existe un buscador en la web del Congreso de los Diputados, para qué necesito la herramienta Parlamento 2030?</h4>
          <p>El buscador de Parlamento 2030 ofrece las mismas posibilidades de búsqueda que el de la web del Congreso de los Diputados (fecha, lugar, autor, tipo de acto parlamentario, etc.) pero ofrece algunos importantes servicios añadidos: la clasificación por en función de los ODS, el servicio de alertas personalizadas o la posibilidad de descargarte en formatos reutilizables (Excel, csv, etc.) la información que te interese.</p>
          <h4>La categoría “ODS 1” de Parlamento 2030 resulta demasiado amplia y genérica para serme útil en mi trabajo, ¿qué puedo hacer?</h4>
          <p>Somos conscientes de que cada organización o cada persona dentro de cada organización puede tener interés en conocer en un determinado momento la actividad parlamentaria en tema mucho más específico que el ofrecido por el enfoque amplio del diccionario de “ODS 1”. Por ello, esta nueva versión de Parlamento 2030 va a ofrecer una nueva posibilidad de búsqueda: además de los campos habituales de búsqueda (autor, fecha, estado de tramitación parlamentaria, palabras clave, etc.) el usuario va a poder buscar por los términos concretos del diccionario (“prestación por hijo a cargo”, “participación infantil”, “prevención de adicciones en menores”, etc.), por lo que se podrá personalizar mucho la búsqueda. Además, esta búsqueda se realiza sobre la totalidad del texto del acto parlamentario (texto registrado, enmiendas, debate parlamentario, texto aprobado, etc.) y no sólo en el título del acto como ocurre con otros buscadores que ya existen en España (Qué Hacen los Diputados, por ejemplo), por lo que es difícil que se pase algo por alto.</p>
          <h4>Si a mitad de legislatura le surge a mi organización la necesidad de incluir un enfoque totalmente nuevo que no habíamos previsto, ¿puede Parlamento 2030 adaptarse?</h4>
          <p>Lo ideal es que el contenido de los diccionarios con los que lanzamos Parlamento 2030 sea lo suficientemente amplio y comprehensivo como para ser capaz de recoger casi cualquier debate político relevante que se vaya a dar en cada una de las temáticas, al menos en los próximos años. Cada uno de los diccionarios ha sido revisado por diferentes entidades expertas en la materia. Aún así, si hubiera necesidad de un enfoque absolutamente novedoso, existen dos soluciones. En primer lugar, simplemente incluyendo nuevos términos en los diccionarios. En segundo lugar, la tecnología detrás de Parlamento 2030 es libre y abierta, de manera que cualquiera pueda replicarlo con sus propios diccionarios.</p>
          <h4>Me gusta la idea de Parlamento 2030, pero no veo cómo meter el seguimiento de la actividad parlamentaria en mi apretada agenda.</h4>
          <p>Somos conscientes de ello, por eso, además de las posibilidades que la herramienta ofrece cuando la usas proactivamente, hemos querido incluir la posibilidad de que el usuario se dé de alta a un servicio de alertas (SPA: Sistema Personalizado de Alertas), de modo que una vez por semana le llegue un e-mail con la actividad parlamentaria ocurrida en los últimos 7 días sobre la temática o temáticas de su interés.</p>
          <h4>Está bien saber qué ha pasado en el Congreso de los Diputados, pero  ¿me ofrecerá Parlamento 2030 la información sobre qué va a pasar en las siguientes jornadas en el Parlamento?</h4>
          <p>Esa es la idea, aunque aún estamos trabajando en ello. En principio, la información sobre la agenda parlamentaria será enviada semanalmente a través del SPA (Sistema Personalizado de Alertas) junto con el resumen de la actividad parlamentaria pasada.</p>
          <h4>¡Gracias! He encontrado lo que buscaba, qué puedo hacer con la  información obtenida.</h4>
          <p>Parlamento 2030 te ofrece la posibilidad de descargarte el resultado de tu búsqueda en formatos reutilizables (Excel, csv, etc.).</p>
          <h4>He realizado una búsqueda y Parlamento 2030 me dice que el acto parlamentario encontrado también está relacionado con otras temáticas (“población  gitana”, “fiscalidad”, “migraciones”, etc.) y quiero saber por qué.</h4>
          <p>Uno de los valores añadidos de Parlamento 2030 es que es sensible a la transversalidad de la mayoría de los asuntos debatidos en política y su buscador es capaz de vincular un acto parlamentario con todos los ámbitos con los que está  relacionado. Para que el usuario pueda comprender a qué se debe la relación con cada tema vinculado, el resultado de cada búsqueda ofrece el listado de  términos “activados” para cada ámbito temático. Creemos que esta información va a ser de gran utilidad y puede deparar interesantes sorpresas (¿Qué tiene  que ver la reforma de la Ley del Sector Ferroviario con la diversidad funcional”? ¿Por qué está relacionada la comparecencia del presidente de RTVE con los intereses de las organizaciones trabajando con población gitana?).</p>
          <h4>¿Y qué pasa con la actividad del Ejecutivo? ¿Y las Comunidades Autónomas y entidades locales?</h4>
          <p>Aunque entendemos la enorme utilidad que tendría ofrecer esta información, por ahora Parlamento 2030 no va a cubrir específicamente la actividad del Ejecutivo ni de las CC.AA y entidades locales. Indirectamente, Parlamento 2030 sí ofrece cierta actividad del Ejecutivo (comparecencias, respuestas a preguntas parlamentarias, proyectos de ley, etc.).</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import { TipiHeader } from 'tipi-uikit';

export default {
  name: 'about',
  components: {
    TipiHeader,
  },
}
</script>

<style scoped lang="scss">
</style>

