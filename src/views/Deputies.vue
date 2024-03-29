<template>
  <div id="deputies" class="o-container o-section u-margin-bottom-10">
    <tipi-header title="Listado de diputados" />
    <deputies-form
      :deputies="deputies"
      :groups="getGroupsLongNames()"
      @setFilters="setFilters"
      :ranking="getRanking()"
    ></deputies-form>
    <tipi-loader
      v-if="!this.hasLoadedDeputies"
      title="Cargando diputados"
      subtitle="Puede llevar algun tiempo"
    />
    <CardGrid
      v-bind:key="this.filters['footprint']"
      :items="getFilteredDeputies()"
      type="deputy"
      layout="large"
      :extra="{ footprint: getSelectedFootprint() }"
    />
    <not-found
      v-if="this.hasLoadedDeputies && getFilteredDeputies().length == 0"
      message="No se han encontrado diputados."
    />
  </div>
</template>

<script>
import { TipiHeader, TipiLoader } from '@politicalwatch/tipi-uikit';
import DeputiesForm from '@/components/DeputiesForm.vue';
import DeputyCard from '@/components/DeputyCard.vue';
import CardGrid from '@/components/CardGrid.vue';
import NotFound from '@/components/NotFound.vue';
import api from '@/api';
import { useParliamentStore } from '@/stores/parliament';

export default {
  name: 'deputies',
  components: {
    DeputiesForm,
    TipiHeader,
    DeputyCard,
    CardGrid,
    NotFound,
    TipiLoader,
  },
  setup() {
    const store = useParliamentStore();
    return { store };
  },
  data: function () {
    return {
      deputies: [],
      filters: {},
      hasLoadedDeputies: false,
    };
  },
  methods: {
    loadDeputies: function () {
      api
        .getDeputies()
        .then((response) => {
          this.deputies = response.filter((d) => d.active);
          this.hasLoadedDeputies = true;
        })
        .catch((error) => console.log(error));
    },
    getGroupsLongNames: function () {
      return this.store.allParliamentaryGroups.map(
        (group) => group.name || group
      );
    },
    getGroupShortName: function (longname) {
      const group = this.store.allParliamentaryGroups
        .filter((group) => group['name'] == longname)
        .pop();
      return group['shortname'].toUpperCase();
    },
    setFilters: function (filters) {
      console.log(filters);
      this.filters = filters;
    },
    getFilteredDeputies: function () {
      let filteredDeputies = this.deputies;

      if (
        'constituency' in this.filters &&
        this.filters['constituency'] != null
      ) {
        filteredDeputies = filteredDeputies.filter(
          (deputy) => deputy['constituency'] == this.filters['constituency']
        );
      }

      if ('group' in this.filters && this.filters['group'] != null) {
        filteredDeputies = filteredDeputies.filter(
          (deputy) =>
            deputy['parliamentarygroup'].toUpperCase() ==
            this.getGroupShortName(this.filters['group'])
        );
      }

      if ('name' in this.filters && this.filters['name'] != null) {
        const regex = new RegExp('.*' + this.filters['name'] + '.*', 'i');
        filteredDeputies = filteredDeputies.filter((deputy) =>
          regex.test(deputy['name'])
        );
      }

      if (
        'footprint' in this.filters &&
        this.filters['footprint'] != undefined
      ) {
        const footprint_sort = this.getSelectedFootprint();

        const updated_list = [...filteredDeputies].sort((a, b) => {
          const a_footprint_filter = a.footprint_by_topics.filter(
            (item) => item.name == footprint_sort
          );
          const a_footprint =
            a_footprint_filter.length > 0 ? a_footprint_filter[0].score : 0;
          const b_footprint_filter = b.footprint_by_topics.filter(
            (item) => item.name == footprint_sort
          );
          const b_footprint =
            b_footprint_filter.length > 0 ? b_footprint_filter[0].score : 0;

          return b_footprint - a_footprint;
        });

        return updated_list;
      }
      return [...filteredDeputies].sort((a, b) => {
        const a_name = this.prepareForSorting(a.name);
        const b_name = this.prepareForSorting(b.name);

        return a_name.localeCompare(b_name);
      });
    },
    getRanking: function () {
      const ranking = [];
      for (const item of this.store.allTopics) {
        ranking.push(item.name);
      }

      return ranking;
    },
    getSelectedFootprint: function () {
      const footprint_sort = this.filters['footprint'];
      if (footprint_sort == undefined) {
        return 'General';
      }
      return footprint_sort;
    },
    prepareForSorting: function (name) {
      const clean_name = name
        .toUpperCase()
        .replace('Á', 'A')
        .replace('É', 'E')
        .replace('Í', 'I')
        .replace('Ó', 'O')
        .replace('Ú', 'U')
        .replace('Ñ', 'NZ');

      return clean_name;
    },
  },
  beforeMount() {
    this.loadDeputies();
  },
};
</script>
