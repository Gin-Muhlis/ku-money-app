<template>
  <div class="min-h-screen bg-gray-100">
    <AuthNavbar />

    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Masuk</h1>
            <p class="text-gray-600">Selamat datang kembali di Ku‑Money</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <FormInput
              id="email"
              v-model="form.email"
              label="Email"
              type="email"
              placeholder="email@example.com"
              required
            />

            <!-- Password -->
            <FormInput
              id="password"
              v-model="form.password"
              label="Password"
              type="password"
              placeholder="Masukkan password"
              required
            />

            <!-- Forgot Password -->
            <div class="text-right">
              <a href="#" class="text-sm text-indigo-600 hover:underline">Lupa password?</a>
            </div>

            <!-- Submit Button -->
            <PrimaryButton
              type="submit"
              :is-loading="isLoading"
              loading-text="Masuk..."
              variant="rounded-xl"
            >
              Masuk
            </PrimaryButton>
          </form>

          <!-- Register Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Belum punya akun?
              <RouterLink to="/register" class="text-indigo-600 font-semibold hover:underline">
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
import { useAuth } from '@/composables/useAuth'
import AuthNavbar from '@/views/components/auth/AuthNavbar.vue'
import FormInput from '@/views/components/ui/FormInput.vue'
import PrimaryButton from '@/views/components/ui/PrimaryButton.vue'

const form = ref({
  email: '',
  password: '',
})

const { isLoading, handleLogin: handleLoginAuth } = useAuth()

const handleLogin = async () => {
  await handleLoginAuth(form.value)
}
</script>
