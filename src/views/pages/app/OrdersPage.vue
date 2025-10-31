<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Pembayaran</h2>
        <p class="text-gray-600 mt-1">Riwayat pembayaran subscription Anda</p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-indigo-600 mb-2"></i>
        <p class="text-gray-600">Memuat data pembayaran...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="orders.length === 0"
      class="bg-white rounded-xl p-12 text-center border border-gray-200"
    >
      <i class="mdi mdi-receipt text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum ada pembayaran</h3>
      <p class="text-gray-600">Riwayat pembayaran akan muncul di sini</p>
    </div>

    <!-- Orders List -->
    <div v-else class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.transactionId"
        class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
        @click="openDetailModal(order)"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h3 class="text-lg font-semibold text-gray-800">
                {{ getPackageName(order.package) }}
              </h3>
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-semibold',
                  getStatusClass(order.status),
                ]"
              >
                {{ getStatusText(order.status) }}
              </span>
            </div>
            <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span class="flex items-center gap-2">
                <i class="mdi mdi-cash text-indigo-600"></i>
                {{ formatRupiah(order.amount) }}
              </span>
              <span class="flex items-center gap-2">
                <i class="mdi mdi-calendar text-indigo-600"></i>
                {{ order.period }} {{ order.period === 1 ? 'bulan' : 'bulan' }}
              </span>
              <span class="flex items-center gap-2">
                <i class="mdi mdi-clock-outline text-indigo-600"></i>
                {{ formatDate(order.createdAt) }}
              </span>
            </div>
          </div>
          <button
            @click.stop="openDetailModal(order)"
            class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
            title="Lihat Detail"
          >
            <i class="mdi mdi-eye text-xl"></i>
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
        <button
          @click="changePage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          <i class="mdi mdi-chevron-left"></i>
        </button>
        <span class="px-4 py-2 text-sm text-gray-600">
          Halaman {{ pagination.page }} dari {{ pagination.totalPages }}
        </span>
        <button
          @click="changePage(pagination.page + 1)"
          :disabled="pagination.page === pagination.totalPages"
          class="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
        >
          <i class="mdi mdi-chevron-right"></i>
        </button>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <OrderDetailModal :show="showDetailModal" :order="selectedOrder" @close="closeDetailModal" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
import { getUserOrders, getOrderStatus } from '@/services/order.service'
import { formatRupiah } from '@/helpers/formatCurrency'
import { formatDateID } from '@/helpers/dateFormat'
import OrderDetailModal from '@/views/components/ui/OrderDetailModal.vue'

const isLoading = ref(false)
const showDetailModal = ref(false)
const selectedOrder = ref(null)
const orders = ref([])
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
})

const getPackageName = (packageType) => {
  const packageNames = {
    free: 'Free',
    pro: 'Pro',
    unlimited: 'Unlimited',
  }
  return packageNames[packageType] || packageType
}

const getStatusClass = (status) => {
  const statusClasses = {
    paid: 'bg-green-100 text-green-700',
    unpaid: 'bg-yellow-100 text-yellow-700',
    expired: 'bg-red-100 text-red-700',
    failed: 'bg-red-100 text-red-700',
  }
  return statusClasses[status] || 'bg-gray-100 text-gray-700'
}

const getStatusText = (status) => {
  const statusTexts = {
    paid: 'Lunas',
    unpaid: 'Belum Bayar',
    expired: 'Kedaluwarsa',
    failed: 'Gagal',
  }
  return statusTexts[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return formatDateID(dateString)
}

const fetchOrders = async () => {
  try {
    isLoading.value = true
    const response = await getUserOrders({
      page: pagination.value.page,
      limit: pagination.value.limit,
    })

    orders.value = response.orders || []
    pagination.value = {
      page: response.pagination?.page || 1,
      limit: response.pagination?.limit || 10,
      total: response.pagination?.total || 0,
      totalPages: response.pagination?.totalPages || 1,
    }
  } catch (error) {
    console.error('Error fetching orders:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Data',
      text: error.message || 'Terjadi kesalahan saat memuat riwayat pembayaran',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}

const openDetailModal = async (order) => {
  try {
    selectedOrder.value = order
    showDetailModal.value = true

    // Fetch order status
    const statusResponse = await getOrderStatus(order.transactionId)
    selectedOrder.value = { ...order, ...statusResponse }
  } catch (error) {
    console.error('Error fetching order details:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Detail',
      text: error.message || 'Terjadi kesalahan saat memuat detail pembayaran',
      confirmButtonColor: '#4F46E5',
    })
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedOrder.value = null
}

const changePage = (page) => {
  if (page >= 1 && page <= pagination.value.totalPages) {
    pagination.value.page = page
    fetchOrders()
  }
}

onMounted(() => {
  fetchOrders()
})
</script>
