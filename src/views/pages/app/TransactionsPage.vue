<template>
  <div class="pb-20">
    <!-- Overall Balance Header -->
    <div class="bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-6">
      <p class="text-sm opacity-90 mb-1">Overall balance</p>
      <p class="text-3xl font-bold mb-4">{{ formattedTotalBalance }}</p>

      <!-- Month Navigation -->
      <div class="flex items-center justify-center gap-3">
        <button
          @click="previousMonth"
          class="p-2 hover:bg-white/20 rounded-lg transition"
          title="Bulan Sebelumnya"
        >
          <i class="mdi mdi-chevron-left text-xl"></i>
        </button>

        <div class="flex items-center gap-2 relative month-picker-container">
          <button
            @click.stop="showMonthPicker = !showMonthPicker"
            class="px-4 py-2 hover:bg-white/20 rounded-lg transition flex items-center gap-2"
          >
            <span class="font-semibold">{{ formattedCurrentMonth }}</span>
            <i class="mdi mdi-chevron-down text-sm"></i>
          </button>

          <!-- Month Picker Dropdown -->
          <div
            v-if="showMonthPicker"
            class="absolute z-10 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-3 min-w-[200px]"
            @click.stop
          >
            <input
              :value="monthPickerValue"
              type="month"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 text-gray-800"
              @change="selectMonthFromPicker"
            />
          </div>
        </div>

        <button
          @click="nextMonth"
          class="p-2 hover:bg-white/20 rounded-lg transition"
          title="Bulan Selanjutnya"
          :disabled="isCurrentMonth"
        >
          <i class="mdi mdi-chevron-right text-xl" :class="{ 'opacity-50': isCurrentMonth }"></i>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-indigo-600 mb-2"></i>
        <p class="text-gray-600">Memuat transaksi...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="transactionGroups.length === 0"
      class="bg-white rounded-xl p-12 text-center border border-gray-200"
    >
      <i class="mdi mdi-file-document-outline text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum ada transaksi</h3>
      <p class="text-gray-600 mb-6">Mulai dengan menambahkan transaksi pertama Anda</p>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        <i class="mdi mdi-plus mr-2"></i>
        Tambah Transaksi
      </button>
    </div>

    <!-- Transaction Groups by Date -->
    <div v-else class="space-y-6">
      <div
        v-for="group in transactionGroups"
        :key="group.date"
        class="bg-white rounded-xl border border-gray-200"
      >
        <!-- Date Header -->
        <div class="flex items-center justify-between p-4 border-b border-gray-100">
          <div class="flex items-center gap-4">
            <div class="text-3xl font-bold text-gray-800">{{ getDayNumber(group.date) }}</div>
            <div class="text-sm text-gray-600">
              <div class="font-medium">{{ getDayName(group.date) }}</div>
              <div>{{ getFullDate(group.date) }}</div>
            </div>
          </div>
          <div class="text-right">
            <p v-if="group.totalExpenses > 0" class="text-sm font-semibold text-red-600">
              -{{ formatRupiah(group.totalExpenses) }}
            </p>
            <p v-if="group.totalIncomes > 0" class="text-sm font-semibold text-green-600">
              +{{ formatRupiah(group.totalIncomes) }}
            </p>
          </div>
        </div>

        <!-- Transactions List -->
        <div class="divide-y divide-gray-100">
          <TransactionItem
            v-for="transaction in group.transactions"
            :key="transaction._id"
            :category-name="getCategoryName(transaction)"
            :category-icon="getCategoryIcon(transaction)"
            :category-icon-bg="getCategoryIconBg(transaction)"
            :category-icon-color="getCategoryIconColor(transaction)"
            :account-name="getAccountName(transaction)"
            :account-icon="getAccountIcon(transaction)"
            :amount="transaction.amount"
            :note="transaction.note"
            :is-income="getIsIncome(transaction)"
            @click="openEditModal(transaction)"
          />
        </div>
      </div>
    </div>

    <!-- Floating Action Button -->
    <button
      @click="openCreateModal"
      class="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition flex items-center justify-center z-40"
      title="Tambah Transaksi"
    >
      <i class="mdi mdi-plus text-2xl"></i>
    </button>

    <!-- Create/Edit Modal -->
    <TransactionModal
      :show="showModal"
      :is-loading="isSubmitting"
      :is-edit="isEditMode"
      :transaction-data="selectedTransaction"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  getTransactions,
  createTransaction,
  updateTransaction,
} from '@/services/transaction.service'
import { getAccounts } from '@/services/account.service'
import { formatRupiah } from '@/helpers/formatCurrency'
import { getDayNameID, formatDateID, getMonthNameID, getMonthRange } from '@/helpers/dateFormat'
import TransactionItem from '@/views/components/ui/TransactionItem.vue'
import TransactionModal from '@/views/components/ui/TransactionModal.vue'

const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const selectedTransaction = ref(null)
const showMonthPicker = ref(false)
const monthPickerValue = ref('')

const currentDate = ref(new Date())
const transactionGroups = ref([])
const totalBalance = ref(0)

const formattedTotalBalance = computed(() => {
  return formatRupiah(totalBalance.value)
})

const formattedCurrentMonth = computed(() => {
  const month = getMonthNameID(currentDate.value)
  const year = currentDate.value.getFullYear()
  return `${month} ${year}`
})

const isCurrentMonth = computed(() => {
  const now = new Date()
  return (
    currentDate.value.getMonth() === now.getMonth() &&
    currentDate.value.getFullYear() === now.getFullYear()
  )
})

const getDayNumber = (dateString) => {
  const date = new Date(dateString)
  return date.getDate()
}

