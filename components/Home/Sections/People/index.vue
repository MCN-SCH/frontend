<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  BookOpen,
  Briefcase,
  GraduationCap,
  Mail,
  Globe,
  Phone
} from 'lucide-vue-next'

const props = defineProps({
  labMembers: {
    type: Array,
    default: () => []
  }
})

const safeString = (value, fallback = '-') => {
  if (value === null || value === undefined || value === '') {
    return fallback
  }

  return String(value)
}

const safeNumber = (value, fallback = 0) => {
  const num = Number(value)

  return Number.isNaN(num)
    ? fallback
    : num
}

const formatDate = (date) => {
  if (!date) {
    return '-'
  }

  try {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return '-'
  }
}

const safeArray = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value

  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const members = computed(() => {
  return (props.labMembers || []).map(member => ({
    ...member,

    name: safeString(member?.name),
    position: safeString(member?.position),
    affiliation: safeString(member?.affiliation),

    total_publications: safeNumber(member?.total_publications),
    total_projects: safeNumber(member?.total_projects),

    research_domains: safeArray(member?.research_domains),
    academic_profiles: safeArray(member?.academic_profiles),

    image: member?.image || '',
    role: safeNumber(member?.role),
    is_active: Boolean(member?.is_active)
  }))
})

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const ROLE = {
  ADMIN: 1,
  PROFESSOR: 2,
  RESEARCHER: 3,
  PHD_STUDENT: 4,
  MASTER_STUDENT: 5,
  UNDERGRADUATE_STUDENT: 6,
  ALUMNI: 7
}

const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0
}

/*
|--------------------------------------------------------------------------
| Search & Tabs
|--------------------------------------------------------------------------
*/

const searchQuery = ref('')
const activeTab = ref('all')

const tabs = [
  { key: 'all', label: 'All Members' },
  { key: 'professor', label: 'Professors' },
  { key: 'researcher', label: 'Researchers' },
  { key: 'students', label: 'Students' },
  { key: 'alumni', label: 'Alumni' }
]

/*
|--------------------------------------------------------------------------
| Dialog
|--------------------------------------------------------------------------
*/

const dialogVisible = ref(false)
const selectedMember = ref(null)

const openDialog = (member) => {
  selectedMember.value = member
  dialogVisible.value = true
}

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const parseArray = (value) => {
  if (!value) return []

  if (Array.isArray(value)) {
    return value
  }

  try {
    return JSON.parse(value)
  } catch {
    return []
  }
}

const roleLabel = (role) => {
  const labels = {
    1: 'Administrator',
    2: 'Professor',
    3: 'Researcher',
    4: 'PhD Student',
    5: 'Master Student',
    6: 'Undergraduate Student',
    7: 'Alumni'
  }

  return labels[role] || 'Member'
}

const isProfessor = (member) =>
  Number(member.role) === ROLE.PROFESSOR

const isResearcher = (member) =>
  Number(member.role) === ROLE.RESEARCHER

const isStudent = (member) =>
  [
    ROLE.PHD_STUDENT,
    ROLE.MASTER_STUDENT,
    ROLE.UNDERGRADUATE_STUDENT
  ].includes(Number(member.role))

const isAlumni = (member) =>
  Number(member.role) === ROLE.ALUMNI

/*
|--------------------------------------------------------------------------
| Counts
|--------------------------------------------------------------------------
*/

const counts = computed(() => ({
  all: members.value.filter(m => m.role !== ROLE.ALUMNI).length,
  professor: members.value.filter(m => m.role === ROLE.PROFESSOR).length,
  researcher: members.value.filter(m => m.role === ROLE.RESEARCHER).length,
  students: members.value.filter(isStudent).length,
  alumni: members.value.filter(m => m.role === ROLE.ALUMNI).length
}))

/*
|--------------------------------------------------------------------------
| Filter
|--------------------------------------------------------------------------
*/

const filteredMembers = computed(() => {
  let list = [...members.value]

  list = list.filter(member => {
    switch (activeTab.value) {
      case 'professor':
        return isProfessor(member)

      case 'researcher':
        return isResearcher(member)

      case 'students':
        return isStudent(member)

      case 'alumni':
        return isAlumni(member)

      default:
        return !isAlumni(member)
    }
  })

  if (!searchQuery.value?.trim()) return list

  const keyword = searchQuery.value.toLowerCase()

  return list.filter(member =>
    (member.name || '').toLowerCase().includes(keyword) ||
    roleLabel(member.role).toLowerCase().includes(keyword) ||
    (member.position || '').toLowerCase().includes(keyword) ||
    (member.affiliation || '').toLowerCase().includes(keyword)
  )
})
/*
|--------------------------------------------------------------------------
| Sort
|--------------------------------------------------------------------------
*/

const sortedMembers = computed(() => {
  return [...filteredMembers.value].sort(
    (a, b) => (a.order ?? 0) - (b.order ?? 0)
  )
})
</script>

