<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>🔑 Recuperar Senha</h1>

      <ion-input
        v-model="email"
        label="E-mail"
        fill="outline" />

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
  IonButton
} from '@ionic/vue'

const email = ref('')

function enviar() {

  if (!email.value) {
    alert('Digite um e-mail')
    return
  }

  alert('E-mail de redefinição enviado!')
}
</script>