<template>
  <div>
    <!-- Welcome Section -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Selamat Datang, {{ userName }}! 👋</h2>
      <p class="text-gray-600 mt-1">Ringkasan keuangan Anda hari ini</p>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <!-- Total Balance -->
      <StatCard
        label="Total Saldo"
        value="Rp 0"
        icon="mdi mdi-wallet"
        icon-bg-color="bg-indigo-100"
        icon-color="text-indigo-600"
      />

      <!-- Income -->
      <StatCard
        label="Pemasukan Bulan Ini"
        value="Rp 0"
        icon="mdi mdi-trending-up"
        icon-bg-color="bg-green-100"
        icon-color="text-green-600"
        value-color="text-green-600"
      />

      <!-- Expense -->
      <StatCard
        label="Pengeluaran Bulan Ini"
        value="Rp 0"
        icon="mdi mdi-trending-down"
        icon-bg-color="bg-red-100"
        icon-color="text-red-600"
        value-color="text-red-600"
      />

      <!-- Transactions -->
      <StatCard
        label="Total Transaksi"
        value="0"
        icon="mdi mdi-swap-horizontal"
        icon-bg-color="bg-amber-100"
        icon-color="text-amber-600"
      />
    </div>

    <!-- Charts Row -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      <!-- Expense by Category -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pengeluaran per Kategori</h3>
        <EmptyState icon="mdi mdi-chart-pie" message="Belum ada data" />
      </div>

      <!-- Income vs Expense -->
      <div class="bg-white rounded-xl p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Pemasukan vs Pengeluaran</h3>
        <EmptyState icon="mdi mdi-chart-bar" message="Belum ada data" />
      </div>
    </div>

    <!-- Recent Transactions -->
    <div class="bg-white rounded-xl p-6 border border-gray-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-800">Transaksi Terbaru</h3>
        <RouterLink
          to="/app/transactions"
          class="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Lihat Semua →
        </RouterLink>
      </div>

      <EmptyState icon="mdi mdi-file-document-outline" message="Belum ada transaksi">
        <RouterLink
          to="/app/transactions"
          class="mt-3 inline-block text-sm text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Tambah Transaksi
        </RouterLink>
      </EmptyState>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
      <button
        class="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition text-center"
      >
        <i class="mdi mdi-plus-circle text-3xl text-indigo-600 mb-2"></i>
        <p class="text-sm font-medium text-gray-700">Tambah Transaksi</p>
      </button>

      <button
        class="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition text-center"
      >
        <i class="mdi mdi-wallet-plus text-3xl text-indigo-600 mb-2"></i>
        <p class="text-sm font-medium text-gray-700">Tambah Akun</p>
      </button>

      <button
        class="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition text-center"
      >
        <i class="mdi mdi-tag-plus text-3xl text-indigo-600 mb-2"></i>
        <p class="text-sm font-medium text-gray-700">Tambah Kategori</p>
      </button>

      <RouterLink
        to="/app/reports"
        class="p-4 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:shadow-md transition text-center"
      >
        <i class="mdi mdi-file-chart text-3xl text-indigo-600 mb-2"></i>
        <p class="text-sm font-medium text-gray-700">Lihat Laporan</p>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import StatCard from '@/views/components/ui/StatCard.vue'
import EmptyState from '@/views/components/ui/EmptyState.vue'

const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name || 'User')
</script>
