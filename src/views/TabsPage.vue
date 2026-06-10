<template>
  <ion-page>
    <ion-tabs>

      <ion-router-outlet></ion-router-outlet>

      <ion-tab-bar slot="bottom" color="primary">

        <ion-tab-button tab="album" href="/tabs/album">
          <ion-icon :icon="football"></ion-icon>
          <ion-label>Álbum</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="cadastro" href="/tabs/cadastro">
          <ion-icon :icon="personAdd"></ion-icon>
          <ion-label>Cadastro</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="perfil" href="/tabs/perfil">
          <ion-icon :icon="person"></ion-icon>
          <ion-label>Perfil</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="sobre" href="/tabs/sobre">
          <ion-icon :icon="informationCircle"></ion-icon>
          <ion-label>Sobre</ion-label>
        </ion-tab-button>

      </ion-tab-bar>

    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonLabel,
  IonIcon,
  IonRouterOutlet,
  IonPage
} from '@ionic/vue'

import {
  football,
  person,
  personAdd,
  informationCircle
} from 'ionicons/icons'


</script>