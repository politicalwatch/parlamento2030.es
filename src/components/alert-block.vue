<template>
  <div id="alert-block" class="o-container o-section u-margin-top-2 u-margin-bottom-4">
    <div class="o-grid o-grid--center">
      <div class="o-grid__col u-12 u-8@sm u-12@xs u-text-center@sm">
        <p class="u-text-overline">Del Congreso a tu correo electrónico</p>
        <p class="u-text-th3">{{ text }}</p>
        <save-alert :searchparams="searchparams" />
      </div>
    </div>
  </div>
</template>

<script>
import SaveAlert from '@/components/save-alert';

export default {
  name: "alert-block",
  props: [
    'text',
    'searchparams'
  ],
  components: {
    SaveAlert,
  }
}

</script>

<style scoped lang="scss">
</style>
