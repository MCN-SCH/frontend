<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Setting } from '@element-plus/icons-vue'
import { useUserStore } from '~/store/user.js'
import { useCookie } from '#app'

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

const store = useUserStore()
const { index, destroy, resetPassword } = store
const userCookie = useCookie('user')
const actionLoading = ref(false)

// Resolve the authenticated user's ID from the user store. If your app keeps
// the logged-in account in a separate auth store, use that store here instead.
const currentUserId = computed(() => userCookie.value?.user.id || null)

const isCurrentUser = (user) => {
  if (!user) return false
  //userCookie.value
  return user.id === currentUserId.value
}

const data = ref(null)
const loading = ref(false)
const search = ref('')
const currentPage = ref(1)

const viewDialogVisible = ref(false)
const selectedUser = ref(null)

const deviceCookie = useCookie('device_id')
const deviceId = computed(() => deviceCookie.value)

// Role labels use the role values returned by the API.
const roleLabels = {
  1: 'Admin',
  2: 'Professor',
  3: 'Researcher',
  4: 'PhD Student',
  5: 'Master Student',
  6: 'Undergraduate Student',
  7: 'Alumni',
}

const statsRoleLabels = {
  PROFESSOR: 'Professor',
  RESEARCHER: 'Researcher',
  PHD_STUDENT: 'PhD Student',
  MASTER_STUDENT: 'Master Student',
  UNDERGRADUATE_STUDENT: 'Undergraduate Student',
  ALUMNI: 'Alumni',
}

// Support a plain data array and common paginated API response formats.
const users = computed(() => {
  if (Array.isArray(data.value)) {
    return data.value
  }

  if (Array.isArray(data.value?.users)) {
    return data.value.users
  }

  if (Array.isArray(data.value?.data)) {
    return data.value
  }

  return []
})

const pagination = computed(() => {
  if (data.value?.users?.data) {
    return data.value.users
  }

  if (data.value?.meta) {
    return data.value.meta
  }

  if (
    data.value?.data &&
    !Array.isArray(data.value.data) &&
    Array.isArray(data.value.data.data)
  ) {
    return data.value.data
  }

  return {}
})

const totalMembers = computed(
  () =>
    data.value?.stats?.total_members ??
    pagination.value.total ??
    users.value.length,
)

const fetchMembers = async (page = currentPage.value) => {
  loading.value = true
  currentPage.value = page

  try {
    data.value = await index({
      page,
      search: search.value,
    })
  } catch (error) {
    console.error('Failed to fetch members:', error)
    ElMessage.error('Failed to load members.')
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  fetchMembers(1)
}, 500)

watch(search, () => {
  debouncedSearch()
})

const createMember = () => {
  navigateTo(`/portal/${deviceId.value}/member-management/create`)
}

const viewMember = (user) => {
  selectedUser.value = user
  viewDialogVisible.value = true
}

const resetUserPassword = async (user) => {
  if (!user?.id || actionLoading.value) return

  try {
    await ElMessageBox.confirm(
      `Reset the password for ${user.member?.name || user.email || `user #${user.id}`}?`,
      'Confirm Password Reset',
      {
        confirmButtonText: 'Reset Password',
        cancelButtonText: 'Cancel',
        type: 'warning',
      },
    )

    actionLoading.value = true
    const response = await resetPassword(user.id)
    ElMessage.success(response?.message || 'Password reset successfully.')
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    console.error('Failed to reset password:', error)
    ElMessage.error(
      error?.response?.data?.message ||
        error?.message ||
        'Failed to reset password.',
    )
  } finally {
    actionLoading.value = false
  }
}

const removeUser = async (user) => {
  if (!user?.id || actionLoading.value) return

  // Prevent self-deletion in the UI and in the action handler.
  if (isCurrentUser(user)) {
    ElMessage.warning('You cannot remove your own account.')
    return
  }

  try {
    await ElMessageBox.confirm(
      `This will permanently delete the user account${user.email ? ` (${user.email})` : ` #${user.id}`}. This action cannot be undone.`,
      'Remove User',
      {
        confirmButtonText: 'Remove User',
        cancelButtonText: 'Cancel',
        type: 'warning',
        confirmButtonClass: 'el-button--danger',
      },
    )

    actionLoading.value = true
    await destroy(user.id)

    ElMessage.success('User removed successfully.')
    viewDialogVisible.value = false
    selectedUser.value = null

    const lastPage = pagination.value.last_page
    const targetPage =
      users.value.length === 1 && currentPage.value > 1
        ? currentPage.value - 1
        : currentPage.value

    await fetchMembers(
      lastPage && targetPage > lastPage ? lastPage : targetPage,
    )
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    console.error('Failed to remove user:', error)
    ElMessage.error(
      error?.response?.data?.message ||
        error?.message ||
        'Failed to remove user.',
    )
  } finally {
    actionLoading.value = false
  }
}

const refreshMembers = () => {
  fetchMembers(currentPage.value)
}

