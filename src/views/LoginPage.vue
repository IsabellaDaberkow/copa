<template>
  <ion-page>
    <ion-content class="ion-padding">
      <h1 class="titulo">⚽ Álbum da Copa</h1>

      <ion-input v-model="email" label="E-mail" fill="outline" />
      <br>

      <ion-input v-model="senha" type="password" label="Senha" fill="outline" />
      <br>

      <ion-button expand="block" @click="entrar">
        Entrar
      </ion-button>

      <ion-button expand="block" fill="outline" @click="router.push('/tabs/cadastro')">
        Cadastrar
      </ion-button>

      <ion-button expand="block" fill="clear" @click="router.push('/reset')">
        Esqueci minha senha
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  toastController
} from '@ionic/vue'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

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

async function entrar() {
  const resultado = await login(email.value, senha.value)

  if (!resultado.ok) {
    await mostrarToast(resultado.message, 'warning')
    return
  }

  await mostrarToast('Login realizado com sucesso!')
  router.push('/tabs/album')
}
</script>

<style scoped>
.titulo {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>