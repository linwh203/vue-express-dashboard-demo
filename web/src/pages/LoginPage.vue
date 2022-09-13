<template>
  <div>
    login
  </div>
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
