<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>👤 Perfil</h1>

      <ion-card>
        <ion-card-content>
          Nome: Usuário Teste
          <br><br>
          Email: usuario@email.com
        </ion-card-content>
      </ion-card>

      <ion-button
  expand="block"
  color="danger"
  @click="sair"
>
  Logout
</ion-button>ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonButton,
  IonCard,
  IonCardContent
} from '@ionic/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function sair() {
  router.push('/')
}
</script>