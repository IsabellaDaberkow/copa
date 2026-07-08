<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>🔑 Recuperar Senha</h1>

      <ion-input v-model="email" label="E-mail" fill="outline" />
      <br>

      <ion-button expand="block" @click="enviar">
        Enviar
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  toastController
} from '@ionic/vue'
import { useAuth } from '@/composables/useAuth'

const { resetarSenha } = useAuth()
const email = ref('')

async function mostrarToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
  const toast = await toastController.create({
    message,
    duration: 1800,
    color,
    position: 'top'
  })

  await toast.present()
}

async function enviar() {
  const resultado = await resetarSenha(email.value)
  await mostrarToast(resultado.message, resultado.ok ? 'success' : 'warning')
}
</script>