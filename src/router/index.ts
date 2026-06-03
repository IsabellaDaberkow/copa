import { createRouter, createWebHistory } from '@ionic/vue-router'
import LoginPage from '../views/LoginPage.vue'
import AlbumPage from '../views/AlbumPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import ResetPasswordPage from '../views/ResetPasswordPage.vue'
import ProfilePage from '../views/ProfilePage.vue'
import TabsPage from '../views/TabsPage.vue'

const routes = [

  {
    path: '/',
    component: LoginPage
  },

  {
    path: '/reset',
    component: ResetPasswordPage
  },

  {
    path: '/tabs',
    component: TabsPage,
    children: [

      {
        path: '',
        redirect: '/tabs/album'
      },

      {
        path: 'album',
        component: AlbumPage
      },

      {
        path: 'cadastro',
        component: RegisterPage
      },

      {
        path: 'perfil',
        component: ProfilePage
      }

    ]
  }

]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router