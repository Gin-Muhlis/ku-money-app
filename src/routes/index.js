import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/pages/landing/HomePage.vue'),
    },
    {
      path: '/about',
      component: () => import('@/views/pages/AboutPage.vue'),
    },
    {
      path: '/login',
      component: () => import('@/views/pages/auth/LoginPage.vue'),
    },
    {
      path: '/register',
      component: () => import('@/views/pages/auth/RegisterPage.vue'),
    },
  ],
})

export default router
