<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>🏅 Conquistas</h1>
      <p>Seu progresso é salvo automaticamente no banco SQLite.</p>

      <ion-card v-for="conquista in conquistas" :key="conquista.id">
        <ion-card-header>
          <div class="header-row">
            <div class="badge-icon">{{ conquista.icone }}</div>
            <div>
              <ion-card-title>{{ conquista.nome }}</ion-card-title>
              <ion-card-subtitle>{{ conquista.descricao }}</ion-card-subtitle>
            </div>
          </div>
        </ion-card-header>

        <ion-card-content>
          <ion-badge :color="conquista.desbloqueada ? 'success' : 'medium'">
            {{ conquista.desbloqueada ? 'Desbloqueada' : 'Bloqueada' }}
          </ion-badge>

          <p v-if="conquista.desbloqueada" class="unlock-date">
            Desbloqueada em {{ formatDate(conquista.data_desbloqueio) }}
          </p>
          <p v-else class="unlock-date">Continue colecionando para desbloquear.</p>
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
  IonCardSubtitle,
  IonCardContent,
  IonBadge
} from '@ionic/vue'
import { onMounted } from 'vue'
import { useAchievements } from '../composables/useAchievements'

const { conquistas, listar } = useAchievements()

function formatDate(value: string | null) {
  if (!value) return '—'

  return new Date(value).toLocaleDateString('pt-BR')
}

onMounted(() => {
  void listar()
})
</script>

<style scoped>
.header-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge-icon {
  font-size: 2rem;
}

.unlock-date {
  margin-top: 8px;
  color: var(--ion-color-medium);
}
</style>
