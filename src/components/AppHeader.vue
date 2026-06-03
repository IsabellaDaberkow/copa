<template>
  <div class="header">
    <h2>{{ titulo }}</h2>
  </div>
</template>

<script setup lang="ts">
defineProps({
  titulo: String
})
</script>

<style scoped>
.header{
  text-align:center;
  padding:10px;
}
</style>