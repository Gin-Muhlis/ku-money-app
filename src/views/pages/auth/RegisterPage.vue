<template>
  <div class="min-h-screen bg-gray-100">
    <AuthNavbar />

    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="w-full max-w-md">
        <div class="bg-white rounded-2xl shadow-lg p-8">
          <!-- Header -->
          <div class="text-center mb-8">
            <h1 class="text-3xl font-extrabold text-slate-800 mb-2">Daftar Akun</h1>
            <p class="text-gray-600">Mulai kelola keuangan dengan Ku‑Money</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleRegister" class="space-y-5">
            <!-- Nama -->
            <FormInput
              id="name"
              v-model="form.name"
              label="Nama Lengkap"
              type="text"
              placeholder="Masukkan nama lengkap"
              required
            />

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
              placeholder="Minimal 8 karakter"
              required
            />

            <!-- Submit Button -->
            <PrimaryButton
              type="submit"
              :is-loading="isLoading"
              loading-text="Mendaftar..."
              variant="rounded-xl"
            >
              Daftar Sekarang
            </PrimaryButton>
          </form>

          <!-- Login Link -->
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              Sudah punya akun?
              <RouterLink to="/login" class="text-indigo-600 font-semibold hover:underline">
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthNavbar from '@/views/components/auth/AuthNavbar.vue'
import FormInput from '@/views/components/ui/FormInput.vue'
import PrimaryButton from '@/views/components/ui/PrimaryButton.vue'
import Swal from 'sweetalert2'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
})

const isLoading = ref(false)

const handleRegister = async () => {
  if (isLoading.value) return

  try {
    isLoading.value = true

    // Call register API
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    })

    // Save email to localStorage for verification page
    localStorage.setItem('pendingEmail', form.value.email)

    // Show success message
    await Swal.fire({
      icon: 'success',
      title: 'Registrasi Berhasil!',
      text: 'Silakan cek email Anda untuk verifikasi akun',
      confirmButtonColor: '#4F46E5',
    })

    // Redirect to verify email page
    router.push('/verify-email')
  } catch (error) {
    console.error('Register error:', error)
    Swal.fire({
      icon: 'error',
      title: 'Registrasi Gagal',
      text: error.message || 'Terjadi kesalahan saat mendaftar. Silakan coba lagi.',
      confirmButtonColor: '#4F46E5',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
