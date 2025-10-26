import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../views/pages/LandingPage.vue'
import LoginPage from '../views/pages/LoginPage.vue'
import RegisterPage from '../views/pages/RegisterPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'landing',
      component: LandingPage
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage
    }
  ]
})

export default router