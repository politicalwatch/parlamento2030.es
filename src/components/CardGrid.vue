<template>
  <div class="o-grid c-card_grid">
    <div :class="classes" v-for="item in this.items" v-bind:key="item.id">
      <deputy-card
        :deputy="item"
        :layout="layout"
        :footprint="getDeputyExtra()"
      />
    </div>
  </div>
</template>

<script>
import DeputyCard from '@/components/DeputyCard.vue';

export default {
  name: 'CardGrid',
  components: {
    DeputyCard,
  },
  props: {
    items: Array,
    type: String,
    layout: String,
    extra: Object,
  },
  methods: {
    getDeputyExtra: function () {
      if (this.extra === undefined) return 'General';
      if ('footprint' in this.extra) {
        return this.extra['footprint'];
      }
      return 'General';
    },
  },
  computed: {
    classes: function () {
      return (
        'o-grid__col u-12 u-4@sm c-card_grid__item c-card_grid__item__' +
        this.type +
        ' c-card_grid__' +
        this.layout
      );
    },
  },
};
</script>

<style scoped lang="scss">
.c-card_grid {
  &__item {
    margin-bottom: 32px;

    &__parliamentarygroup {
      &.c-card_grid__medium {
        height: 350px;
        min-width: 350px;
        padding-bottom: 0px;
        position: relative;

        @media (min-width: $sm) {
          height: 0;
          padding-bottom: 33.33333%;
          float: left;
          overflow: hidden;
        }
      }

      &.c-card_grid__small {
        position: relative;
        height: 64px;

        @media (min-width: $sm) {
          overflow: hidden;
        }
      }
    }

    &__deputy {
      &.c-card_grid__large {
        margin-bottom: 6rem;
      }
    }
  }
}
</style>
