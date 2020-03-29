<template>
    <div class="legend">
      <div v-for="(d, i) in result.topics" :key="i" class="legend__item">
        <div
          class="legend__img"
          :style="{
            'background-color': styles.topics[d].color,
            'background-image': `url(/img/topics/${styles.topics[d].image})`,
          }"></div>
        <span class="legend__text">{{d}}</span>
      </div>
    </div>
</template>

<script>
export default {
  name: 'scanner-legend',
  props: {
    result: {
      type: Object || null,
      required: true,
    },
    styles: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
};
</script>

<style lang="scss">
.legend {
  &__item {
    display: inline-block;
    margin-right: 10px;
  }
  &__img {
    margin: 2px;
    width: 18px;
    height: 18px;
    display: inline-block;
    vertical-align: top;
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: center;
  }
  &__text {
    vertical-align: top;
  }
}
</style>
