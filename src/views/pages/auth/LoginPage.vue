<template>
  <div class="min-h-screen bg-base-200">
    <AuthNavbar />

    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-neutral mb-2">Masuk</h1>
            <p class="text-gray-600">Selamat datang kembali di Ku‑Money</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
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
                placeholder="Masukkan password"
                class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                required
              />
            </div>

            <!-- Forgot Password -->
            <div class="text-right">
              <a href="#" class="text-sm text-primary hover:underline">Lupa password?</a>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition shadow-md hover:shadow-lg"
            >
              Masuk
            </button>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Belum punya akun?
              <RouterLink to="/register" class="text-primary font-semibold hover:underline">
                Daftar sekarang
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
  email: '',
  password: '',
})

const handleLogin = () => {
  // TODO: Implement login logic
  console.log('Login data:', form.value)
  // router.push('/dashboard')
}
</script>
