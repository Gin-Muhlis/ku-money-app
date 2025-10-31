<template>
  <div>
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div class="flex-1">
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Kategori Saya</h2>
        <p class="text-sm sm:text-base text-gray-600 mt-1">
          Kelola kategori pemasukan dan pengeluaran
        </p>
      </div>
      <button
        @click="openCreateModal"
        class="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
      >
        <i class="mdi mdi-plus"></i>
        <span>Tambah Kategori</span>
      </button>
    </div>

    <!-- Tabs -->
    <div class="mb-6">
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8" aria-label="Tabs">
          <button
            @click="activeTab = 'expenses'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'expenses'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <i class="mdi mdi-trending-down mr-2"></i>
            Pengeluaran
            <span
              class="ml-2 py-0.5 px-2.5 rounded-full text-xs"
              :class="
                activeTab === 'expenses'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ expensesCount }}
            </span>
          </button>
          <button
            @click="activeTab = 'incomes'"
            :class="[
              'py-4 px-1 border-b-2 font-medium text-sm transition',
              activeTab === 'incomes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            ]"
          >
            <i class="mdi mdi-trending-up mr-2"></i>
            Pemasukan
            <span
              class="ml-2 py-0.5 px-2.5 rounded-full text-xs"
              :class="
                activeTab === 'incomes'
                  ? 'bg-indigo-100 text-indigo-600'
                  : 'bg-gray-100 text-gray-600'
              "
            >
              {{ incomesCount }}
            </span>
          </button>
        </nav>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="text-center">
        <i class="mdi mdi-loading mdi-spin text-4xl text-indigo-600 mb-2"></i>
        <p class="text-gray-600">Memuat kategori...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="currentCategories.length === 0"
      class="bg-white rounded-xl p-12 text-center border border-gray-200"
    >
      <i class="mdi mdi-tag-outline text-6xl text-gray-300 mb-4"></i>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">
        Belum ada kategori {{ activeTab === 'incomes' ? 'pemasukan' : 'pengeluaran' }}
      </h3>
      <p class="text-gray-600 mb-6">Mulai dengan menambahkan kategori pertama Anda</p>
      <button
        @click="openCreateModal"
        class="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition"
      >
        <i class="mdi mdi-plus mr-2"></i>
        Tambah Kategori Pertama
      </button>
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <CategoryCard
        v-for="category in currentCategories"
        :key="category._id"
        :title="category.title"
        :icon="category.icon"
        :type="category.type"
        :amount="category.amount"
        @edit="openEditModal(category)"
        @delete="confirmDelete(category)"
      />
    </div>

    <!-- Create/Edit Modal -->
    <CategoryModal
      :show="showModal"
      :is-loading="isSubmitting"
      :is-edit="isEditMode"
      :category-data="selectedCategory"
      :category-type="activeTab"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/category.service'
import CategoryCard from '@/views/components/ui/CategoryCard.vue'
import CategoryModal from '@/views/components/ui/CategoryModal.vue'

const activeTab = ref('expenses')
const categories = ref([])
const isLoading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditMode = ref(false)
const selectedCategory = ref(null)

const expensesCount = computed(() => {
  return categories.value.filter((cat) => cat.type === 'expenses').length
})

const incomesCount = computed(() => {
  return categories.value.filter((cat) => cat.type === 'incomes').length
})

const currentCategories = computed(() => {
  return categories.value.filter((cat) => cat.type === activeTab.value)
})

const fetchCategories = async () => {
  try {
    isLoading.value = true
    const response = await getCategories()
    categories.value = response.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    Swal.fire({
      icon: 'error',
      title: 'Gagal Memuat Kategori',
      text: error.message || 'Terjadi kesalahan saat memuat data kategori',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  isEditMode.value = false
  selectedCategory.value = null
  showModal.value = true
}

const openEditModal = (category) => {
  isEditMode.value = true
  selectedCategory.value = { ...category }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedCategory.value = null
  isEditMode.value = false
}

const handleSubmit = async (formData) => {
  try {
    isSubmitting.value = true

    const submitData = {
      title: formData.title,
      icon: formData.icon,
      type: formData.type,
    }

    if (isEditMode.value) {
      // For edit, don't send type (can't be changed)
      await updateCategory(selectedCategory.value._id, {
        title: submitData.title,
        icon: submitData.icon,
      })
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil diperbarui',
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: false,
      })
    } else {
      await createCategory(submitData)
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Kategori berhasil dibuat',
        confirmButtonColor: '#4F46E5',
        timer: 2000,
        showConfirmButton: false,
      })
    }

    closeModal()
    await fetchCategories()
  } catch (error) {
    console.error('Error saving category:', error)
    Swal.fire({
      icon: 'error',
      title: isEditMode.value ? 'Gagal Memperbarui' : 'Gagal Membuat Kategori',
      text: error.message || 'Terjadi kesalahan saat menyimpan data',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isSubmitting.value = false
  }
}

const confirmDelete = (category) => {
  Swal.fire({
    title: 'Hapus Kategori?',
    html: `Apakah Anda yakin ingin menghapus <strong>${category.title}</strong>?<br><small class="text-gray-500">Tindakan ini tidak dapat dibatalkan</small>`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Ya, Hapus',
    cancelButtonText: 'Batal',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await deleteCategory(category._id)
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Kategori berhasil dihapus',
          confirmButtonColor: '#4F46E5',
          timer: 2000,
          showConfirmButton: false,
        })
        await fetchCategories()
      } catch (error) {
        console.error('Error deleting category:', error)
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: error.message || 'Terjadi kesalahan saat menghapus kategori',
          confirmButtonColor: '#4F46E5',
        })
      }
    }
  })
}

onMounted(() => {
  fetchCategories()
})
</script>
