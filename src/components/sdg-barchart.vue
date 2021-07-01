<template>
  <transition-group tag="div" class="tipichart" name="barfade">
    <div class="tipichart__rowwrapper" v-for="d in rows" :key="d.topic" :style="rowStyle">
      <div class="tipichart__row">

        <div class="tipichart__tooltip" :style="{bottom: `${barHeight}px`}">
          <div class="tipichart__tip">{{ d.topic }} {{ d.percent }}%</div>
        </div>

        <div class="tipichart__bar">
          <div class="tipichart__backbar" :style="d.backbarStyle"></div>
          <div class="tipichart__overbar" :style="d.overbarStyle"></div>
        </div>

        <div class="tipichart__icon" :style="d.iconStyle"></div>

      </div>
    </div>
  </transition-group>
</template>


<script>

export default {
  name: 'TipiBarchart',
  data() {
    return {
      rows: [],
    };
  },
  props: {
    ranking: {
      type: Array,
      required: false,
      default: () => ([]),
    },
    styles: {
      type: Object,
      required: true,
      default: () => ({}),
    },
    barHeight: {
      type: Number,
      required: false,
      default: 24,
    },
    barGap: {
      type: Number,
      required: false,
      default: 12,
    },
    barColor: {
      type: String,
      required: false,
      default: '#fbc239',
    },
    barBackgroundColor: {
      type: String,
      required: false,
      default: '#f4f6f8',
    },
  },
  mounted() {
    this.calculeRows();
  },
  computed: {
    rowStyle() {
      return {
        height: `${this.barHeight}px`,
        marginBottom: `${this.barGap}px`,
      };
    },
  },
  methods: {
    calculeRows() {

      const rows = [];
      const totalTimes = this.ranking
        .reduce((cnt, o) => (cnt + o.initiatives), 0);

      this.ranking.forEach(d => {
        this.rows.push({
          topic: d.topic,
          times: d.initiatives,
          percent: Math.ceil((d.initiatives/totalTimes)*100),
          iconStyle: {
            flex: `0 0 ${this.barHeight}px`,
            backgroundImage: `url(/img/topics/${this.styles[d.topic].image})`,
            backgroundColor: this.styles[d.topic].color,
            backgroundSize: '65%',
          },
          backbarStyle: {
            backgroundColor: this.barBackgroundColor,
          },
          overbarStyle: {
            height: `${(d.initiatives/totalTimes)*100}%`,
            backgroundColor: this.styles[d.topic].color,
          },
        })
      });

    },
  },
};
</script>

<style lang="scss">
.tipichart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 300px;
  &__rowwrapper {
    flex: 1 100%;
  }
  &__row {
    display: flex;
    flex-direction: column;
    &:hover .tipichart__tooltip {
      display: block;
    }
  }
  &__tooltip {
    position: absolute;
    left: 0;
    width: 100%;
    z-index: 99;
    text-align: left;
    display: none;
    pointer-events: none;
  }
  &__tip {
    background: black;
    color: white;
    font-size: small;
    display: inline-block;
    padding: 0 4px;
    line-height: 1.5;
  }
  &__icon {
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 6px;
  }
  &__bar {
    /* flex: 1 1 auto; */
    overflow: hidden;
    /* position: relative; */
  }
  &__backbar {
    height: 100%;
  }
  &__overbar {
    /* position: absolute; */
    z-index: 9;
    top: 0;
    left: 0;
    transition: width 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95) 350ms;
  }
}

/* Animation */
/*.barfade {
  &-enter-active,
  &-leave-active,
  &-move {
    transition: 350ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
    transition-property: opacity, transform;
    .tipichart__overbar {
      width: 0 !important;
    }
  }
  &-enter,
  &-leave-to {
    opacity: 0;
    transform: translateX(50px);
  }
}*/

</style>

