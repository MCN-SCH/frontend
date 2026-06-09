<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { usePublicationStore } from '~/store/publication.js'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const store = usePublicationStore()
const { register } = store

const saving = ref(false)
const deviceCookie = useCookie('device_id')
const deviceId = deviceCookie.value

// Publication type options
const typeOptions = [
  { value: 'journal', label: 'Journal' },
  { value: 'conference', label: 'Conference' },
  { value: 'chapter', label: 'Book Chapter' },
  { value: 'book', label: 'Book' },
]

// Badge options
const badgeOptions = [
  { value: 'International Journal', label: 'International Journal' },
  { value: 'International Conference', label: 'International Conference' },
  { value: 'Domestic Journal', label: 'Domestic Journal' },
  { value: 'Domestic Conference', label: 'Domestic Conference' },
]

const formRef = ref(null)

const form = ref({
  title: '',
  slug: '',
  badge: '',
  type: '',
  journal: '',
  publisher: '',
  date: '',
  doi: '',
  url: '',
  abstract: '',
  keywords: '',
  pdf: '',
  citations: 0,
  is_featured: false,
  order: 0,
  authors: [
    {
      member_id: null,
      author_name: '',
      affiliation: '',
      author_order: 1
    }
  ]
})

// Auto-generate slug from title
const generateSlug = (title) => {
  if (!title) return ''
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/--+/g, '-') // Replace multiple hyphens
    .trim()
}

// Watch title to auto-generate slug
watch(() => form.value.title, (newTitle) => {
  if (newTitle && !form.value.slug) {
    form.value.slug = generateSlug(newTitle)
  }
})

// Add author
const addAuthor = () => {
  form.value.authors.push({
    member_id: null,
    author_name: '',
    affiliation: '',
    author_order: form.value.authors.length + 1
  })
}

// Remove author
const removeAuthor = (index) => {
  if (form.value.authors.length === 1) {
    ElMessage.warning('At least one author is required')
    return
  }
  form.value.authors.splice(index, 1)
  // Reorder remaining authors
  form.value.authors.forEach((author, idx) => {
    author.author_order = idx + 1
  })
}

// Move author up
const moveAuthorUp = (index) => {
  if (index === 0) return
  const temp = form.value.authors[index]
  form.value.authors[index] = form.value.authors[index - 1]
  form.value.authors[index - 1] = temp
  // Update orders
  form.value.authors.forEach((author, idx) => {
    author.author_order = idx + 1
  })
}

// Move author down
const moveAuthorDown = (index) => {
  if (index === form.value.authors.length - 1) return
  const temp = form.value.authors[index]
  form.value.authors[index] = form.value.authors[index + 1]
  form.value.authors[index + 1] = temp
  // Update orders
  form.value.authors.forEach((author, idx) => {
    author.author_order = idx + 1
  })
}

// Validation rules
const rules = reactive({
  title: [
    { required: true, message: 'Title is required', trigger: 'blur' },
    { min: 3, message: 'Title must be at least 3 characters', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: 'Slug is required', trigger: 'blur' }
  ],
  type: [
    { required: true, message: 'Publication type is required', trigger: 'change' }
  ],
  journal: [
    { required: true, message: 'Journal/Conference name is required', trigger: 'blur' }
  ],
  date: [
    { required: true, message: 'Publication date is required', trigger: 'change' }
  ],
  doi: [
    { pattern: /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i, message: 'Invalid DOI format', trigger: 'blur' }
  ],
  url: [
    { type: 'url', message: 'Invalid URL format', trigger: 'blur' }
  ]
})

// Validate authors
const validateAuthors = () => {
  for (let i = 0; i < form.value.authors.length; i++) {
    const author = form.value.authors[i]
    if (!author.author_name || author.author_name.trim() === '') {
      ElMessage.warning(`Author ${i + 1} name is required`)
      return false
    }
  }
  return true
}

