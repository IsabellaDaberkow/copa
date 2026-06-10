<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>ℹ️ Sobre</h1>

      <ion-card>
        <ion-card-content>
          <p><strong>Aplicativo:</strong> Álbum da Copa</p>
          <p><strong>Versão:</strong> 1.0.0</p>
        </ion-card-content>
      </ion-card>

      <ion-button
        expand="block"
        href="https://www.termsfeed.com/live/terms-and-conditions"
      >
        Termos de Uso
      </ion-button>

      <br>

      <ion-button
        expand="block"
        href="https://www.termsfeed.com/live/privacy-policy"
      >
        Política de Privacidade
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardContent,
  IonButton
} from '@ionic/vue'
</script>