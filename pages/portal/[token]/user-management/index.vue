<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useDebounceFn } from '@vueuse/core'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus, Refresh, Search, Setting } from '@element-plus/icons-vue'
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

const viewDialogVisible = ref(false)
const selectedUser = ref(null)

// Fixed role labels to match the keys from your data
const roleLabels = {
  '1': 'Admin',
  '2': 'Professor',
  '3': 'Researcher',
  '4': 'PhD Student',
  '5': 'Master Student',
  '6': 'Undergraduate Student',
  '7': 'Alumni',
}

// Added mapping for statistics display
const statsRoleLabels = {
  'PROFESSOR': 'Professor',
  'RESEARCHER': 'Researcher',
  'PHD_STUDENT': 'PhD Student',
  'MASTER_STUDENT': 'Master Student',
  'UNDERGRADUATE_STUDENT': 'Undergraduate Student',
  'ALUMNI': 'Alumni',
}

const fetchMembers = async (page = currentPage.value) => {
  loading.value = true

  try {
    currentPage.value = page

    data.value = await index({
      page,
      search: search.value,
    })
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const debouncedSearch = useDebounceFn(() => {
  currentPage.value = 1
  fetchMembers()
}, 500)

watch(search, () => {
  debouncedSearch()
})

const users = computed(() => data.value?.users?.data || [])
const pagination = computed(() => data.value?.users || {})
const deviceCookie = useCookie('device_id')

const deviceId = deviceCookie.value

const createMember = () => {
  navigateTo(`/portal/${deviceId}/member-management/create`)
}

const viewMember = (user) => {
  selectedUser.value = user
  viewDialogVisible.value = true
}

const editMember = (user) => {
  navigateTo(`/portal/${deviceId}/member-management/${user.id}`)
}

const deleteMember = async (user) => {
  try {
    await ElMessageBox.confirm(
      `Delete ${user.member?.name || 'this member'}?`,
      'Warning',
      {
        type: 'warning',
      }
    )

    // await store.destroy(user.id)

    ElMessage.success('Member deleted')

    fetchMembers(currentPage.value)
  } catch {
    //
  }
}

onMounted(() => {
  fetchMembers()
})
</script>

<template>
  <div class="p-6">
    <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <h1 class="text-2xl font-bold">
        Member Management
      </h1>

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
            {{ data.stats.total_members }}
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
            {{ statsRoleLabels[role] || role.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()) }}
          </div>
          <div class="text-2xl font-semibold mt-2">
            {{ count }}
          </div>
        </div>
      </el-card>
    </div>

    <div class="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <el-input
          v-model="search"
          clearable
          placeholder="Search member..."
          style="width: 300px"
          :prefix-icon="Search"
        />

        <el-button
          type="primary"
          @click="fetchMembers"
          :icon="Search"
        >
          Search
        </el-button>
        <el-button
          type="primary"
          @click="fetchMembers"
          :icon="Refresh"
        >
          Refresh
        </el-button>
      </div>


      <el-button
        type="success"
        @click="createMember"
        :icon="Plus"
      >
        Create Member
      </el-button>
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
      <el-table-column
        label="Actions"
        width="90"
        fixed="right"
      >
        <template #default="{ row }">
          <el-dropdown trigger="click">
            <el-button circle>
              <el-icon>
                <Setting />
              </el-icon>
            </el-button>

            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="viewMember(row)">
                  View
                </el-dropdown-item>

                <el-dropdown-item @click="editMember(row)">
                  Edit
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>

      <!-- Avatar -->
      <el-table-column label="Photo" width="90">
        <template #default="{ row }">
          <el-avatar
            :size="45"
            :src="row.image || ''"
          />
        </template>
      </el-table-column>

      <!-- Name -->
      <el-table-column label="Name" min-width="200">
        <template #default="{ row }">
          {{ row.name || '-' }}
        </template>
      </el-table-column>

      <!-- Username -->
      <el-table-column label="Username" min-width="180">
        <template #default="{ row }">
          {{ row.username || '-' }}
        </template>
      </el-table-column>

      <!-- Email -->
      <el-table-column prop="email" label="Email" min-width="220" />

      <!-- Phone -->
      <el-table-column prop="phone" label="Phone" min-width="150" />

      <!-- Role -->
      <el-table-column label="Role" min-width="160">
        <template #default="{ row }">
          {{ roleLabels[row.role] || '-' }}
        </template>
      </el-table-column>

      <!-- Status -->
      <el-table-column label="Status" width="120">
        <template #default="{ row }">
          <el-tag :type="row.is_active ? 'success' : 'danger'">
            {{ row.is_active ? 'Active' : 'Inactive' }}
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

  <el-dialog
    v-model="viewDialogVisible"
    title="Member Information"
    width="700px"
  >
    <template v-if="selectedUser">
      <div class="flex flex-col items-center mb-6">
        <el-avatar
          :size="100"
          :src="selectedUser.image || ''"
        />

        <div class="text-xl font-semibold mt-3">
          {{ selectedUser.name || '-' }}
        </div>

        <div class="text-gray-500">
          @{{ selectedUser.username || '-' }}
        </div>
      </div>

      <el-descriptions
        border
        :column="1"
      >
        <el-descriptions-item label="Name">
          {{ selectedUser.name || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Username">
          {{ selectedUser.username || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Email">
          {{ selectedUser.email || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Phone">
          {{ selectedUser.phone || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Role">
          {{ roleLabels[selectedUser.role] || '-' }}
        </el-descriptions-item>

        <el-descriptions-item label="Status">
          <el-tag
            :type="selectedUser.is_active ? 'success' : 'danger'"
          >
            {{ selectedUser.is_active ? 'Active' : 'Inactive' }}
          </el-tag>
        </el-descriptions-item>

        <el-descriptions-item label="Created At">
          {{
            selectedUser.created_at
              ? new Date(selectedUser.created_at).toLocaleString()
              : '-'
          }}
        </el-descriptions-item>
      </el-descriptions>
    </template>

    <template #footer>
      <el-button @click="viewDialogVisible = false">
        Close
      </el-button>

      <el-button
        type="primary"
        @click="editMember(selectedUser)"
      >
        Edit Member
      </el-button>
    </template>
  </el-dialog>
</template>

<style scoped>
:deep(.el-card) {
  border-radius: 12px;
}
</style>
