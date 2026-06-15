<script setup>
import { ref, computed } from 'vue'
import {
  Search,
  BookOpen,
  Briefcase,
  GraduationCap,
  Mail,
  Globe,
  Phone,
  User,
  Users,
  Award,
  Calendar,
  ExternalLink,
  Sparkles,
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserMinus,
  School,
  Microscope,
  Trophy,
  Star,
  Clock,
  Bookmark,
  FileText,
  Target,
  History,
  Building
} from 'lucide-vue-next'

const props = defineProps({
  labMembers: {
    type: Object,
    default: () => ({ professor: [], student: [], publication: [] })
  }
})

/*
|--------------------------------------------------------------------------
| Role Constants (匹配后端)
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
  const numRole = Number(role)
  return labels[numRole] || 'Member'
}

/*
|--------------------------------------------------------------------------
| Helper Functions
|--------------------------------------------------------------------------
*/

const safeString = (value, fallback = '-') => {
  if (value === null || value === undefined || value === '') return fallback
  return String(value)
}

const safeNumber = (value, fallback = 0) => {
  const num = Number(value)
  return Number.isNaN(num) ? fallback : num
}

const formatDate = (date) => {
  if (!date) return '-'
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
  if (typeof value === 'string' && value.trim().startsWith('[')) {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}

// Process member data
const processMember = (member) => {
  const userData = member.user || {}
  return {
    id: member.id || userData.id,
    name: safeString(member.name),
    username: safeString(member.username),
    email: safeString(member.email || userData.email),
    phone: safeString(member.phone || userData.phone),
    role: Number(member.role),
    position: safeString(member.position),
    affiliation: safeString(member.affiliation),
    total_publications: safeNumber(member.total_publications),
    total_projects: safeNumber(member.total_projects),
    research_domains: safeArray(member.research_domains),
    academic_profiles: safeArray(member.academic_profiles),
    image: member.image || '',
    join_date: member.join_date,
    leave_date: member.leave_date,
    website: member.website,
    is_active: member.is_active === true || member.is_active === '1' || member.is_active === 1,
    order: safeNumber(member.order),
    title: member.title || '',
    currentPositions: safeArray(member.currentPositions),
    education: safeArray(member.education),
    researchInterests: safeArray(member.researchInterests),
    profile: member.profile || '',
    experiences: safeArray(member.experiences)
  }
}

/*
|--------------------------------------------------------------------------
| Data Processing
|--------------------------------------------------------------------------
*/

const professorsFromArray = computed(() => {
  return (props.labMembers?.professor || []).map(processMember)
})

const allStudents = computed(() => {
  return (props.labMembers?.student || []).map(processMember)
})

const allMembers = computed(() => {
  return [...professorsFromArray.value, ...allStudents.value]
})

const professors = computed(() => {
  return allMembers.value
    .filter(m => m.role === ROLE.PROFESSOR)
    .sort((a, b) => a.order - b.order)
})

const researchers = computed(() => {
  return allMembers.value
    .filter(m => m.role === ROLE.RESEARCHER)
    .sort((a, b) => a.order - b.order)
})

const phdStudents = computed(() => {
  return allMembers.value
    .filter(m => m.role === ROLE.PHD_STUDENT)
    .sort((a, b) => a.order - b.order)
})

const masterStudents = computed(() => {
  return allMembers.value
    .filter(m => m.role === ROLE.MASTER_STUDENT)
    .sort((a, b) => a.order - b.order)
})

const undergraduateStudents = computed(() => {
  return allMembers.value
    .filter(m => m.role === ROLE.UNDERGRADUATE_STUDENT)
    .sort((a, b) => a.order - b.order)
})

const alumni = computed(() => {
  return allMembers.value
    .filter(m => m.role === ROLE.ALUMNI)
    .sort((a, b) => a.order - b.order)
})

/*
|--------------------------------------------------------------------------
| Search & Filter
|--------------------------------------------------------------------------
*/

const searchQuery = ref('')
const showAlumni = ref(false)

const filterBySearch = (members) => {
  if (!searchQuery.value?.trim()) return members
  const keyword = searchQuery.value.toLowerCase()
  return members.filter(member =>
    member.name.toLowerCase().includes(keyword) ||
    roleLabel(member.role).toLowerCase().includes(keyword) ||
    (member.position || '').toLowerCase().includes(keyword) ||
    (member.affiliation || '').toLowerCase().includes(keyword) ||
    (member.research_domains || []).some(d => d.toLowerCase().includes(keyword)) ||
    (member.researchInterests || []).some(i => i.toLowerCase().includes(keyword))
  )
}

const filteredProfessors = computed(() => filterBySearch(professors.value))
const filteredResearchers = computed(() => filterBySearch(researchers.value))
const filteredPhdStudents = computed(() => filterBySearch(phdStudents.value))
const filteredMasterStudents = computed(() => filterBySearch(masterStudents.value))
const filteredUndergraduateStudents = computed(() => filterBySearch(undergraduateStudents.value))
const filteredAlumni = computed(() => filterBySearch(alumni.value))

const totalResults = computed(() => {
  return filteredProfessors.value.length +
    filteredResearchers.value.length +
    filteredPhdStudents.value.length +
    filteredMasterStudents.value.length +
    filteredUndergraduateStudents.value.length +
    (showAlumni.value ? filteredAlumni.value.length : 0)
})

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
</script>

<template>
  <section
    id="team"
    class="relative py-12 md:py-20 overflow-hidden"
  >
    <!-- Background -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/10 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
      <div class="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]">
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

    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
          <Sparkles class="w-4 h-4" />
          <span>Our Team</span>
        </div>
        <h2 class="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Meet Our Research Lab
        </h2>
        <p class="text-gray-500 dark:text-gray-400 mt-3 max-w-2xl mx-auto">
          World-class researchers and brilliant students working together to advance the frontiers of knowledge
        </p>
      </div>

      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto mb-10 relative">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, position, research domain..."
            class="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all dark:text-white dark:placeholder:text-gray-400"
          >
        </div>
        <div v-if="searchQuery" class="text-center mt-2 text-sm text-gray-500 dark:text-gray-400">
          Found {{ totalResults }} member{{ totalResults !== 1 ? 's' : '' }}
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- PROFESSORS SECTION -->
      <!-- ============================================================ -->
      <div v-if="filteredProfessors.length > 0" class="mb-20">
        <div
          :class="filteredProfessors.length === 1
      ? 'flex justify-center'
      : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8'"
        >
          <div
            v-for="member in filteredProfessors"
            :key="member.id || member.username"
            :class="filteredProfessors.length === 1
        ? 'w-full max-w-8xl mx-auto'
        : ''"
            class="group bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer backdrop-blur-sm flex flex-col h-full"
            @click="openDialog(member)"
          >
            <div :class="filteredProfessors.length === 1
        ? 'flex flex-col lg:flex-row h-full'
        : 'flex flex-col h-full'"
            >
              <!-- Image Column -->
              <div :class="filteredProfessors.length === 1
          ? 'lg:w-1/3'
          : ''"
                   class="bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative"
              >
                <div class="aspect-[4/5] w-full">
                  <img
                    v-if="member.image"
                    :src="member.image"
                    :alt="member.name"
                    class="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500 gap-3">
                    <GraduationCap class="w-20 h-20 opacity-40" />
                    <span class="text-sm">No Image</span>
                  </div>
                </div>
                <div class="absolute top-3 left-3">
                  <div class="bg-amber-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star class="w-3 h-3" />
                    <span>Professor</span>
                  </div>
                </div>
                <div class="absolute top-3 right-3">
            <span
              class="text-xs px-2 py-1 rounded-full backdrop-blur-md"
              :class="member.is_active ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'"
            >
              {{ member.is_active ? 'Active' : 'Inactive' }}
            </span>
                </div>
              </div>

              <!-- Content Column - Using flex column to push button to bottom -->
              <div :class="filteredProfessors.length === 1
          ? 'lg:w-2/3 p-8 flex flex-col flex-1'
          : 'p-6 flex flex-col flex-1'"
              >
                <div class="flex-1">
                  <h3 :class="filteredProfessors.length === 1
              ? 'font-bold text-3xl text-gray-900 dark:text-white'
              : 'font-bold text-2xl text-gray-900 dark:text-white'"
                  >
                    {{ member.name }}
                  </h3>
                  <p class="text-blue-600 dark:text-blue-400 font-semibold text-base mt-1">
                    {{ member.title || roleLabel(member.role) }}
                  </p>

                  <!-- Current Positions -->
                  <div v-if="member.currentPositions?.length" class="mt-3 space-y-1">
                    <div v-for="(pos, idx) in member.currentPositions" :key="idx" class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Building class="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                      <span><strong>{{ pos.position }}</strong> at {{ pos.organization }}<span v-if="pos.department">, {{ pos.department }}</span></span>
                    </div>
                  </div>

                  <!-- Research Interests Preview -->
                  <div v-if="member.researchInterests?.length" class="mt-4">
                    <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Target class="w-3 h-3" /> Research Interests
                    </p>
                    <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="interest in member.researchInterests.slice(0, 5)"
                  :key="interest"
                  class="text-xs px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full font-medium"
                >
                  {{ interest }}
                </span>
                      <span v-if="member.researchInterests.length > 5" class="text-xs text-gray-400 dark:text-gray-500">
                  +{{ member.researchInterests.length - 5 }} more
                </span>
                    </div>
                  </div>

                  <!-- Stats -->
                  <div class="grid grid-cols-2 gap-5 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div class="text-center">
                      <BookOpen class="mx-auto w-5 h-5 text-blue-500 dark:text-blue-400 mb-2" />
                      <p class="font-bold text-2xl text-gray-800 dark:text-white">{{ member.total_publications }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Publications</p>
                    </div>
                    <div class="text-center">
                      <Briefcase class="mx-auto w-5 h-5 text-green-500 dark:text-green-400 mb-2" />
                      <p class="font-bold text-2xl text-gray-800 dark:text-white">{{ member.total_projects }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                    </div>
                  </div>
                </div>

                <!-- Button - Now aligned to bottom -->
                <button class="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition shadow-md hover:shadow-lg">
                  View Full Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- RESEARCHERS SECTION -->
      <!-- ============================================================ -->
      <div v-if="filteredResearchers.length > 0" class="mb-16">
        <div class="flex items-center gap-3 mb-6">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-md">
            <Microscope class="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 class="text-xl font-bold text-gray-800 dark:text-white">Researchers</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400">{{ filteredResearchers.length }} member{{ filteredResearchers.length !== 1 ? 's' : '' }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="member in filteredResearchers"
            :key="member.id"
            class="group bg-white dark:bg-gray-800/80 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            @click="openDialog(member)"
          >
            <div class="aspect-[4/5] bg-gradient-to-br from-purple-100 to-pink-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
              <img v-if="member.image" :src="member.image" :alt="member.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                <Microscope class="w-12 h-12 opacity-40" />
              </div>
            </div>
            <div class="p-5">
              <h3 class="font-bold text-xl text-gray-900 dark:text-white">{{ member.name }}</h3>
              <p class="text-purple-600 dark:text-purple-400 text-sm font-medium">Researcher</p>
              <div class="grid grid-cols-2 gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div class="text-center">
                  <BookOpen class="mx-auto w-4 h-4 text-blue-500 dark:text-blue-400 mb-1" />
                  <p class="font-semibold text-gray-800 dark:text-white">{{ member.total_publications }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Pubs</p>
                </div>
                <div class="text-center">
                  <Briefcase class="mx-auto w-4 h-4 text-green-500 dark:text-green-400 mb-1" />
                  <p class="font-semibold text-gray-800 dark:text-white">{{ member.total_projects }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- STUDENTS SECTION -->
      <!-- ============================================================ -->
      <div v-if="filteredPhdStudents.length > 0 || filteredMasterStudents.length > 0 || filteredUndergraduateStudents.length > 0" class="mb-16">
        <div class="flex items-center gap-3 mb-8">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <Users class="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white">Students</h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Next generation researchers</p>
          </div>
        </div>

        <!-- PhD Students -->
        <div v-if="filteredPhdStudents.length > 0" class="mb-10">
          <div class="flex items-center gap-2 mb-4">
            <GraduationCap class="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white">PhD Students</h4>
            <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-xs font-medium">
              {{ filteredPhdStudents.length }}
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              v-for="member in filteredPhdStudents"
              :key="member.id"
              class="group bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              @click="openDialog(member)"
            >
              <div class="aspect-[4/5] bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
                <img v-if="member.image" :src="member.image" :alt="member.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <User class="w-12 h-12 opacity-40" />
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white">{{ member.name }}</h3>
                <p class="text-emerald-600 dark:text-emerald-400 text-xs font-medium">PhD Student</p>
                <div class="flex justify-between mt-3 text-sm">
                  <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><BookOpen class="w-3 h-3" /> {{ member.total_publications }}</span>
                  <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Briefcase class="w-3 h-3" /> {{ member.total_projects }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Master Students -->
        <div v-if="filteredMasterStudents.length > 0" class="mb-10">
          <div class="flex items-center gap-2 mb-4">
            <School class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white">Master Students</h4>
            <span class="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-medium">
              {{ filteredMasterStudents.length }}
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              v-for="member in filteredMasterStudents"
              :key="member.id"
              class="group bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              @click="openDialog(member)"
            >
              <div class="aspect-[4/5] bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
                <img v-if="member.image" :src="member.image" :alt="member.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <User class="w-12 h-12 opacity-40" />
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white">{{ member.name }}</h3>
                <p class="text-blue-600 dark:text-blue-400 text-xs font-medium">Master Student</p>
                <div class="flex justify-between mt-3 text-sm">
                  <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><BookOpen class="w-3 h-3" /> {{ member.total_publications }}</span>
                  <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Briefcase class="w-3 h-3" /> {{ member.total_projects }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Undergraduate Students -->
        <div v-if="filteredUndergraduateStudents.length > 0">
          <div class="flex items-center gap-2 mb-4">
            <UserCheck class="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <h4 class="text-lg font-semibold text-gray-800 dark:text-white">Undergraduate Students</h4>
            <span class="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium">
              {{ filteredUndergraduateStudents.length }}
            </span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              v-for="member in filteredUndergraduateStudents"
              :key="member.id"
              class="group bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              @click="openDialog(member)"
            >
              <div class="aspect-[4/5] bg-gradient-to-br from-amber-100 to-orange-100 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
                <img v-if="member.image" :src="member.image" :alt="member.name" class="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <User class="w-12 h-12 opacity-40" />
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white">{{ member.name }}</h3>
                <p class="text-amber-600 dark:text-amber-400 text-xs font-medium">Undergraduate</p>
                <div class="flex justify-between mt-3 text-sm">
                  <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><BookOpen class="w-3 h-3" /> {{ member.total_publications }}</span>
                  <span class="flex items-center gap-1 text-gray-600 dark:text-gray-400"><Briefcase class="w-3 h-3" /> {{ member.total_projects }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================ -->
      <!-- ALUMNI SECTION -->
      <!-- ============================================================ -->
      <div v-if="alumni.length > 0" class="mt-8">
        <button
          @click="showAlumni = !showAlumni"
          class="w-full flex items-center justify-center gap-2 py-4 px-6 bg-gray-100 dark:bg-gray-800/50 hover:bg-gray-200 dark:hover:bg-gray-700/50 rounded-xl transition-all duration-300 group backdrop-blur-sm"
        >
          <UserMinus class="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <span class="font-medium text-gray-700 dark:text-gray-300">
            {{ showAlumni ? 'Hide' : 'Show' }} Alumni ({{ alumni.length }})
          </span>
          <ChevronDown v-if="!showAlumni" class="w-4 h-4 text-gray-500 dark:text-gray-400" />
          <ChevronUp v-else class="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>

        <div v-if="showAlumni && filteredAlumni.length > 0" class="mt-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <div
              v-for="member in filteredAlumni"
              :key="member.id"
              class="group bg-white dark:bg-gray-800/80 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm"
              @click="openDialog(member)"
            >
              <div class="aspect-[4/5] bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 overflow-hidden relative">
                <img v-if="member.image" :src="member.image" :alt="member.name" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
                  <UserMinus class="w-12 h-12 opacity-40" />
                </div>
                <div class="absolute top-3 right-3">
                  <span class="text-xs px-2 py-1 rounded-full bg-gray-500/80 text-white">Alumni</span>
                </div>
              </div>
              <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white">{{ member.name }}</h3>
                <p class="text-gray-500 dark:text-gray-400 text-xs">{{ member.position || 'Former Member' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="totalResults === 0 && !searchQuery && filteredProfessors.length === 0 && filteredResearchers.length === 0 && filteredPhdStudents.length === 0 && filteredMasterStudents.length === 0 && filteredUndergraduateStudents.length === 0 && alumni.length === 0" class="text-center py-16 bg-white/50 dark:bg-gray-800/30 rounded-2xl backdrop-blur-sm">
        <Users class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400">No team members found.</p>
      </div>

      <div v-else-if="totalResults === 0 && searchQuery" class="text-center py-16 bg-white/50 dark:bg-gray-800/30 rounded-2xl backdrop-blur-sm">
        <Search class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <p class="text-gray-500 dark:text-gray-400">No members found matching "{{ searchQuery }}"</p>
        <button @click="searchQuery = ''" class="mt-3 text-blue-600 dark:text-blue-400 text-sm hover:underline">Clear search</button>
      </div>

      <!-- Member Detail Dialog -->
      <el-dialog v-model="dialogVisible" width="1000px" destroy-on-close class="member-dialog dark:bg-gray-900">
        <div v-if="selectedMember" class="space-y-8">
          <!-- Header Section -->
          <div class="flex flex-col md:flex-row gap-6">
            <div class="shrink-0">
              <img :src="selectedMember.image || 'https://via.placeholder.com/200x250?text=No+Image'" :alt="selectedMember.name" class="w-48 h-60 object-cover rounded-xl shadow-lg" />
            </div>
            <div class="flex-1">
              <div class="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h2 class="text-3xl font-bold text-gray-900 dark:text-white">{{ selectedMember.name }}</h2>
                  <p class="text-blue-600 dark:text-blue-400 text-lg mt-1">{{ selectedMember.title || roleLabel(selectedMember.role) }}</p>
                  <p v-if="selectedMember.position && selectedMember.role !== 2" class="text-gray-600 dark:text-gray-300 mt-1">{{ selectedMember.position }}</p>
                  <p v-if="selectedMember.affiliation && selectedMember.role !== 2" class="text-gray-500 dark:text-gray-400 text-sm">{{ selectedMember.affiliation }}</p>
                </div>
              </div>

              <!-- Current Positions -->
              <div v-if="selectedMember.currentPositions?.length" class="mt-4 space-y-1">
                <p class="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider">Current Positions</p>
                <div v-for="(pos, idx) in selectedMember.currentPositions" :key="idx" class="flex items-start gap-2 text-sm">
                  <Building class="w-4 h-4 mt-0.5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                  <span class="text-gray-700 dark:text-gray-300"><strong>{{ pos.position }}</strong> at {{ pos.organization }}<span v-if="pos.department">, {{ pos.department }}</span></span>
                </div>
              </div>

              <div class="grid grid-cols-3 gap-4 mt-6 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ selectedMember.total_publications }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Publications</p>
                </div>
                <div class="text-center">
                  <p class="text-2xl font-bold text-gray-800 dark:text-white">{{ selectedMember.total_projects }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">Projects</p>
                </div>
                <div v-if="selectedMember.join_date" class="text-center">
                  <Calendar class="w-4 h-4 text-gray-400 dark:text-gray-500 mx-auto mb-1" />
                  <p class="text-xs text-gray-500 dark:text-gray-400">Joined</p>
                  <p class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ formatDate(selectedMember.join_date) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Profile/Bio Section -->
          <div v-if="selectedMember.profile">
            <h3 class="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white"><FileText class="w-5 h-5 text-blue-500 dark:text-blue-400" /> Biography</h3>
            <div class="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
              <p class="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{{ selectedMember.profile }}</p>
            </div>
          </div>

          <!-- Research Interests -->
          <div v-if="selectedMember.researchInterests?.length">
            <h3 class="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white"><Target class="w-5 h-5 text-blue-500 dark:text-blue-400" /> Research Interests</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="interest in selectedMember.researchInterests" :key="interest" class="px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium">
                {{ interest }}
              </span>
            </div>
          </div>

          <!-- Research Domains -->
          <div v-if="selectedMember.research_domains?.length">
            <h3 class="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white"><Award class="w-5 h-5 text-emerald-500 dark:text-emerald-400" /> Research Domains</h3>
            <div class="flex flex-wrap gap-2">
              <span v-for="domain in selectedMember.research_domains" :key="domain" class="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm">
                {{ domain }}
              </span>
            </div>
          </div>

          <!-- Education -->
          <div v-if="selectedMember.education?.length">
            <h3 class="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white"><GraduationCap class="w-5 h-5 text-purple-500 dark:text-purple-400" /> Education</h3>
            <div class="space-y-3">
              <div v-for="(edu, idx) in selectedMember.education" :key="idx" class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
                <p class="font-semibold text-gray-800 dark:text-white">{{ edu.degree }}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ edu.field }}</p>
                <p class="text-sm text-gray-500 dark:text-gray-500">{{ edu.institution }}</p>
                <p class="text-xs text-gray-400 dark:text-gray-600">{{ edu.startYear }} - {{ edu.endYear }}</p>
              </div>
            </div>
          </div>

          <!-- Work Experiences -->
          <div v-if="selectedMember.experiences?.length">
            <h3 class="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white"><History class="w-5 h-5 text-orange-500 dark:text-orange-400" /> Work Experience</h3>
            <div class="space-y-3">
              <div v-for="(exp, idx) in selectedMember.experiences" :key="idx" class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700">
                <div class="flex items-start justify-between flex-wrap gap-2">
                  <p class="font-semibold text-gray-800 dark:text-white">{{ exp.position }}</p>
                  <p class="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1"><Clock class="w-3 h-3" /> {{ exp.period }}</p>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ exp.organization }}<span v-if="exp.department">, {{ exp.department }}</span></p>
              </div>
            </div>
          </div>

          <!-- Academic Profiles -->
          <div v-if="selectedMember.academic_profiles?.length">
            <h3 class="font-semibold mb-3 flex items-center gap-2 text-gray-800 dark:text-white"><Bookmark class="w-5 h-5 text-indigo-500 dark:text-indigo-400" /> Academic Profiles</h3>
            <div class="space-y-2">
              <div v-for="(profile, idx) in selectedMember.academic_profiles" :key="idx" class="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300">
                {{ profile }}
              </div>
            </div>
          </div>

          <!-- Contact Links -->
          <div class="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <a v-if="selectedMember.email" :href="`mailto:${selectedMember.email}`" class="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              <Mail class="w-4 h-4" /> Email
            </a>
            <a v-if="selectedMember.phone" :href="`tel:${selectedMember.phone}`" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300">
              <Phone class="w-4 h-4" /> Call
            </a>
            <a v-if="selectedMember.website" :href="selectedMember.website" target="_blank" class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition text-gray-700 dark:text-gray-300">
              <Globe class="w-4 h-4" /> Website
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>
        </div>
      </el-dialog>
    </div>
  </section>
</template>

<style scoped>
.member-dialog :deep(.el-dialog) {
  border-radius: 1.5rem;
  background-color: rgb(255 255 255);
}

.dark .member-dialog :deep(.el-dialog) {
  background-color: rgb(31 41 55);
  border: 1px solid rgb(55 65 81);
}

.member-dialog :deep(.el-dialog__header) {
  padding: 1.25rem 1.5rem 0;
}

.member-dialog :deep(.el-dialog__close) {
  color: rgb(107 114 128);
}

.dark .member-dialog :deep(.el-dialog__close) {
  color: rgb(156 163 175);
}

.dark .member-dialog :deep(.el-dialog__close:hover) {
  color: rgb(209 213 219);
}

.member-dialog :deep(.el-dialog__body) {
  padding: 1.5rem;
  max-height: 80vh;
  overflow-y: auto;
}

/* Custom scrollbar for dark mode */
.dark .member-dialog :deep(.el-dialog__body)::-webkit-scrollbar {
  width: 8px;
}

.dark .member-dialog :deep(.el-dialog__body)::-webkit-scrollbar-track {
  background: rgb(55 65 81);
  border-radius: 4px;
}

.dark .member-dialog :deep(.el-dialog__body)::-webkit-scrollbar-thumb {
  background: rgb(75 85 99);
  border-radius: 4px;
}

.dark .member-dialog :deep(.el-dialog__body)::-webkit-scrollbar-thumb:hover {
  background: rgb(107 114 128);
}
</style>
