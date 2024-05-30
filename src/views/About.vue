<template>
  <div>
    <div id="about" class="o-container o-section u-margin-bottom-10">
      <tipi-header title="Acerca" />
      <div class="o-grid">
        <div class="o-grid__col u-8@sm u-offset-2@sm">
          <router-link
            class="c-button c-button--compact u-padding-left-0"
            :to="{ name: 'about-en' }"
            >Read this page in English</router-link
          >
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/JFLG62Hfu1Y"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
          <p>
            Parlamento 2030 es una innovadora herramienta que rastrea, reúne y
            ofrece la información sobre la actividad del Congreso de los
            Diputados español relacionada con los Objetivos de Desarrollo
            Sostenible (ODS). Diseñada para superar los retos que plantea la
            naturaleza transversal de la Agenda 2030, Parlamento 2030 clasifica
            la información relacionada con los ODS gracias a un avanzado sistema
            automático de etiquetado masivo. Esta innovadora tecnología permite
            a los usuarios navegar por la actividad parlamentaria relacionada
            con los ODS a través de un buscador online, abierto y gratuito. La
            información ofrecida es esencial de cara a la monitorización y la
            rendición de cuentas de la implementación de la Agenda 2030 a nivel
            nacional.
          </p>
          <p>
            Desde agosto de 2019, Parlamento 2030 cuenta con el apoyo técnico y
            financiero del Ministerio de Asuntos Exteriores, Unión Europea y
            Cooperación del Gobierno de España, a través de un convenio de
            colaboración entre Political Watch y la Secretaría de Estado de
            Cooperación Internacional. Parlamento 2030 fue incluída en el Plan
            de Acción para la Implementación de la Agenda 2030, presentado por
            el Gobierno de España ante Naciones Unidas en 2018.
          </p>
          <h4>¿Cómo funciona?</h4>
          <p>
            Parlamento 2030 reúne toda la información publicada por el Congreso
            de los Diputados y crea una base de datos a través de un proceso
            automático de etiquetado masivo que la clasifica de acuerdo a su
            relación con cualquier ODS o meta. Combina ciencia informática
            avanzada - necesaria para escrapear miles de PDFs en los que se
            publica la información parlamentaria y transformarlos en una base de
            datos estructurada - con el diseño de unos diccionarios de ODS que
            automáticamente relacionan iniciativas políticas con objetivos y las
            metas. Después, a través de un buscador intuitivo, atractivo y
            accesible, ofrece toda la información relevante en formatos
            reutilizables. Los usuarios pueden seleccionar sus propios términos
            en el buscador para adaptar las búsquedas a sus necesidades.
          </p>
          <h4>¿Qué respuestas ofrece?</h4>
          <p>
            Parlamento 2030 ayuda a encontrar las respuestas menos obvias a
            complicadas preguntas a primera vista: ¿Qué ODS se ven afectados por
            determinadas iniciativas parlamentarias? ¿Cuáles objetivos o metas
            reciben una mayor atención de los diputados y cuáles son los grandes
            olvidados? ¿Quiénes son los diputados más activos en la
            implementación de la Agenda 2030 y quiénes no están aportando nada?
            Además, ofrece un método de gran eficiencia para analizar la
            actividad política al permitir detectar toda la actividad
            parlamentaria relacionada con un determinado ODS o meta propuesta y
            debatida al mismo tiempo en diferentes comisiones del Congreso.
          </p>
          <h4>¿Por qué el Congreso de los Diputados?</h4>
          <p>
            Los parlamentos nacionales tienen una posición clave en el proceso
            de implementación de la Agenda 2030. Son la institución pública más
            relevante y mejor posicionada para asegurar la coherencia con el
            desarrollo sostenible en los cientos de miles de leyes, iniciativas
            legislativas, planes públicos y presupuestos que se aprobarán en
            cada país en los próximos años.
          </p>
          <h4>¿Puede adaptarse a otros países?</h4>
          <p>
            Sí, la herramienta ha sido diseñada para que su adaptación sea
            posible. La tecnología utilizada en Parlamento 2030 está construida
            utilizando software libre y código abierto, lo cual permite que su
            adaptación a otros países o a otros niveles de la administración
            pública sea posible de manera rápida y respondiendo a las
            necesidades propias de cada contexto.
          </p>
          <h4>¿Quiénes somos?</h4>
          <p>
            Parlamento 2030 es un proyecto de
            <a href="http://politicalwatch.es" target="_blank"
              >Political Watch</a
            >, un think and do tank español. Nuestra misión es generar, allí
            donde trabajamos, unas condiciones favorables para el diseño,
            adopción e implementación de políticas públicas que promuevan una
            sociedad más justa, equitativa y sostenible. Desarrollamos
            tecnologías innovadoras que automáticamente rastrean la actividad
            relacionada con el desarrollo sostenible y que ofrecen acceso a esta
            información de forma pública, directa y gratuita.
          </p>
          <h4>¿De dónde venimos?</h4>
          <p>
            Parlamento 2030 es una adaptación de
            <a
              href="https://www.qhld.es?utm_source=Parlamento2030&utm_medium=direct&utm_campaign=engagement"
              target="_blank"
              >Que Hacen Los Diputados</a
            >, una herramienta digital implementada en España desde 2015, que
            monitoriza toda la actividad parlamentaria de 22 temáticas
            relacionadas con la lucha contra la pobreza y la desigualdad. QHLD
            es otro innovador proyecto de Political Watch que genera datos
            abiertos y fomenta la transparencia, el acceso a información y la
            rendición de cuentas política a través de la monitorización
            parlamentaria de más de 20 temáticas estratégicamente seleccionadas,
            a través del mismo avanzado sistema de escrapeo y etiquetado
            utilizado en Parlamento 2030.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TipiHeader } from '@politicalwatch/tipi-uikit';
</script>

<style scoped lang="scss"></style>
