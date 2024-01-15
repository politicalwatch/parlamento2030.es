<template>
  <div class="c-footprint" :class="{ 'c-footprint--small': isSmall() }">
    <span class="c-footprint__wrapper">
      <tipi-icon icon="footprint" /><span>{{ footprint }}</span>
    </span>
  </div>
</template>

<script>
import { TipiIcon } from '@politicalwatch/tipi-uikit';

export default {
  name: 'Footprint',
  components: {
    TipiIcon,
  },
  props: {
    footprint: [Number, String],
    small: Boolean,
  },
  methods: {
    isSmall: function () {
      if (this.small) {
        return this.small;
      }
      return false;
    },
  },
};
</script>

<style scoped lang="scss">
.c-footprint {
  margin-bottom: 8px;

  &--small {
    .c-footprint {
      &__wrapper {
        font-size: 12px;
        padding: 4px;

        .c-icon {
          display: inline-block;
          padding-right: 4px;

          svg {
            width: 12px;
            height: 12px;
          }
        }
      }
    }
  }

  &__wrapper {
    background-color: #efca53;
    color: $secondary-dark;
    padding: 8px;
    font-family: $font-primary;
    font-weight: 500;
  }

  .c-icon {
    padding-right: 8px;
    display: inline-block;
    width: 22px;
    svg {
      fill: $secondary-dark;
      width: auto;
    }
  }
}
</style>
