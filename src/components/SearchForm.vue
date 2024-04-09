<template>
  <form
    id="search-form"
    class="u-margin-bottom-4 u-border-bottom"
    role="form"
    @submit.prevent="getResults($event)"
  >
    <div class="o-grid">
      <div class="o-grid__col u-12 u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="topic">ODS</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            @select="fillSubtopicsAndTags"
            @remove="clearSubtopicsAndTags"
            v-model="formData.topic"
            :options="this.store.allTopics.map((topic) => topic.name)"
            :allow-empty="true"
            name="topic"
            id="topic"
            placeholder="Todos"
          >
          </multiselect>
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div
          class="c-select-label u-block"
          :class="{ 'c-select-label--disabled': !formData.topic }"
        >
          <label for="subtopics">Metas</label>
          <multiselect
            selectedLabel="Seleccionada"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            @select="addSubtopicToTagsFilter"
            @remove="removeSubtopicToTagsFilter"
            v-model="formData.subtopics"
            :multiple="true"
            :options="subtopics"
            :allow-empty="true"
            :disabled="!formData.topic"
            :placeholder="
              formData.topic ? 'Todos' : 'Selecciona previamente un ODS'
            "
            name="subtopics"
            id="subtopics"
          >
          </multiselect>
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div
          class="c-select-label u-block"
          :class="{ 'c-select-label--disabled': !formData.topic }"
        >
          <label for="tags">Etiquetas</label>
          <multiselect
            selectedLabel="Seleccionada"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="formData.tags"
            :multiple="true"
            :options="filteredTags"
            :allow-empty="true"
            :disabled="!formData.topic"
            :placeholder="
              formData.topic ? 'Todos' : 'Selecciona previamente un ODS'
            "
            name="tags"
            id="tags"
          >
          </multiselect>
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="author">Autor</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="formData.author"
            :options="
              this.store.getAllParliamentaryGroupsWithGoverment.map(
                (group) => group.name || group
              )
            "
            :allow-empty="true"
            name="author"
            id="author"
            placeholder="Todos"
          >
          </multiselect>
        </div>
        <router-link
          class="u-text-tbody2"
          v-if="this.store.getParliamentaryGroupByName(formData.author)"
          :to="{
            path: `/grupos/${
              this.store.getParliamentaryGroupByName(formData.author).id
            }`,
          }"
        >
          ¿Quieres ver el perfil del {{ formData.author }}?
        </router-link>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="author_deputies">Diputado/a</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            :maxHeight="300"
            v-model="formData.deputy"
            :options="getDeputies()"
            :allow-empty="true"
            name="deputy"
            id="deputy"
            placeholder="Apellidos, Nombre"
          >
          </multiselect>
        </div>
        <router-link
          class="u-text-tbody2"
          v-if="this.store.getDeputyByName(formData.deputy)"
          :to="{
            path: `/diputados/${this.store.getDeputyByName(formData.deputy).id}`,
          }"
        >
          ¿Quieres ver el perfil de {{ formData.deputy }}?
        </router-link>
      </div>
    </div>
    <!-- /.o-grid -->
    <div class="o-grid" v-show="advanced">
      <div class="o-grid__col u-12 u-4@sm u-padding-bottom-4">
        <div class="c-datepicker-label u-block">
          <label for="startdate">Desde</label>
          <VueDatePicker
            v-model="formData.startdate"
            locale="es"
            :format="formatDatepickerDate"
            placeholder="dd/mm/yyyy"
            hide-input-icon
            @cleared="clearStartDate"
            :text-input="textInputOptions"
            name="startdate"
          />
        </div>
      </div>
      <div class="o-grid__col u-12 u-4@sm u-padding-bottom-4">
        <div class="c-datepicker-label u-block">
          <label for="enddate">Hasta</label>
          <VueDatePicker
            v-model="formData.enddate"
            locale="es"
            :format="formatDatepickerDate"
            placeholder="dd/mm/yyyy"
            :max-date="new Date()"
            hide-input-icon
            @cleared="clearEndDate"
            :text-input="textInputOptions"
            name="enddate"
          />
        </div>
      </div>
      <div class="o-grid__col u-12 u-4@sm u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="status">Estado</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="formData.status"
            :options="this.store.allStatus"
            :allow-empty="true"
            name="status"
            id="status"
            placeholder="Cualquiera"
          >
          </multiselect>
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="place">Lugar</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="formData.place"
            :options="this.store.getAllPlacesName"
            :allow-empty="true"
            name="place"
            id="place"
            placeholder="Cualquiera"
          >
          </multiselect>
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="type">Tipo</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="formData.type"
            :options="getTypes()"
            :allow-empty="true"
            :multiple="true"
            name="type"
            id="type"
            placeholder="Cualquiera"
          >
          </multiselect>
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-input-label u-block">
          <label for="reference">Referencia</label>
          <input
            v-model="formData.reference"
            type="text"
            id="reference"
            name="reference"
            placeholder="Ej.: 121/000001"
          />
        </div>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-input-label u-block">
          <label for="text">Título</label>
          <input
            v-model="formData.text"
            type="text"
            id="text"
            name="text"
            placeholder="Nota: Se admiten expresiones regulares"
          />
        </div>
      </div>
    </div>
    <!-- /.o-grid -->
    <div class="o-grid">
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <a
          href="#"
          class="c-button u-padding-left-0"
          @click.prevent="toggleAdvanced"
        >
          <tipi-icon icon="advanced" />
          <span v-if="!advanced">Mostrar búsqueda avanzada</span>
          <span v-else>Ocultar búsqueda avanzada</span>
        </a>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4 u-text-right@sm">
        <button
          class="c-button u-padding-left-0 u-margin-right-2"
          @click.prevent="cleanForm"
        >
          Limpiar búsqueda
        </button>
        <button class="c-button c-button--primary" type="submit">Buscar</button>
      </div>
    </div>
  </form>
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Multiselect from 'vue-multiselect';
import { TipiIcon, Utils } from '@politicalwatch/tipi-uikit';
import api from '@/api';
import { useParliamentStore } from '@/stores/parliament';

