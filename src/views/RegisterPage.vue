<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1>📝 Cadastro</h1>

      <ion-input v-model="nome" label="Nome Completo" fill="outline" />
      <br>

      <ion-input v-model="email" label="E-mail" fill="outline" />
      <br>

      <ion-input v-model="senha" type="password" label="Senha" fill="outline" />

      <br>

      <ion-button expand="block" @click="cadastrarUsuario">
        Cadastrar
      </ion-button>

      <ion-button expand="block" fill="outline" @click="router.push('/')">
        Voltar
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
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { cadastrar } = useAuth()

const nome = ref('')
const email = ref('')
const senha = ref('')

async function mostrarToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
  const toast = await toastController.create({
    message,
    duration: 1800,
    color,
    position: 'top'
  })

  await toast.present()
}

async function cadastrarUsuario() {
  const resultado = await cadastrar(nome.value, email.value, senha.value)

  if (!resultado.ok) {
    await mostrarToast(resultado.message, 'warning')
    return
  }

  await mostrarToast(resultado.message)
  router.push('/')
}
</script>