<script setup>
import { ref } from 'vue'
import { ElButton, ElCard, ElInput, ElDivider, ElMessage } from 'element-plus'
import { Lock, User } from 'lucide-vue-next'
import { useAuthStore } from '~/store/auth.js'

definePageMeta({
  layout: 'auth',
  middleware: ['redirect-if-authenticated']
})

const form = ref({
  username: '',
  password: '',
  remember: false
})

const loading = ref(false)

const authStore = useAuthStore()
const { login } = authStore

const handleLogin = async () => {
  return await login({
    email: form.value.username,
    password: form.value.password
  })
}

const goToAdminPage = async () => {
  loading.value = true

  try {
    await handleLogin()

    const deviceCookie = useCookie('device_id')

    const deviceId = deviceCookie.value

    console.log('device:', deviceId)


    ElMessage.success('Login successful')
    loading.value = false

    navigateTo(`/portal/otp`)
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden
    bg-gradient-to-br from-slate-100 via-white to-slate-200
    dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 transition-colors duration-300"
  >
    <!-- Background Glow -->
    <div
      class="absolute top-[-100px] left-[-100px] w-[300px] h-[300px]
      bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full"
    />

    <div
      class="absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px]
      bg-cyan-500/10 dark:bg-cyan-500/20 blur-3xl rounded-full"
    />

    <!-- Login Card -->
    <ElCard
      shadow="never"
      class="w-full max-w-md rounded-3xl overflow-hidden
      border border-black/5 dark:border-white/10
      bg-white/80 dark:bg-white/5
      backdrop-blur-xl transition-all duration-300"
    >
      <template #header>
        <div class="flex flex-col items-center text-center gap-4 py-2">
          <img
            src="@/assets/image/logo/mcn.svg"
            alt="MCN Lab Logo"
            class="h-10 md:h-12 w-auto"
          />

          <div>
            <h1
              class="text-2xl font-bold text-slate-800 dark:text-white"
            >
              Access Portal
            </h1>

            <p
              class="text-slate-500 dark:text-slate-400 mt-1 text-sm"
            >
              Sign in to access the secure portal
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-5">
        <!-- Username -->
        <div>
          <label
            class="text-sm text-slate-700 dark:text-slate-300 mb-2 block"
          >
            Username
          </label>

          <ElInput
            v-model="form.username"
            placeholder="Enter your username"
            size="large"
            class="custom-input"
            type="text"
          >
            <template #prefix>
              <User class="w-4 h-4 text-slate-400" />
            </template>
          </ElInput>
        </div>

        <!-- Password -->
        <div>
          <label
            class="text-sm text-slate-700 dark:text-slate-300 mb-2 block"
          >
            Password
          </label>

          <ElInput
            v-model="form.password"
            type="password"
            show-password
            placeholder="Enter your password"
            size="large"
            class="custom-input"
          >
            <template #prefix>
              <Lock class="w-4 h-4 text-slate-400" />
            </template>
          </ElInput>
        </div>

        <!-- Login Button -->
        <ElButton
          type="primary"
          size="large"
          :loading="loading"
          class="w-full !h-12 !rounded-xl
          !bg-indigo-600 hover:!bg-indigo-500
          !border-none !text-white !font-semibold"
          @keyup.enter="goToAdminPage"
          @click="goToAdminPage"
        >
          Login
        </ElButton>

        <ElDivider border-style="dashed">
          <span class="text-slate-400 text-xs ">
            Protected Access
          </span>
        </ElDivider>

        <!-- Footer -->
        <div
          class="text-center text-sm text-slate-500 dark:text-slate-400"
        >
          © 2026 Secure MCN Lab
        </div>
      </div>
    </ElCard>
  </div>
</template>

<style scoped>
/* Input Wrapper */
:deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.7);
  border-radius: 14px;
  box-shadow: none !important;
  border: 1px solid rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

/* Dark Mode */
.dark :deep(.el-input__wrapper) {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

/* Hover */
:deep(.el-input__wrapper:hover) {
  border-color: rgba(99, 102, 241, 0.5);
}

/* Focus */
:deep(.el-input__wrapper.is-focus) {
  border-color: rgb(99, 102, 241);
}

/* Input Text */
:deep(.el-input__inner) {
  color: #0f172a !important;
  -webkit-text-fill-color: #0f172a !important;
}

/* Dark Input Text */
.dark :deep(.el-input__inner) {
  color: white !important;
  -webkit-text-fill-color: white !important;
}

/* Placeholder */
:deep(.el-input__inner::placeholder) {
  color: #94a3b8;
}

/* Password Eye Icon */
:deep(.el-input__password svg) {
  color: #94a3b8;
}

/* Remove Weird Autofill Background */
:deep(input:-webkit-autofill),
:deep(input:-webkit-autofill:hover),
:deep(input:-webkit-autofill:focus),
:deep(input:-webkit-autofill:active) {
  -webkit-box-shadow: 0 0 0 30px transparent inset !important;
  transition: background-color 9999s ease-in-out 0s;
}
</style>
