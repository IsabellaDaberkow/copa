<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>📝 Cadastro</h1>

      <ion-input v-model="nome" label="Nome Completo" fill="outline" />
      <br>

      <ion-input v-model="email" label="E-mail" fill="outline" />
      <br>

      <ion-input
        v-model="senha"
        type="password"
        label="Senha"
        fill="outline" />

      <br>

      <ion-button expand="block" @click="cadastrar">
        Cadastrar
      </ion-button>

      <ion-button
  expand="block"
  fill="outline"
  @click="router.push('/')"
>
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
  IonButton
} from '@ionic/vue'
import { useRouter } from 'vue-router'
import { addUsuario } from '@/services/database'

const router = useRouter()
const nome = ref('')
const email = ref('')
const senha = ref('')

async function cadastrar() {
  if (!nome.value || !email.value || !senha.value) {
    alert('Preencha todos os campos')
    return
  }

  if (senha.value.length < 6) {
    alert('Senha fraca')
    return
  }

  try {
    await addUsuario(nome.value, email.value, senha.value)
    alert('Cadastro realizado!')
    router.push('/')
  } catch (error) {
    console.error('Erro ao cadastrar usuário', error)
    alert('Erro ao realizar cadastro')
  }
}


</script>