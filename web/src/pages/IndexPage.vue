<template>
  <q-page class="flex flex-center">
    <img
      alt="Quasar logo"
      src="~assets/quasar-logo-vertical.svg"
      style="width: 200px; height: 200px"
    >
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onMounted } from 'vue';

onMounted(() => {
  api.get('/getGolenChamData').then(res => {
    console.log(res.data);
  })
  api.get('/getGolenCham').then(res => {
    console.log(res.data);
  })
})
</script>