const formatDate = (date) => {
  if (!date) return '-'

  const parsedDate = new Date(date)

  return Number.isNaN(parsedDate.getTime()) ? '-' : parsedDate.toLocaleString()
}

const formatRole = (role) => {
  return roleLabels[role] || '-'
}

const formatStatRole = (role) => {
  return (
    statsRoleLabels[role] ||
    String(role)
      .replaceAll('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase())
  )
}

const isAccountActive = (user) => {
  return String(user?.status) === '1'
}

const isMemberActive = (user) => {
  return user?.member?.is_active === true
}

onMounted(() => {
  fetchMembers(1)
})
</script>

<template>
  <div class="p-4 md:p-6">
    <!-- Page Header -->
    <div
      class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Member Management</h1>
        <p class="mt-1 text-sm text-gray-500">
          Manage user accounts and member profiles.
        </p>
      </div>

      <el-button type="success" :icon="Plus" @click="createMember">
        Create Member
      </el-button>
    </div>

    <!-- Search and Actions -->
    <div
      class="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div class="flex flex-col gap-2 sm:flex-row">
        <el-input
          v-model="search"
          clearable
          placeholder="Search members..."
          class="!w-full sm:!w-72"
          :prefix-icon="Search"
          @keyup.enter="fetchMembers(1)"
        />

        <div class="flex gap-2">
          <el-button type="primary" :icon="Search" @click="fetchMembers(1)">
            Search
          </el-button>

          <el-button :icon="Refresh" :loading="loading" @click="refreshMembers">
            Refresh
          </el-button>
        </div>
      </div>
    </div>

    <!-- Members Table -->
    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="users"
        border
        stripe
        row-key="id"
        empty-text="No members found"
        class="w-full"
      >
        <!-- Actions -->
        <el-table-column
          label="Actions"
          width="90"
          fixed="right"
          align="center"
        >
          <template #default="{ row }">
            <el-dropdown trigger="click">
              <el-button circle aria-label="Member actions">
                <el-icon>
                  <Setting />
                </el-icon>
              </el-button>

              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="viewMember(row)">
                    View Details
                  </el-dropdown-item>

                  <el-dropdown-item
                    :disabled="actionLoading"
                    @click="resetUserPassword(row)"
                  >
                    Reset Password
                  </el-dropdown-item>

                  <el-dropdown-item
                    v-if="!isCurrentUser(row)"
                    divided
                    :disabled="actionLoading || isCurrentUser(row)"
                    @click="removeUser(row)"
                  >
                    <span class="text-red-600">
                      Remove User
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>

        <!-- Profile Photo -->
        <el-table-column label="Photo" width="90" align="center">
          <template #default="{ row }">
            <el-avatar :size="45" :src="row.member?.image || ''">
              {{ row.member?.name?.charAt(0) || '?' }}
            </el-avatar>
          </template>
        </el-table-column>

        <!-- Member Name -->
        <el-table-column label="Name" min-width="200">
          <template #default="{ row }">
            <div class="font-medium text-gray-900">
              {{ row.member?.name || 'No member profile' }}
            </div>
            <div v-if="!row.member" class="mt-1 text-xs text-gray-400">
              Profile not linked
            </div>
          </template>
        </el-table-column>

        <!-- Username -->
        <el-table-column label="Username" min-width="150">
          <template #default="{ row }">
            {{ row.member?.username || '-' }}
          </template>
        </el-table-column>

        <!-- Account Email -->
        <el-table-column label="Account Email" min-width="220">
          <template #default="{ row }">
            {{ row.email || '-' }}
          </template>
        </el-table-column>

        <!-- Account Phone -->
        <el-table-column label="Account Phone" min-width="150">
          <template #default="{ row }">
            {{ row.phone || '-' }}
          </template>
        </el-table-column>

        <!-- Role -->
        <el-table-column label="Role" min-width="165">
          <template #default="{ row }">
            <el-tag effect="plain">
              {{ formatRole(row.role) }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Account Status -->
        <el-table-column label="Account Status" width="145">
          <template #default="{ row }">
            <el-tag :type="isAccountActive(row) ? 'success' : 'danger'">
              {{ isAccountActive(row) ? 'Active' : 'Inactive' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- Affiliation -->
        <el-table-column label="Affiliation" min-width="150">
          <template #default="{ row }">
            {{ row.member?.affiliation || '-' }}
          </template>
        </el-table-column>

        <!-- Position -->
        <el-table-column label="Position" min-width="150">
          <template #default="{ row }">
            {{ row.member?.position || '-' }}
          </template>
        </el-table-column>

        <!-- Member Profile Status -->
        <el-table-column label="Profile Status" width="145">
          <template #default="{ row }">
            <el-tag
              v-if="row.member"
              :type="isMemberActive(row) ? 'success' : 'danger'"
            >
              {{ isMemberActive(row) ? 'Active' : 'Inactive' }}
            </el-tag>

            <el-tag v-else type="info"> No Profile </el-tag>
          </template>
        </el-table-column>
      </el-table>

      <!-- Pagination -->
      <div
        v-if="pagination.total != null && pagination.per_page"
        class="mt-6 flex justify-end overflow-x-auto"
      >
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="Number(pagination.total)"
          :page-size="Number(pagination.per_page)"
          :current-page="currentPage"
          @current-change="fetchMembers"
        />
      </div>
    </el-card>

    <!-- View Member Dialog -->
    <el-dialog
      v-model="viewDialogVisible"
      title="Member Information"
      width="700px"
      destroy-on-close
    >
      <template v-if="selectedUser">
        <!-- Profile Header -->
        <div class="mb-6 flex flex-col items-center">
          <el-avatar :size="100" :src="selectedUser.member?.image || ''">
            {{ selectedUser.member?.name?.charAt(0) || '?' }}
          </el-avatar>

          <div class="mt-3 text-xl font-semibold">
            {{ selectedUser.member?.name || 'No member profile' }}
          </div>

          <div class="text-gray-500">
            @{{ selectedUser.member?.username || '-' }}
          </div>

          <el-tag v-if="!selectedUser.member" class="mt-2" type="info">
            Profile Not Linked
          </el-tag>
        </div>

        <!-- Account and Profile Details -->
        <el-divider content-position="left"> Account Information </el-divider>

        <el-descriptions border :column="1">
          <el-descriptions-item label="User ID">
            {{ selectedUser.id ?? '-' }}
          </el-descriptions-item>

          <el-descriptions-item label="Email">
            {{ selectedUser.email || '-' }}
          </el-descriptions-item>

          <el-descriptions-item label="Phone">
            {{ selectedUser.phone || '-' }}
          </el-descriptions-item>

          <el-descriptions-item label="Role">
            {{ formatRole(selectedUser.role) }}
          </el-descriptions-item>

          <el-descriptions-item label="Account Status">
            <el-tag
              :type="isAccountActive(selectedUser) ? 'success' : 'danger'"
            >
              {{ isAccountActive(selectedUser) ? 'Active' : 'Inactive' }}
            </el-tag>
          </el-descriptions-item>
        </el-descriptions>

        <template v-if="selectedUser.member">
          <el-divider content-position="left"> Member Profile </el-divider>

          <el-descriptions border :column="1">
            <el-descriptions-item label="Member ID">
              {{ selectedUser.member.id ?? '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Name">
              {{ selectedUser.member.name || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Username">
              {{ selectedUser.member.username || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Member Email">
              {{ selectedUser.member.email || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Member Phone">
              {{ selectedUser.member.phone || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Position">
              {{ selectedUser.member.position || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Affiliation">
              {{ selectedUser.member.affiliation || '-' }}
            </el-descriptions-item>

            <el-descriptions-item label="Website">
              <a
                v-if="selectedUser.member.website"
                :href="selectedUser.member.website"
                target="_blank"
                rel="noopener noreferrer"
                class="text-blue-600 hover:underline"
              >
                {{ selectedUser.member.website }}
              </a>
              <span v-else>-</span>
            </el-descriptions-item>

            <el-descriptions-item label="Research Domains">
              {{
                (() => {
                  const domains = selectedUser.member.research_domains

                  if (Array.isArray(domains)) return domains.join(', ')
                  if (typeof domains === 'string') {
                    try {
                      const parsed = JSON.parse(domains)
                      return Array.isArray(parsed) ? parsed.join(', ') : domains
                    } catch {
                      return domains || '-'
                    }
                  }

                  return '-'
                })()
              }}
            </el-descriptions-item>

            <el-descriptions-item label="Join Date">
              {{ formatDate(selectedUser.member.join_date) }}
            </el-descriptions-item>

            <el-descriptions-item label="Leave Date">
              {{ formatDate(selectedUser.member.leave_date) }}
            </el-descriptions-item>

            <el-descriptions-item label="Profile Status">
              <el-tag
                :type="isMemberActive(selectedUser) ? 'success' : 'danger'"
              >
                {{ isMemberActive(selectedUser) ? 'Active' : 'Inactive' }}
              </el-tag>
            </el-descriptions-item>

            <el-descriptions-item label="Profile Created">
              {{ formatDate(selectedUser.member.created_at) }}
            </el-descriptions-item>
          </el-descriptions>
        </template>
      </template>

      <template #footer>
        <el-button @click="viewDialogVisible = false"> Close </el-button>

        <el-button
          v-if="!selectedUser.member"
          type="primary"
          @click="createMember"
        >
          Create Member Profile
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
:deep(.el-card) {
  border-radius: 12px;
}

:deep(.table-card .el-card__body) {
  padding: 16px;
}

:deep(.el-table th.el-table__cell) {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 600;
}

@media (max-width: 640px) {
  :deep(.table-card .el-card__body) {
    padding: 10px;
  }
}
</style>
