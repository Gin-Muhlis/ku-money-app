import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getExpiredStatus } from '@/services/subscription.service'

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

    // Payment Pages
    {
      path: '/payment/success',
      name: 'payment-success',
      component: () => import('@/views/pages/payment/PaymentSuccessPage.vue'),
    },
    {
      path: '/payment/failed',
      name: 'payment-failed',
      component: () => import('@/views/pages/payment/PaymentFailedPage.vue'),
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
          path: 'orders',
          name: 'orders',
          component: () => import('@/views/pages/app/OrdersPage.vue'),
          meta: { title: 'Pembayaran' },
        },
        {
          path: 'subscription',
          name: 'subscription',
          component: () => import('@/views/pages/app/SubscriptionPage.vue'),
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

    // Catch all - 404 Not Found (must be last)
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/pages/NotFoundPage.vue'),
    },
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
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
    } else if (!authStore.isVerified) {
      // Authenticated but not verified, redirect to verify email
      // Allow access to verify-email and verify-token pages
      if (to.name === 'verify-email' || to.name === 'verify-token') {
        next()
      } else {
        next({
          path: '/verify-email',
          query: { redirect: to.fullPath },
        })
      }
    } else {
      // Check subscription expired status (skip for subscription and orders pages)
      const allowedRoutesWithoutExpiredCheck = ['subscription', 'orders']
      if (!allowedRoutesWithoutExpiredCheck.includes(to.name)) {
        // Check expired status
        try {
          const expiredStatus = await getExpiredStatus()
          if (expiredStatus.isExpired) {
            // Subscription expired, redirect to subscription page
            next({
              path: '/app/subscription',
              query: { expired: 'true', redirect: to.fullPath },
            })
            return
          }
        } catch (error) {
          // If error (e.g., no subscription), allow access for free users
          // Only block if it's a clear expired status error
          if (error.code !== 'NO_SUBSCRIPTION') {
            console.error('Error checking expired status:', error)
          }
        }
      }
      next()
    }
  }
  // Check if route is for guests only (login, register)
  else if (to.matched.some((record) => record.meta.guest)) {
    if (authStore.isAuthenticated) {
      // If authenticated but not verified, allow access to verify pages
      if (to.name === 'verify-email' || to.name === 'verify-token') {
        next()
      } else if (!authStore.isVerified) {
        // Not verified, redirect to verify email
        next('/verify-email')
      } else {
        // Already authenticated and verified, redirect to dashboard
        next('/app/dashboard')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
