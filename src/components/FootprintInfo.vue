<template>
  <div style="margin-top: 60px">
    <router-link
      :to="{ name: 'footprint' }"
      target="_blank"
      style="text-decoration: none !important"
    >
      Consulta aquí cómo funciona el algoritmo de huella parlamentaria
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'FootprintInfo',
};
</script>
