<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRoute, navigateTo, useCookie } from '#app'
import { useMemberStore } from '~/store/member'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const route = useRoute()
const store = useMemberStore()
const { show, update } = store

const loading = ref(false)
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

// Mapped from backend validation requirements
const rules = {
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email address', trigger: ['blur', 'change'] },
    { max: 255, message: 'Email cannot exceed 255 characters', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Phone is required', trigger: 'blur' },
    { max: 20, message: 'Phone cannot exceed 20 characters', trigger: 'blur' }
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
  ],
  // //research_domains
  // 'member.research_domains': [
  //   { required: true, message: 'Research Domains is required', trigger: 'blur' },
  // ],
}

const form = ref({
  email: '',
  phone: '',
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

const handleImageChange = (file) => {
  form.value.member.imageFile = file.raw

  const reader = new FileReader()

  reader.onload = (e) => {
    form.value.member.image = e.target.result
  }

  reader.readAsDataURL(file.raw)
}

const fetchMember = async () => {
  loading.value = true

  try {
    const response = await show(route.params.id)

    form.value = {
      ...form.value, // Preserve default properties
      email: response.email,
      phone: response.phone,
      role: String(response.role), // Cast to string to match el-option values
      status: String(response.status),

      member: {
        name: response.member?.name || '',
        username: response.member?.username || '',
        position: response.member?.position || '',
        affiliation: response.member?.affiliation || '',
        research_domains: JSON.parse(response.member?.research_domains) || [],
        website: response.member?.website || '',
        academic_profiles: JSON.parse(response.member?.academic_profiles) || [],
        image: response.member?.image || '',
        is_active: response.member?.is_active ?? true,
        order: response.member?.order ?? 0,
      },
    }
  } finally {
    loading.value = false
  }
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

      // User
      formData.append('email', form.value.email)
      formData.append('phone', form.value.phone)
      formData.append('role', form.value.role)
      formData.append('status', form.value.status)

      // Member
      formData.append('member[name]', form.value.member.name)
      formData.append('member[username]', form.value.member.username)
      formData.append('member[position]', form.value.member.position || '')
      formData.append('member[affiliation]', form.value.member.affiliation || '')
      formData.append('member[website]', form.value.member.website || '')
      formData.append('member[join_date]', form.value.member.join_date || '')

      formData.append(
        'member[research_domains]',
        JSON.stringify(form.value.member.research_domains)
      )

      formData.append(
        'member[academic_profiles]',
        JSON.stringify(form.value.member.academic_profiles)
      )

      // Image
      if (form.value.member.imageFile) {
        formData.append(
          'member[image]',
          form.value.member.imageFile
        )
      }

      await update(route.params.id, formData)

      ElMessage.success('Member updated successfully')

      navigateTo(`/portal/${deviceId}/member-management`)
    } catch (error) {
      // ElMessage.error(error.message || 'Failed to update member')
    } finally {
      saving.value = false
    }
  })
}

onMounted(() => {
  fetchMember()
})
</script>

<template>
  <div class="h-screen overflow-y-auto p-6">
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Edit Member</h1>
        <el-button @click="$router.back()">Back</el-button>
      </div>

      <el-card v-loading="loading" shadow="never">
        <el-divider>Profile Image</el-divider>

        <div class="flex flex-col mb-4">
          <el-image
            v-if="form.member.image"
            :src="form.member.image"
            class="mx-auto border-gray-300"
            fit="cover"
            style="width: 150px; height: 150px"
          />

          <el-upload
            :auto-upload="false"
            class="mx-auto mt-2"
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
          <el-divider>User Information</el-divider>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="Email" prop="email">
                <el-input v-model="form.email" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Phone" prop="phone">
                <el-input v-model="form.phone" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Role" prop="role">
                <el-select v-model="form.role" placeholder="Select Role">
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
                <el-input v-model="form.member.name" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Username" prop="member.username">
                <el-input v-model="form.member.username" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Position" prop="member.position">
                <el-input v-model="form.member.position" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Affiliation" prop="member.affiliation">
                <el-input v-model="form.member.affiliation" />
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
                  placeholder="Add research domains"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Website" prop="member.website">
                <el-input v-model="form.member.website" placeholder="https://..." />
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
                  placeholder="Add profile URLs"
                  style="width:100%"
                />
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
              Update Member
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
