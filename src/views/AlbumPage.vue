<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>⚽ Álbum da Copa</h1>

      <ion-searchbar v-model="pesquisa" placeholder="Pesquisar jogador" />

      <ion-segment v-model="filtroSelecionado">
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
        <ion-card-content>Total de figurinhas: {{ figurinhas.length }}</ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-content>Figurinhas coletadas: {{ figurinhas.filter((f) => f.coletada).length }}</ion-card-content>
      </ion-card>

      <ion-card v-for="figurinha in figurinhas" :key="figurinha.id">
        <ion-img :src="figurinha.foto" class="foto-jogador" />

        <ion-card-header>{{ figurinha.nome }}</ion-card-header>

        <ion-card-content>
          <p><strong>Seleção:</strong> {{ figurinha.selecao }}</p>

          <p>
            Raridade:
            <ion-badge :color="badgeColor(figurinha.raridade)">{{ figurinha.raridade }}</ion-badge>
          </p>

          <br>

          <ion-button expand="block" @click="aoMarcar(figurinha.id)">
            {{ figurinha.coletada ? 'Coletada' : 'Pendente' }}
          </ion-button>
        </ion-card-content>
      </ion-card>
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
import { onMounted, ref, watch } from 'vue'
import { useAlbum } from '../composables/useAlbum'

const { figurinhas, listar, pesquisar, marcarColetada, filtro } = useAlbum()

const pesquisa = ref('')
const filtroSelecionado = ref<'todos' | 'coletadas' | 'pendentes'>('todos')

function badgeColor(raridade: string) {
  if (raridade === 'Brilhante') return 'warning'
  if (raridade === 'Rara') return 'primary'
  return 'medium'
}

async function aoMarcar(id: number) {
  await marcarColetada(id)
}

watch(pesquisa, async (termo) => {
  await pesquisar(termo, filtroSelecionado.value)
})

watch(filtroSelecionado, async (status) => {
  await filtro(status, pesquisa.value)
})

onMounted(() => {
  void listar()
})
</script>

<style scoped>
ion-img {
  height: 500px;
  object-fit: fill;
}

ion-card {
  border-radius: 12px;
}
</style>