<template>
  <RouterLink
    :to="{ name: 'initiative', params: { id: getId() } }"
    class="c-congress-link u-uppercase u-border-link"
    :title="getName()"
  >
    <Icon class="u-filling-primary" icon="mdi:conversation" :width="18" />
    {{ getName() }}
  </RouterLink>
</template>

<script setup>
import { Icon } from '@iconify/vue';

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
