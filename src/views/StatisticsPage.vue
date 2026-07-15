<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>📊 Estatísticas</h1>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Resumo da coleção</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="stats-grid">
            <div class="stat-item">
              <ion-label>Total cadastradas</ion-label>
              <ion-badge color="primary">{{ stats.total }}</ion-badge>
            </div>
            <div class="stat-item">
              <ion-label>Coletadas</ion-label>
              <ion-badge color="success">{{ stats.coletadas }}</ion-badge>
            </div>
            <div class="stat-item">
              <ion-label>Faltantes</ion-label>
              <ion-badge color="warning">{{ stats.faltantes }}</ion-badge>
            </div>
            <div class="stat-item">
              <ion-label>Raras coletadas</ion-label>
              <ion-badge color="tertiary">{{ stats.raras }}</ion-badge>
            </div>
            <div class="stat-item">
              <ion-label>Brilhantes coletadas</ion-label>
              <ion-badge color="danger">{{ stats.brilhantes }}</ion-badge>
            </div>
          </div>

          <div class="progress-block">
            <ion-label>Percentual de conclusão</ion-label>
            <ion-progress-bar :value="stats.percentual / 100"></ion-progress-bar>
            <span>{{ stats.percentual.toFixed(1) }}%</span>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Ranking do colecionador</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <div class="ranking-row">
            <ion-label>Pontuação total</ion-label>
            <ion-badge color="secondary">{{ stats.score }}</ion-badge>
          </div>
          <div class="ranking-row">
            <ion-label>Nível atual</ion-label>
            <ion-badge color="warning">{{ stats.nivel }}</ion-badge>
          </div>
          <div class="progress-block">
            <ion-label>Progresso para {{ stats.proximoNivel }}</ion-label>
            <ion-progress-bar :value="stats.progresso / 100"></ion-progress-bar>
            <span>{{ stats.progresso.toFixed(1) }}%</span>
          </div>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Últimas 10 coletas</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list v-if="recentCollections.length">
            <ion-item v-for="item in recentCollections" :key="item.id">
              <ion-label>
                <h3>{{ item.nome }}</h3>
                <p>{{ item.selecao }}</p>
                <p>{{ formatDate(item.collected_at) }}</p>
              </ion-label>
            </ion-item>
          </ion-list>
          <p v-else>Nenhuma figurinha coletada recentemente.</p>
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
  IonCardTitle,
  IonCardContent,
  IonBadge,
  IonLabel,
  IonProgressBar,
  IonList,
  IonItem,
  IonListHeader
} from '@ionic/vue'
import { onMounted, ref } from 'vue'
import { getCollectionStatsDB, getRecentCollectionsDB } from '../services/database'

const stats = ref({
  total: 0,
  coletadas: 0,
  faltantes: 0,
  raras: 0,
  brilhantes: 0,
  percentual: 0,
  score: 0,
  nivel: 'Bronze',
  proximoNivel: 'Prata',
  progresso: 0
})

const recentCollections = ref<Array<{ id: number; nome: string; selecao: string; collected_at: string | null }>>([])

function formatDate(value: string | null) {
  if (!value) return '—'
  return new Date(value).toLocaleString('pt-BR')
}

async function loadStats() {
  const data = await getCollectionStatsDB()
  stats.value = data
  recentCollections.value = await getRecentCollectionsDB(10, 'desc')
}

onMounted(() => {
  void loadStats()

  if (typeof window !== 'undefined') {
    window.addEventListener('collection:updated', () => {
      void loadStats()
    })
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-block {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.ranking-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
</style>
