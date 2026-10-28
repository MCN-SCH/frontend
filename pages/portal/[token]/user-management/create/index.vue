<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { navigateTo, useCookie } from '#app'
import { useUserStore } from '~/store/user.js'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const store = useUserStore()
const { register } = store
const deviceId = useCookie('device_id')

const saving = ref(false)
const formRef = ref(null)

const roleOptions = [
  { value: 1, label: 'Admin' },
  { value: 2, label: 'Professor' },
  { value: 3, label: 'Researcher' },
  { value: 4, label: 'PhD Student' },
  { value: 5, label: 'Master Student' },
  { value: 6, label: 'Undergraduate Student' },
  { value: 7, label: 'Alumni' },
]

// Use the role values defined by your Laravel backend.
const form = reactive({
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: null,
  status: true,
})

const rules = reactive({
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Enter a valid email address', trigger: 'blur' },
    {
      max: 255,
      message: 'Email cannot exceed 255 characters',
      trigger: 'blur',
    },
  ],
  phone: [
    { required: true, message: 'Phone is required', trigger: 'blur' },
    { max: 20, message: 'Phone cannot exceed 20 characters', trigger: 'blur' },
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    {
      min: 8,
      message: 'Password must be at least 8 characters',
      trigger: 'blur',
    },
  ],
  password_confirmation: [
    {
      required: true,
      message: 'Please confirm your password',
      trigger: 'blur',
    },
    {
      validator: (_rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error('Passwords do not match'))
        } else {
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  role: [
    { required: true, message: 'Please select a role', trigger: 'change' },
  ],
})

const getErrorMessage = (error) => {
  const data = error?.data || error?.response?._data

  // Laravel validation errors usually have this shape:
  // { message: "...", errors: { email: ["..."] } }
  if (data?.errors) {
    const firstError = Object.values(data.errors).flat()[0]
    if (firstError) return firstError
  }

  return (
    data?.message ||
    error?.message ||
    'An unexpected error occurred while creating the user.'
  )
}

const submit = async () => {
  if (!formRef.value || saving.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.warning('Please correct the validation errors.')
    return
  }

  saving.value = true

  try {
    const payload = {
      email: form.email.trim(),
      phone: form.phone.trim(),
      password: form.password,
      password_confirmation: form.password_confirmation,
      role: Number(form.role),
      status: Boolean(form.status),
    }

    // Assumes the store exposes register(payload) for the Laravel store endpoint.
    await register(payload)

    ElMessage.success('User created successfully')

    await navigateTo(`/portal/${deviceId.value}/user-management`)
  } catch (error) {
    ElMessage.error(getErrorMessage(error))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="min-h-screen overflow-y-auto p-6">
    <div class="mx-auto max-w-4xl">
      <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Create User</h1>
        <el-button @click="$router.back()">Back</el-button>
      </div>

      <el-card shadow="never">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
          @submit.prevent="submit"
        >
          <el-divider>User Account Information</el-divider>

          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-form-item label="Email" prop="email">
                <el-input
                  v-model="form.email"
                  type="email"
                  placeholder="email@example.com"
                  autocomplete="email"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Phone" prop="phone">
                <el-input
                  v-model="form.phone"
                  placeholder="Phone number"
                  autocomplete="tel"
                  clearable
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Password" prop="password">
                <el-input
                  v-model="form.password"
                  type="password"
                  placeholder="At least 8 characters"
                  autocomplete="new-password"
                  show-password
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item
                label="Confirm Password"
                prop="password_confirmation"
              >
                <el-input
                  v-model="form.password_confirmation"
                  type="password"
                  placeholder="Confirm password"
                  autocomplete="new-password"
                  show-password
                />
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Role" prop="role">
                <el-select
                  v-model="form.role"
                  placeholder="Select role"
                  class="w-full"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :xs="24" :sm="12">
              <el-form-item label="Account Status" prop="status">
                <div class="flex items-center gap-3">
                  <el-switch
                    v-model="form.status"
                    :active-value="true"
                    :inactive-value="false"
                    active-text="Active"
                    inactive-text="Inactive"
                  />
                </div>
              </el-form-item>
            </el-col>
          </el-row>

          <div class="mt-6 flex justify-end gap-2">
            <el-button :disabled="saving" @click="$router.back()">
              Cancel
            </el-button>

            <el-button type="primary" native-type="submit" :loading="saving">
              Create User
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
