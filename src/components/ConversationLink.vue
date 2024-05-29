<template>
  <RouterLink
    :to="{ name: 'initiative', params: { id: getId() } }"
    class="c-congress-link u-uppercase u-border-link"
    :title="getName()"
  >
    <TipiIcon class="u-filling-primary" icon="conversation" />
    {{ getName() }}
  </RouterLink>
</template>

<script setup>
import { TipiIcon } from '@politicalwatch/tipi-uikit';

const { id, isAnswer } = defineProps({
  id: {
    type: String,
    required: true,
  },
  isAnswer: {
    type: Boolean,
    required: true,
  },
});

const getId = () => {
  return isAnswer ? id.replace('-respuesta', '') : id + '-respuesta';
};

const getName = () => {
  return isAnswer ? 'Ver pregunta' : 'Ver respuesta';
};
</script>

<style>
.c-congress-link {
  margin-right: 1rem;
}
</style>
