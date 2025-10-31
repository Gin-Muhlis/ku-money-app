<template>
  <div>
    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Pengaturan</h2>
      <p class="text-gray-600 mt-1">Kelola pengaturan akun Anda</p>
    </div>

    <!-- Update Password Card -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-800 mb-2">Ubah Password</h3>
        <p class="text-sm text-gray-600">Gunakan password yang kuat untuk keamanan akun Anda</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleUpdatePassword" class="space-y-5">
        <!-- Old Password -->
        <div>
          <label for="oldPassword" class="block text-sm font-semibold text-slate-800 mb-2">
            Password Lama
          </label>
          <input
            id="oldPassword"
            v-model="form.oldPassword"
            :type="showOldPassword ? 'text' : 'password'"
            placeholder="Masukkan password lama"
            class="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
            :class="{ 'border-red-500': errors.oldPassword }"
            required
          />
          <p v-if="errors.oldPassword" class="text-red-600 text-xs mt-1">
            {{ errors.oldPassword }}
          </p>
        </div>

        <!-- New Password -->
        <div>
          <label for="newPassword" class="block text-sm font-semibold text-slate-800 mb-2">
            Password Baru
          </label>
          <div class="relative">
            <input
              id="newPassword"
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              placeholder="Minimal 6 karakter"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              :class="{ 'border-red-500': errors.newPassword }"
              required
            />
            <button
              type="button"
              @click="showNewPassword = !showNewPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i :class="showNewPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.newPassword" class="text-red-600 text-xs mt-1">
            {{ errors.newPassword }}
          </p>
        </div>

        <!-- Confirm New Password -->
        <div>
          <label for="confirmPassword" class="block text-sm font-semibold text-slate-800 mb-2">
            Konfirmasi Password Baru
          </label>
          <div class="relative">
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Ulangi password baru"
              class="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition"
              :class="{ 'border-red-500': errors.confirmPassword }"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <i :class="showConfirmPassword ? 'mdi mdi-eye-off' : 'mdi mdi-eye'"></i>
            </button>
          </div>
          <p v-if="errors.confirmPassword" class="text-red-600 text-xs mt-1">
            {{ errors.confirmPassword }}
          </p>
        </div>

        <!-- Submit Button -->
        <div class="pt-4">
          <PrimaryButton
            type="submit"
            :is-loading="isLoading"
            loading-text="Menyimpan..."
            variant="rounded-xl"
            class="w-full"
          >
            Simpan Perubahan
          </PrimaryButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Swal from 'sweetalert2'
import { updatePassword } from '@/services/auth.service'
import PrimaryButton from '@/views/components/ui/PrimaryButton.vue'

const isLoading = ref(false)
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const errors = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const validateForm = () => {
  // Reset errors
  errors.oldPassword = ''
  errors.newPassword = ''
  errors.confirmPassword = ''

  let isValid = true

  // Validate old password
  if (!form.oldPassword) {
    errors.oldPassword = 'Password lama harus diisi'
    isValid = false
  }

  // Validate new password
  if (!form.newPassword) {
    errors.newPassword = 'Password baru harus diisi'
    isValid = false
  } else if (form.newPassword.length < 6) {
    errors.newPassword = 'Password baru minimal 6 karakter'
    isValid = false
  }

  // Validate confirm password
  if (!form.confirmPassword) {
    errors.confirmPassword = 'Konfirmasi password harus diisi'
    isValid = false
  } else if (form.newPassword !== form.confirmPassword) {
    errors.confirmPassword = 'Password baru dan konfirmasi password tidak sama'
    isValid = false
  }

  // Check if new password same as old password
  if (form.oldPassword && form.newPassword && form.oldPassword === form.newPassword) {
    errors.newPassword = 'Password baru harus berbeda dengan password lama'
    isValid = false
  }

  return isValid
}

const handleUpdatePassword = async () => {
  if (isLoading.value) return

  // Validate form
  if (!validateForm()) {
    return
  }

  try {
    isLoading.value = true

    await updatePassword({
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    })

    // Success
    Swal.fire({
      icon: 'success',
      title: 'Berhasil!',
      text: 'Password berhasil diperbarui',
      confirmButtonColor: '#4F46E5',
      timer: 2000,
      showConfirmButton: false,
    })

    // Reset form
    form.oldPassword = ''
    form.newPassword = ''
    form.confirmPassword = ''
    errors.oldPassword = ''
    errors.newPassword = ''
    errors.confirmPassword = ''
  } catch (error) {
    console.error('Error updating password:', error)

    // Handle specific error codes
    if (error.code === 'INVALID_OLD_PASSWORD') {
      errors.oldPassword = 'Password lama tidak benar'
    } else if (error.code === 'SAME_PASSWORD') {
      errors.newPassword = 'Password baru harus berbeda dengan password lama'
    } else if (error.details && Array.isArray(error.details)) {
      // Validation errors from backend
      error.details.forEach((detail) => {
        if (detail.field === 'newPassword') {
          errors.newPassword = detail.message
        } else if (detail.field === 'oldPassword') {
          errors.oldPassword = detail.message
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memperbarui Password',
        text: error.message || 'Terjadi kesalahan saat memperbarui password',
        confirmButtonColor: '#4F46E5',
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>