<template>
  <section
    id="team"
    class="relative py-12 md:py-16 overflow-hidden"
  >
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/10 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
      <div class="absolute inset-0 opacity-[0.03]">
        <div
          class="absolute inset-0"
          style="
            background-image:
            radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
            radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px);
            background-size: 60px 60px;
          "
        />
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4">

      <!-- Header -->
      <div class="text-center mb-10">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white">
          Meet Our Team
        </h2>

        <p class="text-gray-500 mt-2">
          Research Lab Members
        </p>
      </div>

      <!-- Search -->
      <div class="max-w-xl mx-auto mb-6 relative">
        <Search class="absolute left-3 top-3 w-5 h-5 text-gray-400" />

        <input
          v-model="searchQuery"
          placeholder="Search members..."
          class="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800"
        >
      </div>

      <!-- Tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">

        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition',
            activeTab === tab.key
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 border'
          ]"
        >
          {{ tab.label }}
          ({{ counts[tab.key] }})
        </button>

      </div>

      <!-- Members -->
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >

        <div
          v-for="member in sortedMembers"
          :key="member.username"
          class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
        >

          <!-- Image -->
          <div class="aspect-[4/5] bg-gray-100 overflow-hidden">

            <img
              v-if="member.image"
              :src="member.image"
              :alt="member.name"
              class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />

            <div
              v-else
              class="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2"
            >
              <Mail class="w-8 h-8 opacity-40" />
              <span class="text-sm">No Image</span>
            </div>

          </div>

          <!-- Content -->
          <div class="p-5">

            <div class="flex justify-end mb-2">

              <span
                class="text-xs px-2 py-1 rounded-full"
                :class="
                  member.is_active
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                "
              >
                {{ member.is_active ? 'Active' : 'Inactive' }}
              </span>

            </div>

            <h3 class="font-bold text-lg text-gray-900 dark:text-white leading-tight">
              {{ member.name }}
            </h3>

            <p class="text-blue-600 font-medium">
              {{ roleLabel(member.role) }}
            </p>

            <p
              v-if="member.affiliation"
              class="text-sm text-gray-500 mt-1"
            >
              {{ member.affiliation }}
            </p>

            <!-- Stats -->
            <div class="grid grid-cols-2 gap-4 mt-5 text-center">

              <div>
                <BookOpen class="mx-auto w-4 h-4 text-blue-500 mb-1" />

                <p class="font-semibold">
                  {{ member.total_publications }}
                </p>

                <p class="text-xs text-gray-500">
                  Publications
                </p>
              </div>

              <div>
                <Briefcase class="mx-auto w-4 h-4 text-green-500 mb-1" />

                <p class="font-semibold">
                  {{ member.total_projects }}
                </p>

                <p class="text-xs text-gray-500">
                  Projects
                </p>
              </div>

            </div>

            <button
              @click="openDialog(member)"
              class="mt-5 w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              View Profile
            </button>

          </div>

        </div>

      </div>

      <!-- Empty -->
      <div
        v-if="sortedMembers.length === 0"
        class="text-center py-10 text-gray-500"
      >
        No members found.
      </div>

      <!-- Dialog -->
      <el-dialog
        v-model="dialogVisible"
        width="850px"
        destroy-on-close
      >

        <div
          v-if="selectedMember"
          class="space-y-10"
        >

          <!-- Top -->
          <div class="flex flex-col md:flex-row gap-6">

            <img
              :src="selectedMember.image"
              class="w-56 h-72 object-cover rounded-xl shadow-lg"
            >

            <div class="flex-1">

              <h2 class="text-3xl font-bold">
                {{ selectedMember.name }}
              </h2>

              <p class="text-blue-600 text-lg">
                {{ roleLabel(selectedMember.role) }}
              </p>

              <p
                v-if="selectedMember.position"
                class="text-gray-600 mt-1"
              >
                {{ selectedMember.position }}
              </p>

              <p
                v-if="selectedMember.affiliation"
                class="text-gray-500"
              >
                {{ selectedMember.affiliation }}
              </p>

              <div class="grid grid-cols-2 gap-4 mt-6">

                <div>
                  <p class="text-gray-400 text-sm">
                    Publications
                  </p>

                  <p class="font-bold text-xl">
                    {{ selectedMember.total_publications }}
                  </p>
                </div>

                <div>
                  <p class="text-gray-400 text-sm">
                    Projects
                  </p>

                  <p class="font-bold text-xl">
                    {{ selectedMember.total_projects }}
                  </p>
                </div>

                <div v-if="selectedMember.join_date">
                  <p class="text-gray-400 text-sm">
                    Joined
                  </p>

                  <p>
                    {{ formatDate(selectedMember.join_date) }}
                  </p>
                </div>

              </div>

            </div>

          </div>

          <!-- Research Domains -->
          <div
            v-if="parseArray(selectedMember.research_domains).length"
          >
            <h3 class="font-semibold mb-3">
              Research Domains
            </h3>

            <div class="flex flex-wrap gap-2">

              <span
                v-for="domain in parseArray(selectedMember.research_domains)"
                :key="domain"
                class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
              >
                {{ domain }}
              </span>

            </div>
          </div>

          <!-- Academic Profiles -->
          <div
            v-if="parseArray(selectedMember.academic_profiles).length"
          >
            <h3 class="font-semibold mb-3">
              Academic Profiles
            </h3>

            <ul class="space-y-2">

              <li
                v-for="(profile,index) in parseArray(selectedMember.academic_profiles)"
                :key="index"
                class="p-3 rounded-lg border"
              >
                {{ profile }}
              </li>

            </ul>

          </div>

          <!-- Contact -->
          <div class="flex flex-wrap gap-3 pt-4 border-t">

            <a
              v-if="selectedMember.email"
              :href="`mailto:${selectedMember.email}`"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Email
            </a>

            <a
              v-if="selectedMember.phone"
              :href="`tel:${selectedMember.phone}`"
              class="px-4 py-2 border rounded-lg"
            >
              Phone
            </a>

            <a
              v-if="selectedMember.website"
              :href="selectedMember.website"
              target="_blank"
              class="px-4 py-2 border rounded-lg"
            >
              Website
            </a>

          </div>

        </div>

      </el-dialog>

    </div>
  </section>
</template>
