<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>⚽ Álbum da Copa</h1>

      <ion-searchbar
  v-model="pesquisa"
  placeholder="Pesquisar jogador">
</ion-searchbar>

<ion-segment v-model="filtro">

  <ion-segment-button value="todos">
    <ion-label>Todas</ion-label>
  </ion-segment-button>

  <ion-segment-button value="coletadas">
    <ion-label>Coletadas</ion-label>
  </ion-segment-button>

  <ion-segment-button value="pendentes">
    <ion-label>Pendentes</ion-label>
  </ion-segment-button>

</ion-segment>

      <ion-card>
  <ion-card-content>
    Total de figurinhas: {{ figurinhas.length }}
  </ion-card-content>
</ion-card>

<ion-card>
  <ion-card-content>
    Figurinhas coletadas:
    {{ figurinhas.filter(f => f.coletada).length }}
  </ion-card-content>
</ion-card>

<ion-card
  v-for="figurinha in figurinhasFiltradas"
  :key="figurinha.id"
>

  <ion-img
    :src="figurinha.foto"
    class="foto-jogador"
  />

  <ion-card-header>
    {{ figurinha.nome }}
  </ion-card-header>

  <ion-card-content>

  <p>
    <strong>Seleção:</strong>
    {{ figurinha.selecao }}
  </p>

  <p>
    Raridade:
    <ion-badge
      :color="
        figurinha.raridade === 'Brilhante'
          ? 'warning'
          : figurinha.raridade === 'Rara'
          ? 'primary'
          : 'medium'
      "
    >
      {{ figurinha.raridade }}
    </ion-badge>
  </p>

  <br>

  <ion-button
    expand="block"
    @click="marcarColetada(figurinha.id)"
  >
    {{ figurinha.coletada ? 'Coletada' : 'Pendente' }}
  </ion-button>

</ion-card-content>

</ion-card>

      <p>Total: {{ figurinhas.length }}</p>

      

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonImg,
  IonBadge
} from '@ionic/vue'

import { ref, computed } from 'vue'

import { useAlbum } from '../composables/useAlbum'
const { figurinhas, marcarColetada } = useAlbum()

const pesquisa = ref('')
const filtro = ref('todos')

const figurinhasFiltradas = computed(() => {

  return figurinhas.value.filter(figurinha => {

    const correspondePesquisa =
      figurinha.nome.toLowerCase().includes(
        pesquisa.value.toLowerCase()
      ) ||
      figurinha.selecao.toLowerCase().includes(
        pesquisa.value.toLowerCase()
      )

    if (filtro.value === 'coletadas') {
      return correspondePesquisa && figurinha.coletada
    }

    if (filtro.value === 'pendentes') {
      return correspondePesquisa && !figurinha.coletada
    }

    return correspondePesquisa

  })

})
</script>

<style scoped>
ion-img{
  height: 500px;
  object-fit: fill;
}

ion-card{
  border-radius: 12px;
}
</style>