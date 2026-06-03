<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1 class="titulo">
  ⚽ Álbum da Copa
</h1>

      <ion-input
        v-model="email"
        label="E-mail"
        fill="outline">
      </ion-input>

      <br>

      <ion-input
        v-model="senha"
        type="password"
        label="Senha"
        fill="outline">
      </ion-input>

      <br>

      <ion-button expand="block" @click="entrar">
        Entrar
      </ion-button>

      <ion-button
  expand="block"
  fill="outline"
  @click="router.push('/cadastro')">
  Cadastrar
</ion-button>

<ion-button
  expand="block"
  fill="clear"
  @click="router.push('/reset')">
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
  IonButton
} from '@ionic/vue'

const router = useRouter()

const email = ref('')
const senha = ref('')

function entrar() {

  if (!email.value || !senha.value) {
    alert('Preencha todos os campos')
    return
  }

  alert('Login realizado!')

  router.push('/tabs/album')
}
</script>
<style scoped>
.titulo{
  text-align:center;
  margin-top:30px;
  margin-bottom:30px;
}
</style>