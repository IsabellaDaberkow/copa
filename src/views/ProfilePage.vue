<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>👤 Perfil</h1>

      <ion-card>
        <ion-card-content>
          <p><strong>Nome:</strong> {{ usuario?.nome || 'Não informado' }}</p>
          <p><strong>Email:</strong> {{ usuario?.email || usuario?.login || 'Não informado' }}</p>
        </ion-card-content>
      </ion-card>

      <ion-button expand="block" color="danger" @click="sair">
        Logout
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { usuario, syncSession, logout } = useAuth()

onMounted(async () => {
  await syncSession()
})

function sair() {
  logout()
  router.push('/')
}
</script>