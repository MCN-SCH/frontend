<script setup>
import { useDashboardStore } from '~/store/dashboard.js'
import { useCookie } from '#app'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const dashboardStore = useDashboardStore()
const { getDashboard } = dashboardStore

const data = ref(null)
const loading = ref(false)

// Get user data from cookie
const userCookie = useCookie('user')
const userData = computed(() => {
  if (userCookie.value) {
    try {
      return typeof userCookie.value === 'string'
        ? JSON.parse(userCookie.value)
        : userCookie.value
    } catch {
      return null
    }
  }
  return null
})

// Calculate login duration
const loginDuration = computed(() => {
  if (!userData.value?.device?.last_seen_at) return 'N/A'

  const lastSeen = new Date(userData.value.device.last_seen_at)
  const now = new Date()
  const diffMs = now - lastSeen
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays}d ${diffHours % 24}h ago`
  } else if (diffHours > 0) {
    return `${diffHours}h ${diffMins % 60}m ago`
  } else if (diffMins > 0) {
    return `${diffMins}m ago`
  } else {
    return 'Just now'
  }
})

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

const roleMap = {
  '1': 'Professor',
  '2': 'Researcher',
  '3': 'PhD Student',
  '4': 'Master Student',
  '5': 'Undergraduate Student',
  '6': 'Alumni',
}

const getRoleLabel = (roleId) => {
  return roleMap[roleId] || `Role ${roleId}`
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Dashboard</h1>

    <!-- User Profile Card -->
    <el-card shadow="hover" class="mb-6">
      <div class="flex items-center gap-6">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <el-avatar
            :size="80"
            :src="userData?.member?.image || '/default-avatar.png'"
            class="border-2 border-blue-500"
          />
        </div>

        <!-- User Info -->
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-semibold">
                {{ userData?.member?.name || 'Unknown User' }}
              </h2>
              <p class="text-gray-500 text-sm">
                @{{ userData?.member?.username || 'No username' }}
              </p>
            </div>
            <el-tag type="success" size="large" effect="plain">
              {{ getRoleLabel(userData?.member?.role) }}
            </el-tag>
          </div>

          <!-- Contact Info -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <span class="text-xs text-gray-400 block">Email</span>
              <span class="text-sm">{{ userData?.member?.email || userData?.user?.email || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Phone</span>
              <span class="text-sm">{{ userData?.member?.phone || userData?.user?.phone || 'N/A' }}</span>
            </div>
            <div>
              <span class="text-xs text-gray-400 block">Login Duration</span>
              <span class="text-sm font-medium text-blue-600">
                <el-icon><Timer /></el-icon>
                {{ loginDuration }}
              </span>
            </div>
          </div>

          <!-- Additional Info -->
          <div class="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-4">
            <div v-if="userData?.member?.affiliation">
              <span class="text-xs text-gray-400 block">Affiliation</span>
              <span class="text-sm">{{ userData.member.affiliation }}</span>
            </div>
            <div v-if="userData?.member?.position">
              <span class="text-xs text-gray-400 block">Position</span>
              <span class="text-sm">{{ userData.member.position }}</span>
            </div>
            <div v-if="userData?.device?.last_seen_at">
              <span class="text-xs text-gray-400 block">Last Active</span>
              <span class="text-sm">{{ new Date(userData.device.last_seen_at).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <!-- Summary Cards -->
    <el-skeleton :loading="loading" animated>
      <template #default>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-gray-500 text-sm">Total Users</p>
              <h2 class="text-4xl font-bold text-blue-600 mt-2">
                {{ data?.total_users ?? 0 }}
              </h2>
            </div>
          </el-card>
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-gray-500 text-sm">Total Publications</p>
              <h2 class="text-4xl font-bold text-blue-600 mt-2">
                {{ data?.total_publications ?? 0 }}
              </h2>
            </div>
          </el-card>
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-gray-500 text-sm">Total Projects</p>
              <h2 class="text-4xl font-bold text-blue-600 mt-2">
                {{ 0 }}
              </h2>
            </div>
          </el-card>
          <el-card shadow="hover">
            <div class="text-center">
              <p class="text-gray-500 text-sm">Total Events</p>
              <h2 class="text-4xl font-bold text-blue-600 mt-2">
                {{ 0 }}
              </h2>
            </div>
          </el-card>
        </div>

        <!-- Roles Distribution -->
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
