<template>
  <div id="alert-block" class="o-container o-section u-margin-top-2 u-margin-bottom-4">
    <div class="o-grid">
      <div class="o-grid__col u-12 u-9@sm">
        <p class="u-text-overline">Del Congreso a tu correo electrónico</p>
        <p>
        <span class="u-text-subtitle">{{ text }}</span><br/>
        <span class="u-text-th3">{{ value }}</span>
        </p>
      </div>
      <div class="o-grid__col u-12 u-3@sm">
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
    'value',
    'searchparams'
  ],
  components: {
    SaveAlert,
  }
}

</script>

<style scoped lang="scss">
#alert-block {
  .o-grid__col:last-of-type {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
@media (max-width: 754px) {
  #alert-block {
    .o-grid__col:last-of-type {
      display: flex;
      justify-content: flex-start;
      align-items: left;
      a {
        margin-top: 30px;
      }
    }
  }
}
</style>
