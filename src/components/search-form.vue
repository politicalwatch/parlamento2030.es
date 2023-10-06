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
            v-model="form.topic"
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
          :class="{ 'c-select-label--disabled': !form.topic }"
        >
          <label for="subtopics">Metas</label>
          <multiselect
            selectedLabel="Seleccionada"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            @select="addSubtopicToTagsFilter"
            @remove="removeSubtopicToTagsFilter"
            v-model="form.subtopics"
            :multiple="true"
            :options="subtopics"
            :allow-empty="true"
            :disabled="!form.topic"
            :placeholder="
              form.topic ? 'Todos' : 'Selecciona previamente un ODS'
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
          :class="{ 'c-select-label--disabled': !form.topic }"
        >
          <label for="tags">Etiquetas</label>
          <multiselect
            selectedLabel="Seleccionada"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="form.tags"
            :multiple="true"
            :options="filteredTags"
            :allow-empty="true"
            :disabled="!form.topic"
            :placeholder="
              form.topic ? 'Todos' : 'Selecciona previamente un ODS'
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
            v-model="form.author"
            :options="this.store.getAllParliamentaryGroupsWithGoverment.map((group) => group.name || group)"
            :allow-empty="true"
            name="author"
            id="author"
            placeholder="Todos"
          >
          </multiselect>
        </div>
        <router-link
          class="u-text-tbody2"
          v-if="this.store.getParliamentaryGroupByName(form.author)"
          :to="{
            path: `/grupos/${this.store.getParliamentaryGroupByName(form.author).id}`,
          }"
        >
          ¿Quieres ver el perfil del {{ form.author }}?
        </router-link>
      </div>
      <div class="o-grid__col u-12 u-6@sm u-padding-bottom-4">
        <div class="c-select-label u-block">
          <label for="author_deputies">Diputado/a</label>
          <multiselect
            selectedLabel="Seleccionado"
            selectLabel=""
            deselectLabel="Pulsa para deseleccionar"
            v-model="form.deputy"
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
          v-if="this.store.getDeputyByName(form.deputy)"
          :to="{ path: `/diputados/${this.store.getDeputyByName(form.deputy).id}` }"
        >
          ¿Quieres ver el perfil de {{ form.deputy }}?
        </router-link>
      </div>
    </div>
    <!-- /.o-grid -->
    <div class="o-grid" v-show="advanced">
      <div class="o-grid__col u-12 u-4@sm u-padding-bottom-4">
        <div class="c-datepicker-label u-block">
          <label for="startdate">Desde</label>
          <VueDatePicker
            v-model="form.startdate"
            locale="es"
            :format="formatDatepickerDate"
            placeholder="dd-mm-yyyy"
            hide-input-icon
            @cleared="clearStartDate"
            name="startdate"
          />
        </div>
      </div>
      <div class="o-grid__col u-12 u-4@sm u-padding-bottom-4">
        <div class="c-datepicker-label u-block">
          <label for="enddate">Hasta</label>
          <VueDatePicker
            v-model="form.enddate"
            locale="es"
            :format="formatDatepickerDate"
            placeholder="dd-mm-yyyy"
            :max-date="new Date()"
            hide-input-icon
            @cleared="clearEndDate"
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
            v-model="form.status"
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
            v-model="form.place"
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
            v-model="form.type"
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
            v-model="form.reference"
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
            v-model="form.text"
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
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";
import Multiselect from 'vue-multiselect';
import { TipiIcon, Utils } from '@politicalwatch/tipi-uikit';
import api from '@/api';
import { useParliamentStore } from "@/stores/parliament";

import format from 'date-fns/format';

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
    return { store };
  },
  data: function () {
    return {
      subtopics: [],
      tags: [],
      form: {},
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
      this.form.topic = '';
      this.form.subtopics = [];
      this.form.tags = [];
      this.form.author = '';
      this.form.deputy = '';
      this.form.status = '';
      this.form.place = '';
      this.form.type = '';
      this.form.reference = '';
      this.form.enddate = '';
      this.form.startdate = '';
      this.form.text = '';
      // //clear url
      this.$router.push({ name: 'search' });
    },
    getTypes: function () {
      const options = [];
      for (const type of this.store.getAllTypesName) {
        options.push("'" + type + "'");
      }
      return options;
    },
    getDeputies: function () {
      const { author } = this.form;
      if (author == 'Gobierno') {
        return [];
      }

      if (author) {
        const parliamentaryGroup = this.store.getParliamentaryGroupByName(author);
        const deputies = this.store.getDeputiesByParliamentaryGroup(
          parliamentaryGroup.shortname
        );
        return deputies.map((deputy) => deputy.name);
      }

      return this.store.getAllDeputiesName;
    },
    fillSubtopicsAndTags: function (selectedTopic, clearValues) {
      if (clearValues) {
        this.form.subtopics = [];
        this.form.tags = [];
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
      this.form.subtopics = [];
      this.form.tags = [];
    },
    clearStartDate: function () {
      this.form.startdate = '';
    },
    clearEndDate: function () {
      this.form.enddate = '';
    },
    formatDatepickerDate: function (date) {
      return format(new Date(date), "dd-MM-yyyy");
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
      this.form.tags = [];
      this.selectedSubtopics.push(selectedSubtopic);
      this.filterTags();
    },
    removeSubtopicToTagsFilter: function (removedSubtopic) {
      this.form.tags = [];
      this.selectedSubtopics.splice(
        this.selectedSubtopics.indexOf(removedSubtopic),
        1
      );
      this.filterTags();
    },
    getResults: function (event) {
      this.form.enddate = this.form.enddate
        ? format(new Date(this.form.enddate), 'yyyy-MM-dd')
        : undefined;

      this.form.startdate = this.form.startdate
        ? format(new Date(this.form.startdate), 'yyyy-MM-dd')
        : undefined;
      this.$emit('getResults', event, this.form);
    },
    prepareForm: function () {
      if (this.form.topic) {
        this.fillSubtopicsAndTags(this.form.topic, false);
      }
    },
    toggleAdvanced: function () {
      this.advanced = !this.advanced;
    },
  },
  created: function () {
    this.form = Object.assign({}, this.formData);
    if (this.store.allTopics.length) {
      this.prepareForm();
    }
  },
};
</script>
