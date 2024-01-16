<template>
  <div>
    <ul class="tabs">
      <li
        class="tab"
        v-for="(tab, index) in tabs"
        :key="index"
        @click="selectTab(index)"
        :class="{ active: selectedTab === index }"
      >
        {{ tab.label }}
      </li>
    </ul>
    <section class="tab-content">
      <slot :name="`tab-${selectedTab}`"></slot>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    tabs: {
      type: Array,
      required: true,
    },
    initialTab: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      selectedTab: this.initialTab,
    };
  },
  methods: {
    selectTab(index) {
      this.selectedTab = index;
    },
  },
};
</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin: 0;
  border-bottom: 2px solid #f3f3f3;
}
.tab {
  cursor: pointer;
  padding: 0.5rem 1rem;
  margin: 0;

  &::before {
    display: none;
  }
}

.tab.active,
.tab:hover {
  font-weight: bold;
  background-color: #f3f3f3;
}
.tab-content {
  padding: 2rem 1rem;
}
</style>
