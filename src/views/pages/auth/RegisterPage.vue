<template>
  <div class="min-h-screen bg-base-200">
    <AuthNavbar />

    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-neutral mb-2">Daftar Akun</h1>
            <p class="text-gray-600">Mulai kelola keuangan dengan Ku‑Money</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Nama -->
            <div>
              <label for="name" class="block text-sm font-semibold text-neutral mb-2">
                Nama Lengkap
              </label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                placeholder="Masukkan nama lengkap"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-semibold text-neutral mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                placeholder="email@example.com"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-semibold text-neutral mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="Minimal 8 karakter"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition shadow-md hover:shadow-lg"
            >
              Daftar Sekarang
            </button>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Sudah punya akun?
              <RouterLink to="/login" class="text-primary font-semibold hover:underline">
                Masuk di sini
              </RouterLink>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AuthNavbar from '@/views/components/auth/AuthNavbar.vue'
// import { useRouter } from 'vue-router'

// const router = useRouter()

const form = ref({
  name: '',
  email: '',
  password: '',
})

const handleRegister = () => {
  // TODO: Implement register logic
  console.log('Register data:', form.value)
  // router.push('/dashboard')
}
</script>
