<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useMemberStore } from '~/store/member.js'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const store = useMemberStore()
const { index } = store

const data = ref(null)
const loading = ref(false)

const search = ref('')
const currentPage = ref(1)
const pageSize = ref(10)


const fetchMembers = async (page = currentPage.value) => {
  loading.value = true

  try {
    currentPage.value = page

    data.value = await index({
      page: currentPage.value
    })
  } catch (err) {
    console.error('Failed to fetch members:', err)
  } finally {
    loading.value = false
  }
}

const users = computed(() => data.value?.users?.data || [])
const pagination = computed(() => data.value?.users || {})

onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Member Management</h1>

      <el-button type="primary" @click="fetchMembers"> Refresh </el-button>
    </div>

    <!-- Statistics -->
    <div
      v-if="data?.stats"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-6"
    >
      <el-card shadow="hover">
        <div class="text-center">
          <div class="text-gray-500 text-sm">Total Members</div>
          <div class="text-3xl font-bold mt-2">
            {{ data.stats.total_users }}
          </div>
        </div>
      </el-card>

      <el-card
        v-for="(count, role) in data.stats.group_roles"
        :key="role"
        shadow="hover"
      >
        <div class="text-center">
          <div class="text-gray-500 text-sm">
            {{ role.replaceAll('_', ' ') }}
          </div>
          <div class="text-2xl font-semibold mt-2">
            {{ count }}
          </div>
        </div>
      </el-card>
    </div>

    <!-- Table -->
    <el-table
      v-loading="loading"
      :data="users"
      border
      stripe
      empty-text="No members found"
    >
      <!-- Row Index -->
      <el-table-column label="#" width="70">
        <template #default="{ $index }">
          {{ (pagination.current_page - 1) * pagination.per_page + $index + 1 }}
        </template>
      </el-table-column>

      <!-- Avatar -->
      <el-table-column label="Photo" width="90">
        <template #default="{ row }">
          <el-avatar
            :size="45"
            :src="row.member?.image || ''"
          />
        </template>
      </el-table-column>

      <!-- Name -->
      <el-table-column label="Name" min-width="200">
        <template #default="{ row }">
          {{ row.member?.name || '-' }}
        </template>
      </el-table-column>

      <!-- Username -->
      <el-table-column label="Username" min-width="180">
        <template #default="{ row }">
          {{ row.member?.username || '-' }}
        </template>
      </el-table-column>

      <!-- Email -->
      <el-table-column prop="email" label="Email" min-width="220" />

      <!-- Phone -->
      <el-table-column prop="phone" label="Phone" min-width="150" />

      <!-- Role -->
      <el-table-column label="Role" min-width="160">
        <template #default="{ row }">
          {{
            {
              "1": "Admin",
              "2": "Professor",
              "3": "Researcher",
              "4": "PhD Student",
              "5": "Master Student",
              "6": "Undergraduate Student",
              "7": "Alumni",
            }[row.role] || '-'
          }}
        </template>
      </el-table-column>

      <!-- Status -->
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          <el-tag :type="row.status === '1' ? 'success' : 'danger'">
            {{ row.status === '1' ? 'Active' : 'Inactive' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- Created At -->
      <el-table-column label="Created At" min-width="180">
        <template #default="{ row }">
          {{ row.created_at ? new Date(row.created_at).toLocaleString() : '-' }}
        </template>
      </el-table-column>
    </el-table>


    <div class="flex justify-end mt-6">
      <el-pagination
        v-if="pagination.total > 0"
        layout="prev, pager, next"
        :total="pagination.total"
        :page-size="pagination.per_page"
        :current-page="currentPage"
        @current-change="fetchMembers"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(.el-card) {
  border-radius: 12px;
}
</style>
