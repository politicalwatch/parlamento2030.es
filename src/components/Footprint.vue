<template>
  <div class="c-footprint" :class="{ 'c-footprint--small': isSmall() }">
    <span class="c-footprint__wrapper">
      <Icon icon="mdi:bar-chart" :height="16" /><span>{{ footprint }}</span>
    </span>
  </div>
</template>

<script setup>
import { Icon } from '@iconify/vue';

const { footprint, small } = defineProps({
  footprint: [Number, String],
  small: Boolean,
});

const isSmall = () => {
  return small ? true : false;
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
    display: inline-flex;
    align-items: center;
    gap: 4px;
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
