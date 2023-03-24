<template>
<router-link :to="{name: 'initiative', params: { id: getId() }}" class="c-congress-link u-uppercase u-border-link" :title="getName()"><tipi-icon class="u-filling-primary" icon="conversation" />{{ getName() }}</router-link>
</template>

<script>
import { TipiIcon } from 'tipi-uikit';

export default {
  name: 'ConversationLink',
  components: {
    TipiIcon,
  },
  props: {
    id: {
      type: String,
      required: true
    },
    isAnswer: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    getId: function() {
     if (this.isAnswer) return this.id.replace('-respuesta', '')
       return this.id + "-respuesta"
     },
     getName: function() {
       if (this.isAnswer) return "Ver pregunta"
         return "Ver respuesta"
     }
  }
}
</script>

<style>
.c-congress-link {
  margin-right: 1rem;
}
</style>