import { format } from 'date-fns/format';

export default {
  name: 'searchForm',
  components: {
    VueDatePicker,
    Multiselect,
    TipiIcon,
  },
  props: {
    formData: Object,
  },
  setup() {
    const store = useParliamentStore();
    const textInputOptions = {
      enterSubmit: true,
      tabSubmit: true,
      selectOnFocus: true,
      format: 'dd/MM/yyyy',
    };
    return { store, textInputOptions };
  },
  data: function () {
    return {
      subtopics: [],
      tags: [],
      errors: null,
      selectedSubtopics: [],
      filteredTags: [],
      advanced:
        this.formData &&
        (this.formData.startdate ||
          this.formData.enddate ||
          this.formData.status ||
          this.formData.place ||
          this.formData.type ||
          this.formData.reference ||
          this.formData.text),
    };
  },
  methods: {
    cleanForm: function () {
      this.formData.topic = '';
      this.formData.subtopics = [];
      this.formData.tags = [];
      this.formData.author = '';
      this.formData.deputy = '';
      this.formData.status = '';
      this.formData.place = '';
      this.formData.type = '';
      this.formData.reference = '';
      this.formData.enddate = '';
      this.formData.startdate = '';
      this.formData.text = '';
      // //clear url
      this.$router.push({ name: 'search' });
    },
    getTypes: function () {
      const options = [];
      for (const type of this.store.getAllTypesName) {
        options.push(type);
      }
      return options;
    },
    getDeputies: function () {
      const { author } = this.formData;
      if (author == 'Gobierno') {
        return [];
      }

      if (author) {
        const parliamentaryGroup =
          this.store.getParliamentaryGroupByName(author);
        const deputies = this.store.getDeputiesByParliamentaryGroup(
          parliamentaryGroup.shortname
        );
        return deputies.map((deputy) => deputy.name);
      }

      return this.store.getAllDeputiesName;
    },
    fillSubtopicsAndTags: function (selectedTopic, clearValues) {
      if (clearValues) {
        this.formData.subtopics = [];
        this.formData.tags = [];
      }
      const currentTopic = this.store.allTopics.find(
        (topic) => topic.name === selectedTopic
      );
      this.getSubtopicsAndTags(currentTopic.id);
    },
    clearSubtopicsAndTags: function () {
      this.subtopics = [];
      this.selectedSubtopics = [];
      this.tags = [];
      this.filteredTags = [];
      this.formData.subtopics = [];
      this.formData.tags = [];
    },
    clearStartDate: function () {
      this.formData.startdate = '';
    },
    clearEndDate: function () {
      this.formData.enddate = '';
    },
    formatDatepickerDate: function (date) {
      return format(new Date(date), 'dd/MM/yyyy');
    },
    getSubtopicsAndTags: function (topicID) {
      api
        .getTags(topicID)
        .then((tags) => {
          this.subtopics = [...new Set(tags.map((tag) => tag.subtopic))].sort(
            Utils.naturalSort
          );
          this.tags = tags;
          this.filteredTags = this.tags
            .map((tag) => tag.tag)
            .sort(Utils.naturalSort);
        })
        .catch((error) => (this.errors = error));
    },
    filterTags: function () {
      let filtered = this.selectedSubtopics.length
        ? (tag) => this.selectedSubtopics.indexOf(tag.subtopic) !== -1
        : () => true;
      this.filteredTags = this.tags
        .filter(filtered)
        .map((tag) => tag.tag)
        .sort(Utils.naturalSort);
    },
    addSubtopicToTagsFilter: function (selectedSubtopic) {
      this.formData.tags = [];
      this.selectedSubtopics.push(selectedSubtopic);
      this.filterTags();
    },
    removeSubtopicToTagsFilter: function (removedSubtopic) {
      this.formData.tags = [];
      this.selectedSubtopics.splice(
        this.selectedSubtopics.indexOf(removedSubtopic),
        1
      );
      this.filterTags();
    },
    getResults: function (event) {
      this.formData.enddate = this.formData.enddate
        ? format(new Date(this.formData.enddate), 'yyyy-MM-dd')
        : undefined;

      this.formData.startdate = this.formData.startdate
        ? format(new Date(this.formData.startdate), 'yyyy-MM-dd')
        : undefined;
      this.$emit('getResults', event, this.formData);
    },
    prepareForm: function () {
      if (this.formData.topic) {
        this.fillSubtopicsAndTags(this.formData.topic, false);
      }
    },
    toggleAdvanced: function () {
      this.advanced = !this.advanced;
    },
  },
  created: function () {
    if (this.store.allTopics.length) {
      this.prepareForm();
    }
  },
};
</script>

<style lang="scss">
.c-select-label .multiselect__content {
  max-height: 300px;
  overflow-y: scroll;
}

.c-select-label::after {
  top: 1rem;
}

.c-select-label
  .multiselect.multiselect--active
  .multiselect__element
  .multiselect__option {
  &:hover,
  &.multiselect__option--highlight {
    color: #fff;
  }
}
</style>
