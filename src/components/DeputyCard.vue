<template>
  <div :class="'c-deputy-card ' + layout + '-layout'">
    <div class="c-deputy-card__wrapper">
      <router-link
        :to="{ name: 'deputy', params: { id: deputy.id } }"
        style="position: relative"
      >
        <img
          :src="deputy.image"
          :title="deputy.name"
          :class="
            'c-deputy-card__wrapper__image c-deputy-card__wrapper__image-' +
            layout
          "
        />
        <party-logo-icon
          :party="deputy.party_name"
          v-if="layout == 'large'"
          style="position: absolute; bottom: 0; left: 6rem"
        />
      </router-link>

      <div v-if="layout != 'small'" class="c-deputy-card__wrapper__info">
        <footprint
          v-if="layout == 'large'"
          :footprint="getFootprint()"
          :small="true"
        />
        <router-link :to="{ name: 'deputy', params: { id: deputy.id } }">
          <h4 v-html="getSeparatedName()"></h4>
        </router-link>
        <p>{{ deputy.parliamentarygroup }}</p>
        <h5 v-if="layout == 'large'">
          <tipi-icon icon="location" />{{ deputy.constituency }}
        </h5>
      </div>
    </div>
  </div>
</template>

<script>
import { TipiIcon, PartyLogoIcon } from '@politicalwatch/tipi-uikit';
import Footprint from '@/components/Footprint.vue';
import { useParliamentStore } from '@/stores/parliament';

export default {
  name: 'DeputyCard',
  components: {
    Footprint,
    PartyLogoIcon,
    TipiIcon,
  },
  props: {
    deputy: {
      type: Object,
      required: true,
    },
    layout: {
      type: String,
      default: 'medium', // small, medium, large
    },
    footprint: String,
  },
  setup() {
    const store = useParliamentStore();
    return { store };
  },
  methods: {
    getSeparatedName: function () {
      return this.deputy.name.split(',').join(',<br/>');
    },
    getFootprint: function () {
      if (this.footprint != 'General') {
        const filtered_footprint = this.deputy.footprint_by_topics.filter(
          (item) => item.name == this.footprint
        );
        // console.log(filtered_footprint);
        return filtered_footprint[0]?.score ?? 0;
      }
      return this.deputy.footprint;
    },
  },
};
</script>

<style scoped lang="scss">
.c-deputy-card {
  @include tbody2;

  &__wrapper {
    display: flex;
    align-items: center;

    &__image-block {
      display: block;
      position: absolute;
    }

    &__image {
      border-radius: 50%;
      object-fit: cover;
      vertical-align: middle;
    }

    &__image-small {
      width: rem($spacer-unit * 2);
      height: rem($spacer-unit * 2);
      margin-right: rem(calc($spacer-unit / 2));
      border: 2px solid $secondary-dark;
    }

    &__image-medium {
      width: rem($spacer-unit * 4);
      height: rem($spacer-unit * 4);
      margin-right: rem($spacer-unit);
      border: 2px solid $secondary-dark;
    }

    &__image-large {
      width: rem(160px);
      height: rem(160px);
      margin-right: rem($spacer-unit * 6);
      border: 4px solid $secondary-dark;
    }

    &__info {
      text-transform: uppercase;

      h4,
      p,
      h5 {
        font-size: 0.875rem;
        line-height: 1.2;
        margin-top: 0px;
        margin-bottom: rem(calc($spacer-unit));
      }

      h5 {
        font-size: 0.65rem;
        display: flex;
        gap: 4px;

        .c-icon {
          display: inline-block;
          width: 12px;
          height: 12px;
        }
      }
    }
  }

  &__medium-layout {
    display: flex;
    align-items: center;

    &__image {
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid $primary;
      object-fit: cover;
      vertical-align: middle;
    }
    &__name {
      font-family: $font-primary;
      font-size: 1rem;
      text-align: left;
      text-transform: uppercase;

      span {
        @include tbody2;
      }
    }
  }

  &__large-layout {
    display: flex;
    align-items: center;

    &__image {
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid $primary;
      object-fit: cover;
      vertical-align: middle;
    }
    &__name {
      font-family: $font-primary;
      font-size: 1rem;
      text-align: left;
      text-transform: uppercase;

      span {
        @include tbody2;
      }

      h5 {
        svg {
          width: 10px;
          height: auto;
          margin-right: 4px;
        }
      }
    }
  }

  a {
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
}

.c-deputy-card.small-layout {
  display: inline-block;
}
.c-deputy-card.medium-layout {
  margin-bottom: rem($spacer-unit);
}
</style>
