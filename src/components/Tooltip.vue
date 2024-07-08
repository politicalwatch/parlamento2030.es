<template>
  <div class="tooltip-box u-text-tbody2">
    <slot />
    <button @mouseover="toggleTooltip" @mouseleave="toggleTooltip">?</button>
    <div class="tooltip" :class="{ active: isTooltipShown }">
      <span class="text">{{ text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const { text } = defineProps({
  text: {
    type: String,
    required: true,
  },
});

const isTooltipShown = ref(false);

const toggleTooltip = () => {
  isTooltipShown.value = !isTooltipShown.value;
};
</script>

<style scoped>
.tooltip-box {
  position: relative;
  display: inline-block;
}

.tooltip.active {
  opacity: 1;
}

.tooltip {
  max-width: 100%;
  bottom: 100%;
  left: 50%;
  margin-left: -50%;
  padding: 10px;
  opacity: 0;
  transition: opacity 1s;
  position: absolute;
  z-index: 1;
  border-radius: 2px;
  text-align: center;
  color: #ffffff;
  background: #2d4252;
}

.text::after {
  content: ' ';
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #2d4252 transparent transparent transparent;
}

button {
  background: #2d4252;
  color: #ffffff;
  border: none;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  font-size: 10px;
  cursor: pointer;
  margin-left: 5px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}
</style>
