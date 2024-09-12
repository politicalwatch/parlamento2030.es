<template>
  <a
    class="c-button c-button--compact c-button--primary c-button--icon-right"
    href="#"
    @click.prevent="saveAlert"
  >
    Crea una alerta <Icon class="c-icon--white" icon="mdi:bell" />
  </a>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import Swal from 'sweetalert2';
import api from '@/api';
import { Icon } from '@iconify/vue';

const props = defineProps({
  searchParams: {
    type: Object,
  },
});

const { searchParams } = toRefs(props);

const errors = ref(null);

const saveAlert = async () => {
  let search_params = Object.assign({}, searchParams.value);
  if (search_params.hasOwnProperty('page')) delete search_params.page;

  // ensure some params are array
  if (search_params.hasOwnProperty('subtopic'))
    search_params.subtopics =
      search_params.subtopics.constructor !== Array
        ? [search_params.subtopics]
        : search_params.subtopics;
  if (search_params.hasOwnProperty('tags'))
    search_params.tags =
      search_params.tags.constructor !== Array
        ? [search_params.tags]
        : search_params.tags;

  const { value: email } = await Swal.fire({
    title: 'Crea una alerta personalizada',
    text: 'Te enviaremos un correo electrónico cada vez que haya alguna novedad en el Congreso de los Diputados relacionada con los criterios seleccionados',
    input: 'email',
    inputPlaceholder: 'nombre@dominio.com',
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return 'Debes introducir un correo electrónico';
      }
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        return 'Debes introducir un correo electrónico válido.';
      }
    },
    imageUrl: '/img/email-alert-icon.svg',
    imageWidth: 64,
    imageHeight: 56,
    imageAlt: 'Imagen de correo electrónico',
    animation: false,
    focusConfirm: false,
    confirmButtonText: 'Crear',
    confirmButtonAriaLabel: 'Crear',
  });
  if (email) {
    let params = {
      email: email,
      search: JSON.stringify(search_params),
    };
    api
      .saveAlert(params)
      .then(() => {
        Swal.fire({
          title: 'Alerta creada',
          text: 'Recibirá en breve un correo de confirmación',
          focusConfirm: false,
          icon: 'success',
        });
      })
      .catch((error) => {
        errors.value = error.response;
        const limited = error.response.status === 429;
        Swal.fire({
          title: limited
            ? 'Limite excedido por hora'
            : 'Error al crear la alerta',
          text: 'Inténtalo de nuevo más tarde',
          focusConfirm: false,
          icon: 'error',
        });
      });
  } else {
    console.log('No email provided, alert not saved.');
  }
};
</script>

<style scoped lang="scss"></style>
