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
            :options="store.allTopics.map((topic) => topic.name)"
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
              store.getAllParliamentaryGroupsWithGoverment.map(
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
          v-if="store.getParliamentaryGroupByName(formData.author)"
          :to="{
            path: `/grupos/${
              store.getParliamentaryGroupByName(formData.author).id
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
          v-if="store.getDeputyByName(formData.deputy)"
          :to="{
            path: `/diputados/${store.getDeputyByName(formData.deputy).id}`,
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
            :locale="es"
            :time-config="{ enableTimePicker: false }"
            :formats="{ input: formatDatepickerDate }"
            placeholder="dd/mm/yyyy"
            :max-date="new Date()"
            auto-apply
            @cleared="clearStartDate"
            :text-input="textInputOptions"
            :input-attrs="{ name: 'startdate', hideInputIcon: true }"
          />
        </div>
      </div>
      <div class="o-grid__col u-12 u-4@sm u-padding-bottom-4">
        <div class="c-datepicker-label u-block">
          <label for="enddate">Hasta</label>
          <VueDatePicker
            v-model="formData.enddate"
            :locale="es"
            :formats="{ input: formatDatepickerDate }"
            placeholder="dd/mm/yyyy"
            :max-date="new Date()"
            auto-apply
            @cleared="clearEndDate"
            :text-input="textInputOptions"
            :input-attrs="{ name: 'enddate', hideInputIcon: true }"
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
            :options="store.allStatus"
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
            :options="store.getAllPlacesName"
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
          <Icon icon="mdi:mixer-settings" />
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

<script setup>
import { ref, toRefs, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { VueDatePicker } from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Multiselect from 'vue-multiselect';
import { Icon } from '@iconify/vue';
import { Utils } from '@politicalwatch/tipi-uikit';
import { format } from "date-fns";
import { es } from "date-fns/locale";

import api from '@/api';
import { useParliamentStore } from '@/stores/parliament';

const props = defineProps({
  formData: Object,
});

const { formData } = toRefs(props);

const emit = defineEmits(['getResults', 'clearInitiatives']);

const router = useRouter();
const store = useParliamentStore();

const textInputOptions = {
  enterSubmit: true,
  tabSubmit: true,
  selectOnFocus: true,
  format: 'dd/MM/yyyy',
};

const subtopics = ref([]);
const tags = ref([]);
const errors = ref(null);
const selectedSubtopics = ref([]);
const filteredTags = ref([]);
const advanced = ref(
  formData.value &&
    (formData.value.startdate ||
      formData.value.enddate ||
      formData.value.status ||
      formData.value.place ||
      formData.value.type ||
      formData.value.reference ||
      formData.value.text)
);

const cleanForm = () => {
  formData.value.topic = '';
  formData.value.subtopics = [];
  formData.value.tags = [];
  formData.value.author = '';
  formData.value.deputy = '';
  formData.value.status = '';
  formData.value.place = '';
  formData.value.type = '';
  formData.value.reference = '';
  formData.value.enddate = '';
  formData.value.startdate = '';
  formData.value.text = '';
  clearSubtopicsAndTags();
  // //clear url
  router.push({ name: 'search' });
};

const getTypes = () => {
  const options = [];
  for (const type of store.getAllTypesName) {
    options.push(type);
  }
  return options;
};

const getDeputies = () => {
  const { author } = formData.value;
  if (author == 'Gobierno') {
    return [];
  }

  if (author) {
    const parliamentaryGroup = store.getParliamentaryGroupByName(author);
    const deputies = store.getDeputiesByParliamentaryGroup(
      parliamentaryGroup.shortname
    );
    return deputies.map((deputy) => deputy.name);
  }

  return store.getAllDeputiesName;
};

const fillSubtopicsAndTags = (selectedTopic, clearValues) => {
  if (clearValues) {
    formData.value.subtopics = [];
    formData.value.tags = [];
  }
  const currentTopic = store.allTopics.find(
    (topic) => topic.name === selectedTopic
  );
  getSubtopicsAndTags(currentTopic.id);
};

const clearSubtopicsAndTags = () => {
  subtopics.value = [];
  selectedSubtopics.value = [];
  tags.value = [];
  filteredTags.value = [];
  formData.value.subtopics = [];
  formData.value.tags = [];
};

const clearStartDate = () => {
  formData.value.startdate = '';
};

const clearEndDate = () => {
  formData.value.enddate = '';
};

const formatDatepickerDate = (date) => {
  return format(new Date(date), 'dd/MM/yyyy');
};

const getSubtopicsAndTags = (topicID) => {
  api
    .getTags(topicID)
    .then((tempTags) => {
      subtopics.value = [...new Set(tempTags.map((tag) => tag.subtopic))].sort(
        Utils.naturalSort
      );
      tags.value = tempTags;
      filteredTags.value = tags.value
        .map((tag) => tag.tag)
        .sort(Utils.naturalSort);
    })
    .catch((error) => (errors.value = error));
};

const filterTags = () => {
  let filtered = selectedSubtopics.value.length
    ? (tag) => selectedSubtopics.value.indexOf(tag.subtopic) !== -1
    : () => true;
  filteredTags.value = tags.value
    .filter(filtered)
    .map((tag) => tag.tag)
    .sort(Utils.naturalSort);
};

const addSubtopicToTagsFilter = (selectedSubtopic) => {
  formData.value.tags = [];
  selectedSubtopics.value.push(selectedSubtopic);
  filterTags();
};

const removeSubtopicToTagsFilter = (removedSubtopic) => {
  formData.value.tags = [];
  selectedSubtopics.value.splice(
    selectedSubtopics.value.indexOf(removedSubtopic),
    1
  );
  filterTags();
};

const toggleAdvanced = () => {
  advanced.value = !advanced.value;
};

onMounted(function () {
  nextTick(() => {
    // Populates topic dependant fields on redirection (from topic graphs)
    if (formData.value.topic) {
      fillSubtopicsAndTags(formData.value.topic);
    }
  });
  if (store.allTopics.length) {
    prepareForm();
  }
});

const getResults = (event) => {
  formData.value.enddate = formData.value.enddate
    ? format(new Date(formData.value.enddate), 'yyyy-MM-dd')
    : undefined;

  formData.value.startdate = formData.value.startdate
    ? format(new Date(formData.value.startdate), 'yyyy-MM-dd')
    : undefined;
  emit('getResults', event, formData.value);
};
const prepareForm = () => {
  if (formData.value.topic) {
    fillSubtopicsAndTags(formData.value.topic, false);
  }
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
