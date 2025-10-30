<template>
  <div
    :class="[
      'relative rounded-2xl p-8 transition-all duration-300',
      isPopular
        ? 'bg-primary text-white shadow-2xl scale-105 border-2 border-primary'
        : 'bg-white border border-gray-200 hover:shadow-lg',
    ]"
  >
    <!-- Popular Badge -->
    <div
      v-if="isPopular"
      class="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-sm font-semibold"
    >
      Paling Populer
    </div>

    <!-- Package Name -->
    <h3 :class="['text-2xl font-bold mb-2 capitalize', isPopular ? 'text-white' : 'text-neutral']">
      {{ packageData.package }}
    </h3>

    <!-- Price -->
    <div class="mb-6">
      <div :class="['text-4xl font-extrabold', isPopular ? 'text-white' : 'text-primary']">
        {{ formattedPrice }}
      </div>
      <p :class="['text-sm', isPopular ? 'text-white/80' : 'text-gray-500']">
        {{ packageData.price === 0 ? 'Selamanya' : 'per bulan' }}
      </p>
    </div>

    <!-- Features -->
    <ul class="space-y-4 mb-8">
      <li class="flex items-start">
        <FeatureIcon :is-popular="isPopular" />
        <span :class="isPopular ? 'text-white' : 'text-gray-700'">
          <span class="font-semibold">{{ formatLimit(packageData.category) }}</span> Kategori
        </span>
      </li>

      <li class="flex items-start">
        <FeatureIcon :is-popular="isPopular" />
        <span :class="isPopular ? 'text-white' : 'text-gray-700'">
          <span class="font-semibold">{{ formatLimit(packageData.account) }}</span> Akun
        </span>
      </li>

      <li class="flex items-start">
        <FeatureIcon :is-popular="isPopular" />
        <span :class="isPopular ? 'text-white' : 'text-gray-700'">
          Pemasukan <span class="font-semibold">{{ formatNumber(packageData.incomes) }}</span>
        </span>
      </li>

      <li class="flex items-start">
        <FeatureIcon :is-popular="isPopular" />
        <span :class="isPopular ? 'text-white' : 'text-gray-700'">
          Pengeluaran <span class="font-semibold">{{ formatNumber(packageData.expenses) }}</span>
        </span>
      </li>

      <li class="flex items-start">
        <FeatureIcon :is-popular="isPopular" />
        <span :class="isPopular ? 'text-white' : 'text-gray-700'">
          Operasi <span class="font-semibold">{{ formatNumber(packageData.operation) }}</span>
        </span>
      </li>
    </ul>

    <!-- CTA Button -->
    <RouterLink
      to="/register"
      :class="[
        'block w-full text-center py-3 rounded-xl font-semibold transition shadow-md hover:shadow-lg',
        isPopular
          ? 'bg-white text-primary hover:bg-gray-100'
          : 'bg-primary text-white hover:bg-primary/90',
      ]"
    >
      {{ buttonText }}
    </RouterLink>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatRupiah, formatNumber } from '@/helpers/formatCurrency'
import FeatureIcon from './FeatureIcon.vue'

const props = defineProps({
  packageData: {
    type: Object,
    required: true,
  },
})

// Check if package is popular (pro package)
const isPopular = computed(() => props.packageData.package === 'pro')

// Format price
const formattedPrice = computed(() => formatRupiah(props.packageData.price))

// Format limit based on package type
const formatLimit = (value) => {
  if (value === 0) return 'Unlimited'
  return `Max. ${value}`
}

// Button text based on package
const buttonText = computed(() => {
  return props.packageData.package === 'free' ? 'Mulai Gratis' : 'Pilih Paket'
})
</script>
