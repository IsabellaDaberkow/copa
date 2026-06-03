<template>
  <ion-card>

    <ion-img
      :src="foto"
      class="foto-jogador"
    />

    <ion-card-header>
      <h2>{{ nome }}</h2>
    </ion-card-header>

    <ion-card-content>

      <p>
        <strong>Seleção:</strong>
        {{ selecao }}
      </p>

      <ion-badge
        :color="coletada ? 'success' : 'danger'"
      >
        {{ coletada ? 'Coletada' : 'Pendente' }}
      </ion-badge>

    </ion-card-content>

  </ion-card>
</template>

<script setup lang="ts">
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonBadge,
  IonImg
} from '@ionic/vue'

defineProps({
  nome: String,
  selecao: String,
  foto: String,
  coletada: Boolean
})
</script>

<style scoped>
.foto-jogador{
  width: 100%;
  height: 220px;
  object-fit: cover;
}

h2{
  margin: 0;
}

ion-card{
  border-radius: 12px;
}
</style>