<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Langganan</h2>
      <p class="text-gray-600 mt-1">Kelola paket subscription Anda</p>
    </div>

    <!-- Current Subscription Card -->
    <div class="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Paket Saat Ini</h3>
          <p class="text-sm text-gray-600 mt-1">
            {{ getPackageName(currentStatus) }}
          </p>
        </div>
        <span
          :class="[
            'px-4 py-2 rounded-full text-sm font-semibold',
            getStatusBadgeClass(currentStatus),
          ]"
        >
          {{ getPackageName(currentStatus) }}
        </span>
      </div>

      <!-- Subscription Details -->
      <div v-if="subscription" class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div>
          <p class="text-xs text-gray-600 mb-1">Kategori</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitCategory) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Dompet</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitAccount) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Pemasukan</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitIncomes) }}
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-600 mb-1">Pengeluaran</p>
          <p class="text-sm font-semibold text-gray-800">
            {{ formatLimit(subscription.limitExpenses) }}
          </p>
        </div>
      </div>

      <!-- Expired Date -->
      <div v-if="expiredAt && currentStatus !== 'free'" class="mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-xs text-gray-600 mb-1">Berlaku Hingga</p>
            <p class="text-lg font-semibold text-gray-800">{{ formattedExpiredAt }}</p>
          </div>
          <div
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              isExpired
                ? 'bg-red-100 text-red-700'
                : isExpiredSoon
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-green-100 text-green-700',
            ]"
          >
            <span v-if="isExpired">Kedaluwarsa</span>
            <span v-else-if="isExpiredSoon">Akan Kedaluwarsa</span>
            <span v-else>Aktif</span>
          </div>
        </div>
        <p v-if="daysUntilExpiry !== null" class="text-xs text-gray-500 mt-2">
          {{ daysUntilExpiryText }}
        </p>
      </div>
    </div>

    <!-- Available Packages / Extend Options -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Upgrade to Pro (if free) -->
      <div
        v-if="currentStatus === 'free' && proPackage"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
      >
        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Pro</h3>
          <div class="text-3xl font-extrabold text-indigo-600 mb-1">
            {{ formatRupiah(proPackage.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <ul class="space-y-2 mb-6 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.category) }} Kategori</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.account) }} Dompet</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.incomes) }} Pemasukan</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>{{ formatLimit(proPackage.expenses) }} Pengeluaran</span>
          </li>
        </ul>

        <button
          @click="openOrderModal('upgrade', proPackage)"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Upgrade ke Pro
        </button>
      </div>

      <!-- Upgrade to Unlimited (if free or pro) -->
      <div
        v-if="(currentStatus === 'free' || currentStatus === 'pro') && unlimitedPackage"
        class="bg-white rounded-xl border-2 border-indigo-600 p-6 hover:shadow-lg transition relative"
      >
        <div
          class="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold"
        >
          Paling Populer
        </div>

        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Unlimited</h3>
          <div class="text-3xl font-extrabold text-indigo-600 mb-1">
            {{ formatRupiah(unlimitedPackage.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <ul class="space-y-2 mb-6 text-sm text-gray-600">
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Kategori</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Dompet</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Pemasukan</span>
          </li>
          <li class="flex items-center gap-2">
            <i class="mdi mdi-check text-green-600"></i>
            <span>Unlimited Pengeluaran</span>
          </li>
        </ul>

        <button
          @click="openOrderModal('upgrade', unlimitedPackage)"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          {{ currentStatus === 'free' ? 'Upgrade ke Unlimited' : 'Upgrade ke Unlimited' }}
        </button>
      </div>

      <!-- Extend Subscription (if pro or unlimited) -->
      <div
        v-if="(currentStatus === 'pro' || currentStatus === 'unlimited') && currentPackage"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition"
      >
        <div class="text-center mb-4">
          <h3 class="text-xl font-bold text-gray-800 mb-2">Perpanjang</h3>
          <div class="text-3xl font-extrabold text-indigo-600 mb-1">
            {{ formatRupiah(currentPackage.price) }}
          </div>
          <p class="text-sm text-gray-600">per bulan</p>
        </div>

        <p class="text-sm text-gray-600 mb-6 text-center">
          Perpanjang paket {{ getPackageName(currentStatus) }} Anda
        </p>

        <button
          @click="openOrderModal('extends', currentPackage)"
          class="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Perpanjang Langganan
        </button>
      </div>
    </div>

    <!-- Order Modal -->
    <OrderModal
      :show="showOrderModal"
      :order-type="selectedOrderType"
      :package-data="selectedPackage"
      :is-loading="isCreatingOrder"
      @close="closeOrderModal"
      @submit="handleCreateOrder"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { getPackages } from '@/services/package.service'
import { getSubscription } from '@/services/subscription.service'
import { getOrderStatus, getLastOrder } from '@/services/order.service'
import { formatRupiah } from '@/helpers/formatCurrency'
import { formatDateID } from '@/helpers/dateFormat'
import Swal from 'sweetalert2'
import OrderModal from '@/views/components/ui/OrderModal.vue'

const authStore = useAuthStore()
const isLoading = ref(false)
const packages = ref([])
const subscription = ref(null)
const showOrderModal = ref(false)
const selectedOrderType = ref(null)
const selectedPackage = ref(null)
const isCreatingOrder = ref(false)

// Check for order status in URL params (after payment redirect)
const checkPaymentStatus = async () => {
  const urlParams = new URLSearchParams(window.location.search)
  const transactionId = urlParams.get('transaction_id')
  const status = urlParams.get('status')

  if (transactionId && status) {
    try {
      // Check order status
      const orderStatus = await getOrderStatus(transactionId)

      if (orderStatus.status === 'paid') {
        // Update user status in store
        authStore.updateUser({ status: orderStatus.package })

        Swal.fire({
          icon: 'success',
          title: 'Pembayaran Berhasil!',
          text: `Paket ${getPackageName(orderStatus.package)} berhasil diaktifkan`,
          confirmButtonColor: '#4F46E5',
        })

        // Remove query params from URL
        window.history.replaceState({}, '', window.location.pathname)

        // Refresh subscription data
        await fetchSubscription()
      } else if (status === 'failed' || status === 'expired') {
        Swal.fire({
          icon: 'error',
          title: 'Pembayaran Gagal',
          text: 'Pembayaran Anda gagal atau telah kedaluwarsa',
          confirmButtonColor: '#4F46E5',
        })

        // Remove query params
        window.history.replaceState({}, '', window.location.pathname)
      }
    } catch (error) {
      console.error('Error checking payment status:', error)
    }
  }
}

const currentStatus = computed(() => authStore.userStatus)

const currentPackage = computed(() => {
  if (!currentStatus.value) return null
  return packages.value.find((pkg) => pkg.package === currentStatus.value)
})

const proPackage = computed(() => {
  return packages.value.find((pkg) => pkg.package === 'pro')
})

const unlimitedPackage = computed(() => {
  return packages.value.find((pkg) => pkg.package === 'unlimited')
})

const getPackageName = (packageType) => {
  const names = {
    free: 'Free',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }
  return names[packageType] || packageType
}

const getStatusBadgeClass = (status) => {
  const classes = {
    free: 'bg-gray-100 text-gray-700',
    pro: 'bg-indigo-100 text-indigo-700',
    unlimited: 'bg-amber-100 text-amber-700',
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const formatLimit = (value) => {
  if (value === 0 || value === null || value === undefined) return 'Unlimited'
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}Jt`
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`
  }
  return value.toString()
}

// Expired date related computed properties
const expiredAt = computed(() => {
  return subscription.value?.expiredAt || null
})

const formattedExpiredAt = computed(() => {
  if (!expiredAt.value) return '-'
  return formatDateID(expiredAt.value)
})

const isExpired = computed(() => {
  if (!expiredAt.value) return false
  const expiryDate = new Date(expiredAt.value)
  const now = new Date()
  return expiryDate < now
})

const isExpiredSoon = computed(() => {
  if (!expiredAt.value || isExpired.value) return false
  const expiryDate = new Date(expiredAt.value)
  const now = new Date()
  const daysUntilExpiry = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry <= 7 && daysUntilExpiry > 0
})

const daysUntilExpiry = computed(() => {
  if (!expiredAt.value) return null
  const expiryDate = new Date(expiredAt.value)
  const now = new Date()
  const days = Math.floor((expiryDate - now) / (1000 * 60 * 60 * 24))
  return days
})

const daysUntilExpiryText = computed(() => {
  if (daysUntilExpiry.value === null) return ''
  if (daysUntilExpiry.value < 0) return 'Langganan telah kedaluwarsa'
  if (daysUntilExpiry.value === 0) return 'Langganan akan kedaluwarsa hari ini'
  if (daysUntilExpiry.value === 1) return 'Tersisa 1 hari lagi'
  return `Tersisa ${daysUntilExpiry.value} hari lagi`
})

const openOrderModal = async (orderType, packageData) => {
  try {
    // Check if user has unpaid order
    const lastOrder = await getLastOrder()

    if (lastOrder && lastOrder.status === 'unpaid') {
      Swal.fire({
        icon: 'warning',
        title: 'Masih Ada Order Belum Dibayar',
        html: `
          <p class="mb-3">Anda masih memiliki order yang belum dibayar.</p>
          <p class="text-sm text-gray-600 mb-4">
            Paket: <strong>${getPackageName(lastOrder.package)}</strong><br>
            Jumlah: <strong>${formatRupiah(lastOrder.amount)}</strong><br>
            Periode: <strong>${lastOrder.period} bulan</strong>
          </p>
          <p class="text-sm">Silakan selesaikan pembayaran terlebih dahulu sebelum membuat order baru.</p>
        `,
        confirmButtonColor: '#4F46E5',
        confirmButtonText: 'Lihat Order',
        showCancelButton: true,
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          // Redirect to orders page
          window.location.href = '/app/orders'
        }
      })
      return
    }

    // If order is expired or failed, allow creating new order
    if (lastOrder && (lastOrder.status === 'expired' || lastOrder.status === 'failed')) {
      // Allow creating new order
    }

    selectedOrderType.value = orderType
    selectedPackage.value = packageData
    showOrderModal.value = true
  } catch (error) {
    console.error('Error checking last order:', error)
    // If error checking, still allow opening modal
    selectedOrderType.value = orderType
    selectedPackage.value = packageData
    showOrderModal.value = true
  }
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrderType.value = null
  selectedPackage.value = null
}

const fetchPackages = async () => {
  try {
    isLoading.value = true
    const response = await getPackages()
    packages.value = response.data || []
  } catch (error) {
    console.error('Error fetching packages:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchSubscription = async () => {
  try {
    const response = await getSubscription()
    subscription.value = response.subscription || null
  } catch (error) {
    console.error('Error fetching subscription:', error)
    // If subscription not found, set to null
    if (error.code === 'NO_SUBSCRIPTION') {
      subscription.value = null
    }
  }
}

onMounted(async () => {
  await Promise.all([fetchPackages(), fetchSubscription()])
  checkPaymentStatus()
})
</script>
