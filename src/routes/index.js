import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Landing Pages
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/pages/landing/HomePage.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/pages/AboutPage.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('@/views/pages/PricingPage.vue'),
    },

    // Auth Pages
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/pages/auth/LoginPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/pages/auth/RegisterPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/verify-email',
      name: 'verify-email',
      component: () => import('@/views/pages/auth/VerifyEmailPage.vue'),
      meta: { guest: true },
    },
    {
      path: '/verify/:token',
      name: 'verify-token',
      component: () => import('@/views/pages/auth/VerifyTokenPage.vue'),
      meta: { guest: true },
    },

    // App Pages (Protected)
    {
      path: '/app',
      component: () => import('@/views/layouts/AppLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'dashboard',
          name: 'dashboard',
          component: () => import('@/views/pages/app/DashboardPage.vue'),
          meta: { title: 'Dashboard' },
        },
        {
          path: 'wallets',
          name: 'wallets',
          component: () => import('@/views/pages/app/WalletsPage.vue'),
          meta: { title: 'Dompet' },
        },
        {
          path: 'transactions',
          name: 'transactions',
          component: () => import('@/views/pages/app/TransactionsPage.vue'),
          meta: { title: 'Transaksi' },
        },
        {
          path: 'categories',
          name: 'categories',
          component: () => import('@/views/pages/app/CategoriesPage.vue'),
          meta: { title: 'Kategori' },
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/pages/app/DashboardPage.vue'),
          meta: { title: 'Laporan' },
        },
        {
          path: 'subscription',
          name: 'subscription',
          component: () => import('@/views/pages/app/DashboardPage.vue'),
          meta: { title: 'Langganan' },
        },
        {
          path: 'settings',
          name: 'settings',
          component: () => import('@/views/pages/app/SettingsPage.vue'),
          meta: { title: 'Pengaturan' },
        },
      ],
    },

    // Redirect /app to /app/dashboard
    {
      path: '/app',
      redirect: '/app/dashboard',
    },
  ],
})

// Navigation Guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Load auth from localStorage on first load
  if (!authStore.isAuthenticated) {
    authStore.loadFromStorage()
  }

  // Check if route requires authentication
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!authStore.isAuthenticated) {
      // Not authenticated, redirect to login
      next({
        path: '/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  }
  // Check if route is for guests only (login, register)
  else if (to.matched.some((record) => record.meta.guest)) {
    if (authStore.isAuthenticated) {
      // Already authenticated, redirect to dashboard
      next('/app/dashboard')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
