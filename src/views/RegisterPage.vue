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
  @click="router.push('/tabs/album')"
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

const router = useRouter()
const nome = ref('')
const email = ref('')
const senha = ref('')

function cadastrar() {

  if (!nome.value || !email.value || !senha.value) {
    alert('Preencha todos os campos')
    return
  }

  if (senha.value.length < 6) {
    alert('Senha fraca')
    return
  }

  localStorage.setItem(
    'usuario',
    JSON.stringify({
      nome: nome.value,
      email: email.value,
      senha: senha.value
    })
  )

  alert('Cadastro realizado com sucesso!')

  router.push('/')
}


</script>