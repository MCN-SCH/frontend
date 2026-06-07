<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { navigateTo, useCookie } from '#app'
import { useAuthStore } from '~/store/auth.js'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const store = useAuthStore()
// Destructuring 'create' assuming your store handles POST requests via a create/store method
const { register } = store

const saving = ref(false)
const deviceCookie = useCookie('device_id')
const deviceId = deviceCookie.value

const roleOptions = [
  { value: '1', label: 'Admin' },
  { value: '2', label: 'Professor' },
  { value: '3', label: 'Researcher' },
  { value: '4', label: 'PhD Student' },
  { value: '5', label: 'Master Student' },
  { value: '6', label: 'Undergraduate Student' },
  { value: '7', label: 'Alumni' },
]

const formRef = ref(null)

const form = ref({
  email: '',
  phone: '',
  password: '',
  password_confirmation: '',
  role: '',
  status: '1',
  member: {
    name: '',
    username: '',
    position: '',
    affiliation: '',
    research_domains: [],
    website: '',
    academic_profiles: [],
    join_date: '',
    image: '',
    imageFile: null,
    is_active: true,
    order: 0,
  },
})

// Custom validator to match Laravel's 'confirmed' rule for passwords
const validatePasswordConfirm = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== form.value.password) {
    callback(new Error("Password confirmation doesn't match!"))
  } else {
    callback()
  }
}

const rules = reactive({
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email address', trigger: ['blur', 'change'] },
    { max: 255, message: 'Email cannot exceed 255 characters', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Phone is required', trigger: 'blur' },
    { max: 20, message: 'Phone cannot exceed 20 characters', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Password is required', trigger: 'blur' },
    { min: 8, message: 'Password must be at least 8 characters', trigger: 'blur' }
  ],
  password_confirmation: [
    { required: true, message: 'Password confirmation is required', trigger: 'blur' },
    { validator: validatePasswordConfirm, trigger: 'blur' }
  ],
  role: [
    { required: true, message: 'Role is required', trigger: 'change' },
  ],
  'member.name': [
    { required: true, message: 'Name is required', trigger: 'blur' },
    { max: 255, message: 'Name cannot exceed 255 characters', trigger: 'blur' }
  ],
  'member.username': [
    { required: true, message: 'Username is required', trigger: 'blur' },
    { max: 255, message: 'Username cannot exceed 255 characters', trigger: 'blur' },
    {
      pattern: /^[a-zA-Z0-9_-]+$/,
      message: 'Only letters, numbers, dashes (-) and underscores (_) allowed',
      trigger: 'blur',
    },
  ],
  'member.position': [
    { max: 255, message: 'Position cannot exceed 255 characters', trigger: 'blur' }
  ],
  'member.affiliation': [
    { max: 255, message: 'Affiliation cannot exceed 255 characters', trigger: 'blur' }
  ],
  'member.website': [
    { type: 'url', message: 'Invalid website URL (must include http:// or https://)', trigger: ['blur', 'change'] },
    { max: 255, message: 'URL cannot exceed 255 characters', trigger: 'blur' }
  ]
})

const handleImageChange = (file) => {
  form.value.member.imageFile = file.raw
  const reader = new FileReader()
  reader.onload = (e) => {
    form.value.member.image = e.target.result
  }
  reader.readAsDataURL(file.raw)
}

const submit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('Please correct the validation errors before submitting.')
      return
    }

    saving.value = true

    try {
      const formData = new FormData()

      // User structures
      formData.append('email', form.value.email)
      formData.append('phone', form.value.phone)
      formData.append('password', form.value.password)
      formData.append('password_confirmation', form.value.password_confirmation)
      formData.append('role', form.value.role)
      formData.append('status', form.value.status)

      // Member structures
      formData.append('name', form.value.member.name)
      formData.append('username', form.value.member.username)
      formData.append('position', form.value.member.position || '')
      formData.append('affiliation', form.value.member.affiliation || '')
      formData.append('website', form.value.member.website || '')
      formData.append('join_date', form.value.member.join_date || '')

      formData.append(
        'research_domains',
        JSON.stringify(form.value.member.research_domains)
      )

      formData.append(
        'academic_profiles',
        JSON.stringify(form.value.member.academic_profiles)
      )

      // File Payload
      if (form.value.member.imageFile) {
        formData.append('image', form.value.member.imageFile)
      }

      await register(formData)
      ElMessage.success('Member created successfully')
      navigateTo(`/portal/${deviceId}/member-management`)

    } catch (error) {
      const errorMsg = error.response?._data?.message || error.message || 'Failed to create member'
      ElMessage.error(errorMsg)
    } finally {
      saving.value = false
    }
  })
}
</script>

