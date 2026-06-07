<script setup>
import { ElMessage, ElNotification } from 'element-plus'
import { useAuthStore } from '~/store/auth.js'


const authStore = useAuthStore()
const { sendCode, verifyCode } = authStore

const otp = ref('')
const isVerifying = ref(false)
const isSending = ref(false)
const countdown = ref(0)
const countdownInterval = ref(null)

const handleSendCode = async () => {
  if (isSending.value || countdown.value > 0) return

  isSending.value = true

  try {
    await sendCode()

    startCountdown()

    ElNotification({
      title: 'OTP Sent',
      message: 'A 4-digit code has been sent to your Telegram.',
      type: 'success',
      duration: 5000
    })
  } catch (error) {
    console.error(error)
    ElMessage.error('Failed to send OTP. Please try again.')
  } finally {
    isSending.value = false
  }
}

const verifyOtp = async () => {
  if (!otp.value || otp.value.length !== 4) {
    ElMessage.error('Please enter a valid 4-digit code.')
    return
  }

  isVerifying.value = true

  try {
    await verifyCode({
      code: otp.value
    })

    ElNotification({
      title: 'Verified',
      message: 'Verification successful!',
      type: 'success'
    })

    navigateTo('/portal')
  } catch (error) {
    console.error(error)
  } finally {
    isVerifying.value = false
  }
}

const startCountdown = () => {
  clearCountdown()

  countdown.value = 30

  countdownInterval.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearCountdown()
    }
  }, 1000)
}

const clearCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
    countdownInterval.value = null
  }
}

onUnmounted(() => {
  clearCountdown()

  const deviceCookie = useCookie('device_id')
  const deviceId = deviceCookie.value

  if (!deviceId) {
    ElMessage.error('User information not found. Please log in again.')
    navigateTo('/portal')
  }

})
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
  >
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
        OTP Verification
      </h2>

      <p class="mt-2 text-center text-sm text-gray-600">
        Enter the verification code sent to your Telegram account.
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <div class="space-y-6">
          <div>
            <label
              for="otp"
              class="block text-sm font-medium text-gray-700"
            >
              Enter 4-digit code
            </label>

            <div class="mt-2">
              <el-input
                id="otp"
                v-model="otp"
                type="text"
                maxlength="4"
                size="large"
                placeholder="••••"
                @keyup.enter="verifyOtp"
              />
            </div>
          </div>

          <el-button
            type="primary"
            size="large"
            class="w-full"
            :loading="isVerifying"
            @click="verifyOtp"
          >
            Verify
          </el-button>

          <div class="text-center text-sm">
            <button
              type="button"
              :disabled="countdown > 0 || isSending"
              class="font-medium text-primary-600 hover:text-primary-500 disabled:text-gray-400 disabled:cursor-not-allowed"
              @click="handleSendCode"
            >
              <span v-if="countdown > 0">
                Resend in {{ countdown }}s
              </span>
              <span v-else-if="isSending">
                Sending...
              </span>
              <span v-else>
                Resend Code
              </span>
            </button>
          </div>

          <div class="text-center text-sm text-gray-500">
            Didn't receive the code? Check your Telegram and try resending it.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-input__inner) {
  letter-spacing: 0.5em;
  text-indent: 0.5em;
  font-family: monospace;
  font-size: 1.25rem;
  text-align: center;
}
</style>
