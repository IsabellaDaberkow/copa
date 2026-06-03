<template>
  <div>

    <StickerCard
      v-for="figurinha in figurinhas"
      :key="figurinha.id"
      :nome="figurinha.nome"
      :selecao="figurinha.selecao"
      :foto="figurinha.foto"
      :coletada="figurinha.coletada"
    />

  </div>
</template>

<script setup lang="ts">
import StickerCard from './StickerCard.vue'

type Figurinha = {
  id: number
  nome: string
  selecao: string
  foto: string
  coletada: boolean
}

defineProps<{
  figurinhas: Figurinha[]
}>()
</script>