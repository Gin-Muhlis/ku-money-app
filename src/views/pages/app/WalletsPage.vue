<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex-1">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Dompet Saya</h2>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Kelola akun keuangan Anda</p>
      </div>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <i class="mdi mdi-plus"></i>
        <span>Tambah Dompet</span>
      </button>
    </div>

    <!-- Total Balance Summary -->
    <div
      class="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 sm:p-6 text-white mb-6"
    >
      <p class="text-xs sm:text-sm opacity-90 mb-1">Total Saldo</p>
      <p class="text-2xl sm:text-3xl font-bold">{{ formattedTotalBalance }}</p>
      <p class="text-xs sm:text-sm opacity-75 mt-2">{{ accounts.length }} dompet aktif</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-indigo-600 mb-2"></i>
        <p class="text-gray-600">Memuat dompet...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="accounts.length === 0"
      class="bg-white rounded-xl p-12 text-center border border-gray-200"
    >
      <i class="mdi mdi-wallet-outline text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Belum ada dompet</h3>
      <p class="text-gray-600 mb-6">Mulai dengan menambahkan dompet pertama Anda</p>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        <i class="mdi mdi-plus mr-2"></i>
        Tambah Dompet Pertama
      </button>
    </div>

    <!-- Accounts Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <WalletCard
        v-for="account in accounts"
        :key="account._id"
        :title="account.title"
        :icon="account.icon"
        :balance="account.balance"
        :description="account.description"
        @edit="openEditModal(account)"
        @delete="confirmDelete(account)"
      />
    </div>

    <!-- Create/Edit Modal -->
    <WalletModal
      :show="showModal"
      :is-loading="isSubmitting"
      :is-edit="isEditMode"
      :wallet-data="selectedWallet"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from '@/services/account.service'
import { formatRupiah } from '@/helpers/formatCurrency'
import WalletCard from '@/views/components/ui/WalletCard.vue'
import WalletModal from '@/views/components/ui/WalletModal.vue'

const accounts = ref([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const selectedWallet = ref(null)

const formattedTotalBalance = computed(() => {
  const total = accounts.value.reduce((sum, acc) => sum + (acc.balance || 0), 0)
  return formatRupiah(total)
})

const fetchAccounts = async () => {
  try {
    isLoading.value = true
    const response = await getAccounts()
    accounts.value = response.data || []
  } catch (error) {
    console.error('Error fetching accounts:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Dompet',
      text: error.message || 'Terjadi kesalahan saat memuat data dompet',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  selectedWallet.value = null
  showModal.value = true
}

const openEditModal = (wallet) => {
  isEditMode.value = true
  selectedWallet.value = { ...wallet }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedWallet.value = null
  isEditMode.value = false
}

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true

    // Convert balance to number
    const submitData = {
      title: formData.title,
      icon: formData.icon,
      description: formData.description || '',
      balance: Number(formData.balance) || 0,
    }

    if (isEditMode.value) {
      await updateAccount(selectedWallet.value._id, submitData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dompet berhasil diperbarui',
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      await createAccount(submitData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Dompet berhasil dibuat',
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: false,
      })
    }

    closeModal()
    await fetchAccounts()
  } catch (error) {
    console.error('Error saving account:', error)
    Swal.fire({
      icon: 'error',
      title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Dompet',
      text: error.message || 'Terjadi kesalahan saat menyimpan data',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (wallet) => {
  Swal.fire({
    title: 'Hapus Dompet?',
    html: `Apakah Anda yakin ingin menghapus <strong>${wallet.title}</strong>?<br><small class="text-gray-500">Tindakan ini tidak dapat dibatalkan</small>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteAccount(wallet._id)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Dompet berhasil dihapus',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
        await fetchAccounts()
      } catch (error) {
        console.error('Error deleting account:', error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: error.message || 'Terjadi kesalahan saat menghapus dompet',
          confirmButtonColor: '#4F46E5',
        })
      }
    }
  })
}

onMounted(() => {
  fetchAccounts()
})
</script>