const getDayName = (dateString) => {
  return getDayNameID(dateString)
}

const getFullDate = (dateString) => {
  return formatDateID(dateString)
}

const getCategoryName = (transaction) => {
  return transaction.categoryId?.title || transaction.categorySnapshot || 'Kategori Dihapus'
}

const getCategoryIcon = (transaction) => {
  return transaction.categoryId?.icon || '💰'
}

const getCategoryIconBg = (transaction) => {
  // Simple color logic based on category type or use indigo
  const type = transaction.categoryId?.type
  if (type === 'incomes') return '#D1FAE5' // green-100
  if (type === 'expenses') return '#FEE2E2' // red-100
  return '#EEF2FF' // indigo-100
}

const getCategoryIconColor = (transaction) => {
  const type = transaction.categoryId?.type
  if (type === 'incomes') return '#059669' // green-600
  if (type === 'expenses') return '#DC2626' // red-600
  return '#4F46E5' // indigo-600
}

const getAccountName = (transaction) => {
  return transaction.accountId?.title || transaction.accountSnapshot || 'Dompet Dihapus'
}

const getAccountIcon = (transaction) => {
  return transaction.accountId?.icon || '💵'
}

const getIsIncome = (transaction) => {
  return transaction.categoryId?.type === 'incomes'
}

const fetchTransactions = async () => {
  try {
    isLoading.value = true
    const { startDate, endDate } = getMonthRange(currentDate.value)

    const response = await getTransactions({
      grouped: true,
      startDate,
      endDate,
    })

    transactionGroups.value = response.data || []

    // Fetch accounts to get total balance
    try {
      const accountsResponse = await getAccounts()
      const accounts = accountsResponse.data || []
      totalBalance.value = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0)
    } catch (error) {
      console.error('Error fetching accounts for balance:', error)
      // Fallback: calculate from transactions
      const incomes = transactionGroups.value.reduce(
        (sum, group) => sum + (group.totalIncomes || 0),
        0,
      )
      const expenses = transactionGroups.value.reduce(
        (sum, group) => sum + (group.totalExpenses || 0),
        0,
      )
      totalBalance.value = incomes - expenses
    }
  } catch (error) {
    console.error('Error fetching transactions:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Transaksi',
      text: error.message || 'Terjadi kesalahan saat memuat data transaksi',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}

const previousMonth = () => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  // Create new Date object for the first day of previous month
  currentDate.value = new Date(year, month - 1, 1)
  fetchTransactions()
}

const nextMonth = () => {
  if (isCurrentMonth.value) return

  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  // Create new Date object for the first day of next month
  currentDate.value = new Date(year, month + 1, 1)
  fetchTransactions()
}

const selectMonthFromPicker = (event) => {
  const selectedValue = event.target.value
  if (selectedValue) {
    const [year, month] = selectedValue.split('-')
    currentDate.value = new Date(parseInt(year), parseInt(month) - 1, 1)
    showMonthPicker.value = false
    monthPickerValue.value = selectedValue
    fetchTransactions()
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  selectedTransaction.value = null
  showModal.value = true
}

const openEditModal = (transaction) => {
  isEditMode.value = true
  selectedTransaction.value = { ...transaction }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedTransaction.value = null
  isEditMode.value = false
}

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true

    const submitData = {
      accountId: formData.accountId,
      categoryId: formData.categoryId,
      amount: Number(formData.amount) || 0,
      note: formData.note || '',
      paymentDate: formData.paymentDate,
    }

    if (isEditMode.value) {
      await updateTransaction(selectedTransaction.value._id, submitData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Transaksi berhasil diperbarui',
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      await createTransaction(submitData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Transaksi berhasil dibuat',
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: false,
      })
    }

    closeModal()
    await fetchTransactions()
  } catch (error) {
    console.error('Error saving transaction:', error)
    Swal.fire({
      icon: 'error',
      title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Transaksi',
      text: error.message || 'Terjadi kesalahan saat menyimpan data',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isSubmitting.value = false
  }
}

// Swipe navigation for month change
let touchStartX = 0
let touchEndX = 0

const handleTouchStart = (e) => {
  touchStartX = e.changedTouches[0].screenX
}

const handleTouchEnd = (e) => {
  touchEndX = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  const swipeThreshold = 50
  const diff = touchStartX - touchEndX

  if (Math.abs(diff) > swipeThreshold) {
    if (diff > 0) {
      // Swipe left - next month
      nextMonth()
    } else {
      // Swipe right - previous month
      previousMonth()
    }
  }
}

onMounted(() => {
  fetchTransactions()

  // Set initial month picker value
  const year = currentDate.value.getFullYear()
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0')
  monthPickerValue.value = `${year}-${month}`

  // Add swipe listeners
  const container = document.querySelector('.pb-20')
  if (container) {
    container.addEventListener('touchstart', handleTouchStart, { passive: true })
    container.addEventListener('touchend', handleTouchEnd, { passive: true })
  }

  // Close month picker when clicking outside
  const handleMonthPickerClickOutside = (event) => {
    if (showMonthPicker.value) {
      const target = event.target
      const monthPickerContainer = document.querySelector('.month-picker-container')
      // Don't close if clicking on the month input itself or its native picker
      const isMonthInput = target.closest('input[type="month"]')
      if (monthPickerContainer && !monthPickerContainer.contains(target) && !isMonthInput) {
        showMonthPicker.value = false
      }
    }
  }
  document.addEventListener('click', handleMonthPickerClickOutside)

  onUnmounted(() => {
    document.removeEventListener('click', handleMonthPickerClickOutside)
    if (container) {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  })
})
</script>
