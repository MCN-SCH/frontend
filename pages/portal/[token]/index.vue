<script setup>
import { useDashboardStore } from '~/store/dashboard.js'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const dashboardStore = useDashboardStore()
const { getDashboard } = dashboardStore

const data = ref(null)
const loading = ref(false)

const fetchData = async () => {
  loading.value = true

  try {
    data.value = await getDashboard()
  } finally {
    loading.value = false
  }
}

const roleLabels = {
  PROFESSOR: 'Professor',
  RESEARCHER: 'Researcher',
  PHD_STUDENT: 'PhD Student',
  MASTER_STUDENT: 'Master Student',
  UNDERGRADUATE_STUDENT: 'Undergraduate Student',
  ALUMNI: 'Alumni',
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>
    <el-skeleton :loading="loading" animated>
      <template #default>
        <!-- Summary -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-gray-500 text-sm">Total Users</p>
              <h2 class="text-4xl font-bold text-blue-600 mt-2">
                {{ data?.total_users ?? 0 }}
              </h2>
            </div>
          </el-card>
        </div>

        <!-- Roles -->
        <el-card shadow="never">
          <template #header>
            <div class="font-semibold text-lg">User Roles Distribution</div>
          </template>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <el-card
              v-for="(count, role) in data?.group_roles"
              :key="role"
              shadow="hover"
            >
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-gray-500 text-sm">
                    {{ roleLabels[role] || role }}
                  </p>
                  <h3 class="text-2xl font-bold mt-1">
                    {{ count }}
                  </h3>
                </div>

                <el-tag :type="count > 0 ? 'success' : 'info'" size="large">
                  {{ count }}
                </el-tag>
              </div>
            </el-card>
          </div>
        </el-card>
      </template>
    </el-skeleton>
  </div>
</template>