const submit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) {
      ElMessage.warning('Please correct the validation errors before submitting.')
      return
    }

    if (!validateAuthors()) {
      return
    }

    saving.value = true

    try {
      // Prepare payload
      const payload = {
        title: form.value.title,
        slug: form.value.slug,
        badge: form.value.badge,
        type: form.value.type,
        journal: form.value.journal,
        publisher: form.value.publisher || null,
        date: form.value.date,
        doi: form.value.doi || null,
        url: form.value.url || null,
        abstract: form.value.abstract || null,
        keywords: form.value.keywords || null,
        pdf: form.value.pdf || null,
        citations: form.value.citations || 0,
        is_featured: form.value.is_featured || false,
        order: form.value.order || 0,
        authors: form.value.authors
      }

      await register(payload)
      ElMessage.success('Publication created successfully')
      navigateTo(`/portal/${deviceId}/publication`)

    } catch (error) {
      const errorMsg = error.response?._data?.message || error.message || 'Failed to create publication'
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
        <h1 class="text-2xl font-bold">Create Publication</h1>
        <el-button @click="$router.back()">Back</el-button>
      </div>

      <el-card shadow="never">
        <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-position="top"
        >
          <el-divider>Publication Information</el-divider>

          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="Title" prop="title">
                <el-input
                  v-model="form.title"
                  type="textarea"
                  :rows="3"
                  placeholder="Enter publication title"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Slug" prop="slug">
                <el-input
                  v-model="form.slug"
                  placeholder="url-friendly-version"
                >
                  <template #append>
                    <el-button @click="form.slug = generateSlug(form.title)">
                      Generate
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Publication Type" prop="type">
                <el-select v-model="form.type" placeholder="Select type" style="width: 100%">
                  <el-option
                    v-for="item in typeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Badge/Category">
                <el-select v-model="form.badge" placeholder="Select badge" clearable style="width: 100%">
                  <el-option
                    v-for="item in badgeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Journal / Conference Name" prop="journal">
                <el-input v-model="form.journal" placeholder="e.g., IEEE Transactions, MDPI Sensors" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Publisher">
                <el-input v-model="form.publisher" placeholder="Publisher name (optional)" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Publication Date" prop="date">
                <el-date-picker
                  v-model="form.date"
                  type="date"
                  placeholder="Select date"
                  value-format="YYYY-MM-DD"
                  style="width: 100%"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="DOI">
                <el-input v-model="form.doi" placeholder="10.1016/j.comnet.2024.110123" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="URL">
                <el-input v-model="form.url" placeholder="https://doi.org/..." />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Abstract">
                <el-input
                  v-model="form.abstract"
                  type="textarea"
                  :rows="5"
                  placeholder="Publication abstract"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item label="Keywords">
                <el-input
                  v-model="form.keywords"
                  placeholder="Enter keywords separated by commas"
                />
                <div class="text-gray-400 text-xs mt-1">
                  Example: deep learning, edge computing, 5G networks
                </div>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="PDF URL">
                <el-input v-model="form.pdf" placeholder="https://example.com/paper.pdf" />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="Citations">
                <el-input-number v-model="form.citations" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>

            <el-col :span="6">
              <el-form-item label="Display Order">
                <el-input-number v-model="form.order" :min="0" style="width: 100%" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="Featured Publication">
                <el-switch v-model="form.is_featured" />
                <span class="ml-2 text-gray-500 text-sm">Show this publication as featured</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-divider>Authors</el-divider>

          <div class="authors-section">
            <div
              v-for="(author, index) in form.authors"
              :key="index"
              class="author-item mb-4 p-4 border rounded-lg"
            >
              <div class="flex justify-between items-start mb-3">
                <h3 class="text-md font-semibold">Author {{ author.author_order }}</h3>
                <div class="flex gap-2">
                  <el-button
                    size="small"
                    :disabled="index === 0"
                    @click="moveAuthorUp(index)"
                  >
                    ↑ Up
                  </el-button>
                  <el-button
                    size="small"
                    :disabled="index === form.authors.length - 1"
                    @click="moveAuthorDown(index)"
                  >
                    ↓ Down
                  </el-button>
                  <el-button
                    size="small"
                    type="danger"
                    :icon="Delete"
                    circle
                    @click="removeAuthor(index)"
                  />
                </div>
              </div>

              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item
                    label="Author Name"
                    :prop="`authors.${index}.author_name`"
                    :rules="[{ required: true, message: 'Author name is required' }]"
                  >
                    <el-input
                      v-model="author.author_name"
                      placeholder="Full name"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="6">
                  <el-form-item label="Member ID (Optional)">
                    <el-input-number
                      v-model="author.member_id"
                      :min="1"
                      placeholder="System user ID"
                      style="width: 100%"
                    />
                  </el-form-item>
                </el-col>

                <el-col :span="10">
                  <el-form-item label="Affiliation">
                    <el-input
                      v-model="author.affiliation"
                      placeholder="University or organization"
                    />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>

            <el-button
              type="primary"
              plain
              :icon="Plus"
              @click="addAuthor"
              class="mt-2"
            >
              Add Author
            </el-button>
          </div>

          <div class="flex justify-end gap-2 mt-6 pt-4 border-t">
            <el-button @click="$router.back()">Cancel</el-button>
            <el-button type="primary" :loading="saving" @click="submit">
              Create Publication
            </el-button>
          </div>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<style scoped>
.author-item {
  background-color: #fafafa;
  transition: all 0.2s;
}

.author-item:hover {
  background-color: #f5f7fa;
  border-color: #409eff;
}

:deep(.el-divider__text) {
  font-weight: 600;
  font-size: 16px;
}
</style>