<template>
  <div class="h-screen overflow-y-auto p-6">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Create Member</h1>
        <el-button @click="$router.back()">Back</el-button>
      </div>

      <el-card shadow="never">
        <el-divider>Profile Image</el-divider>

        <div class="flex flex-col mb-4">
          <el-image
            v-if="form.member.image"
            :src="form.member.image"
            class="mx-auto border border-gray-300 rounded"
            fit="cover"
            style="width: 150px; height: 150px"
          />
          <div v-else class="mx-auto border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50" style="width: 150px; height: 150px">
            <span class="text-gray-400 text-sm">No Image</span>
          </div>

          <el-upload
            :auto-upload="false"
            class="mx-auto mt-3"
            :show-file-list="false"
            accept="image/*"
            :on-change="handleImageChange"
          >
            <el-button type="primary">Select Image</el-button>
          </el-upload>
        </div>

        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
        >
          <el-divider>User Account Information</el-divider>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" placeholder="email@example.com" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Phone" prop="phone">
                <el-input v-model="form.phone" placeholder="Phone number" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Password" prop="password">
                <el-input v-model="form.password" type="password" show-password placeholder="Min 8 characters" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Confirm Password" prop="password_confirmation">
                <el-input v-model="form.password_confirmation" type="password" show-password placeholder="Repeat password" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Role" prop="role">
                <el-select v-model="form.role" placeholder="Select Role" style="width: 100%">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Status">
                <el-switch
                  v-model="form.status"
                  active-value="1"
                  inactive-value="0"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider>Profile Information</el-divider>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Name" prop="member.name">
                <el-input v-model="form.member.name" placeholder="Full name" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Username" prop="member.username">
                <el-input v-model="form.member.username" placeholder="Unique username" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Position" prop="member.position">
                <el-input v-model="form.member.position" placeholder="e.g., Professor, Researcher" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Affiliation" prop="member.affiliation">
                <el-input v-model="form.member.affiliation" placeholder="Organization or Lab Group" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Research Domains" prop="member.research_domains">
                <el-select
                  v-model="form.member.research_domains"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Type and press Enter to add research domains"
                  style="width: 100%"
                >
                  <el-option
                    v-for="domain in form.member.research_domains"
                    :key="domain"
                    :label="domain"
                    :value="domain"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Website" prop="member.website">
                <el-input v-model="form.member.website" placeholder="https://..." />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Join Date">
                <el-date-picker
                  v-model="form.member.join_date"
                  type="date"
                  placeholder="Select Date"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Academic Profiles" prop="member.academic_profiles">
                <el-select
                  v-model="form.member.academic_profiles"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="Type and press Enter to add profile links (Google Scholar, ORCID, etc.)"
                  style="width:100%"
                >
                  <el-option
                    v-for="profile in form.member.academic_profiles"
                    :key="profile"
                    :label="profile"
                    :value="profile"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Display Order">
                <el-input-number v-model="form.member.order" :min="0" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Profile Active">
                <el-switch v-model="form.member.is_active" />
              </el-form-item>
            </el-col>
          </el-row>

          <div class="flex justify-end gap-2 mt-6">
            <el-button @click="$router.back()">Cancel</el-button>
            <el-button type="primary" :loading="saving" @click="submit">
              Create Member
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
