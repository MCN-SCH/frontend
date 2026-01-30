<script setup>
import { ref, computed } from 'vue'
import { Users2, Search, Building2, UserCheck, GraduationCap, UserPlus, Users, Globe, Award, Mail, Calendar, BookOpen, Briefcase, ExternalLink, ChevronDown, ChevronUp, Crown, GraduationCap as Cap, Briefcase as Case, User, Eye, EyeOff, History, School } from 'lucide-vue-next'

const props = defineProps({
  labMembers: Array
})

const searchQuery = ref('')
const expandedDetails = ref([])
const showAlumni = ref(false) // Toggle to show/hide alumni

// Sort members: professors first, then current members, then alumni
const sortedMembers = computed(() => {
  const members = [...props.labMembers]

  return members.sort((a, b) => {
    // Check if alumni
    const aIsAlumni = a.role.toLowerCase().includes('alumni') || a.status === 'alumni'
    const bIsAlumni = b.role.toLowerCase().includes('alumni') || b.status === 'alumni'

    // Check if professor
    const aIsProfessor = a.role.toLowerCase().includes('professor') ||
      a.role.toLowerCase().includes('director') ||
      a.role.toLowerCase().includes('pi')
    const bIsProfessor = b.role.toLowerCase().includes('professor') ||
      b.role.toLowerCase().includes('director') ||
      b.role.toLowerCase().includes('pi')

    // Sorting priority: professors > current members > alumni
    if (showAlumni.value) {
      if (aIsAlumni && !bIsAlumni) return 1
      if (!aIsAlumni && bIsAlumni) return -1
      if (aIsAlumni && bIsAlumni) return 0
    } else {
      if (aIsAlumni || bIsAlumni) {
        return aIsAlumni ? 1 : -1
      }
    }

    if (aIsProfessor && !bIsProfessor) return -1
    if (!aIsProfessor && bIsProfessor) return 1

    return 0
  })
})

// Filter members based on search
const filteredMembers = computed(() => {
  let members = sortedMembers.value

  // If not showing alumni, filter them out
  if (!showAlumni.value) {
    members = members.filter(member =>
      !member.role.toLowerCase().includes('alumni') &&
      member.status !== 'alumni'
    )
  }

  if (!searchQuery.value.trim()) {
    return members
  }

  const query = searchQuery.value.toLowerCase()
  return members.filter(member =>
    member.name.toLowerCase().includes(query) ||
    member.role.toLowerCase().includes(query) ||
    member.education?.toLowerCase().includes(query) ||
    (member.expertise && member.expertise.some(skill => skill.toLowerCase().includes(query))) ||
    (member.currentPosition?.toLowerCase().includes(query))
  )
})

// Check if member is professor
const isProfessor = (member) => {
  const roleLower = member.role.toLowerCase()
  return roleLower.includes('professor') ||
    roleLower.includes('director') ||
    roleLower.includes('pi')
}

// Check if member is alumni
const isAlumni = (member) => {
  const roleLower = member.role.toLowerCase()
  return roleLower.includes('alumni') ||
    member.status === 'alumni' ||
    roleLower.includes('former')
}

// Get role color
const getRoleColor = (member) => {
  if (isProfessor(member)) {
    return {
      bg: 'bg-gradient-to-br from-blue-600 to-blue-700',
      border: 'border-blue-200 dark:border-blue-700',
      text: 'text-blue-700 dark:text-blue-300',
      bgLight: 'bg-blue-50 dark:bg-blue-900/30',
      gradient: 'from-blue-500 to-blue-600',
      icon: Crown
    }
  }

  if (isAlumni(member)) {
    return {
      bg: 'bg-gradient-to-br from-gray-600 to-gray-700',
      border: 'border-gray-200 dark:border-gray-700',
      text: 'text-gray-700 dark:text-gray-300',
      bgLight: 'bg-gray-50 dark:bg-gray-700/30',
      gradient: 'from-gray-500 to-gray-600',
      icon: History
    }
  }

  const roleLower = member.role.toLowerCase()
  if (roleLower.includes('postdoc') || roleLower.includes('post-doc')) {
    return {
      bg: 'bg-gradient-to-br from-purple-600 to-purple-700',
      border: 'border-purple-200 dark:border-purple-700',
      text: 'text-purple-700 dark:text-purple-300',
      bgLight: 'bg-purple-50 dark:bg-purple-900/30',
      gradient: 'from-purple-500 to-purple-600',
      icon: UserCheck
    }
  } else if (roleLower.includes('phd') || roleLower.includes('doctoral')) {
    return {
      bg: 'bg-gradient-to-br from-green-600 to-green-700',
      border: 'border-green-200 dark:border-green-700',
      text: 'text-green-700 dark:text-green-300',
      bgLight: 'bg-green-50 dark:bg-green-900/30',
      gradient: 'from-green-500 to-green-600',
      icon: GraduationCap
    }
  } else if (roleLower.includes('master') || roleLower.includes('ms')) {
    return {
      bg: 'bg-gradient-to-br from-amber-600 to-amber-700',
      border: 'border-amber-200 dark:border-amber-700',
      text: 'text-amber-700 dark:text-amber-300',
      bgLight: 'bg-amber-50 dark:bg-amber-900/30',
      gradient: 'from-amber-500 to-amber-600',
      icon: UserPlus
    }
  } else if (roleLower.includes('undergrad') || roleLower.includes('bachelor') || roleLower.includes('bs')) {
    return {
      bg: 'bg-gradient-to-br from-cyan-600 to-cyan-700',
      border: 'border-cyan-200 dark:border-cyan-700',
      text: 'text-cyan-700 dark:text-cyan-300',
      bgLight: 'bg-cyan-50 dark:bg-cyan-900/30',
      gradient: 'from-cyan-500 to-cyan-600',
      icon: Users
    }
  } else if (roleLower.includes('visiting')) {
    return {
      bg: 'bg-gradient-to-br from-violet-600 to-violet-700',
      border: 'border-violet-200 dark:border-violet-700',
      text: 'text-violet-700 dark:text-violet-300',
      bgLight: 'bg-violet-50 dark:bg-violet-900/30',
      gradient: 'from-violet-500 to-violet-600',
      icon: Globe
    }
  }

  return {
    bg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    border: 'border-blue-200 dark:border-blue-700',
    text: 'text-blue-700 dark:text-blue-300',
    bgLight: 'bg-blue-50 dark:bg-blue-900/30',
    gradient: 'from-blue-400 to-blue-500',
    icon: Users2
  }
}

const toggleDetails = (index) => {
  if (expandedDetails.value.includes(index)) {
    expandedDetails.value = expandedDetails.value.filter(i => i !== index)
  } else {
    expandedDetails.value.push(index)
  }
}

const toggleAlumni = () => {
  showAlumni.value = !showAlumni.value
  expandedDetails.value = [] // Clear expanded details when toggling
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

// Clear search
const clearSearch = () => {
  searchQuery.value = ''
}

// Count alumni
const alumniCount = computed(() => {
  return props.labMembers.filter(member =>
    member.role.toLowerCase().includes('alumni') ||
    member.status === 'alumni'
  ).length
})

// Count current members
const currentCount = computed(() => {
  return props.labMembers.filter(member =>
    !member.role.toLowerCase().includes('alumni') &&
    member.status !== 'alumni'
  ).length
})
</script>

<template>
  <section id="team" class="relative py-12 md:py-16 overflow-hidden">
    <!-- Background with subtle pattern -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
      <div class="absolute inset-0 opacity-[0.03]">
        <div class="absolute inset-0" style="background-image:
          radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px);
          background-size: 60px 60px;">
        </div>
      </div>
    </div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <!-- Header -->
      <div class="max-w-4xl mx-auto text-center mb-10">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/40 mb-5">
          <Users2 class="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span class="text-sm font-semibold text-blue-700 dark:text-blue-300 tracking-wide">LAB MEMBERS • 서울대학교</span>
        </div>

        <h2 class="text-4xl md:text-5xl font-bold mb-5">
          <span class="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 dark:from-blue-400 dark:via-blue-300 dark:to-blue-200 bg-clip-text text-transparent">
            Meet Our Team
          </span>
        </h2>

        <p class="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
          A diverse team of passionate researchers, professors, students, and alumni pushing the boundaries of knowledge.
        </p>
      </div>

      <!-- Controls -->
      <div class="max-w-7xl mx-auto mb-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-4">
          <!-- Search Bar -->
          <div class="flex-1 max-w-xl">
            <div class="relative">
              <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search team members by name, role, expertise..."
                class="w-full pl-12 pr-10 py-3 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                Clear
              </button>
            </div>
          </div>

          <!-- Alumni Toggle -->
          <div class="flex items-center gap-4">
            <button
              @click="toggleAlumni"
              :class="[
                'flex items-center gap-2 px-4 py-3 rounded-xl border font-medium transition-all',
                showAlumni
                  ? 'bg-gradient-to-r from-gray-600 to-gray-700 text-white border-gray-600 shadow-lg'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
              ]"
            >
              <History class="w-5 h-5" />
              <span>{{ showAlumni ? 'Hide Alumni' : 'Show Alumni' }}</span>
              <span class="px-2 py-0.5 rounded-full text-xs"
                    :class="showAlumni ? 'bg-white/20' : 'bg-gray-100 dark:bg-gray-700'">
                {{ alumniCount }}
              </span>
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between mt-4">
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ filteredMembers.length }} member{{ filteredMembers.length !== 1 ? 's' : '' }} found
            <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
          </p>
          <div class="flex items-center gap-2">
            <Eye class="w-4 h-4 text-blue-500" />
            <span class="text-xs text-gray-500 dark:text-gray-400">Click "View Details" for more info</span>
          </div>
        </div>
      </div>

      <!-- Members Grid -->
      <div class="max-w-7xl mx-auto">
        <!-- Current Members Section -->
        <div v-if="filteredMembers.filter(m => !isAlumni(m)).length > 0" class="mb-12">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <Users2 class="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Current Members</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ currentCount }} active researchers</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="(member, index) in filteredMembers.filter(m => !isAlumni(m))"
              :key="index"
              :class="[
                'bg-white dark:bg-gray-800 rounded-2xl border transition-all duration-300 hover:shadow-lg overflow-hidden group relative',
                isProfessor(member)
                  ? 'border-2 border-blue-300 dark:border-blue-500 shadow-md'
                  : 'border border-gray-200 dark:border-gray-700',
                expandedDetails.includes(index) ? 'shadow-xl' : 'hover:-translate-y-2'
              ]"
            >
              <!-- Professor Badge -->
              <div v-if="isProfessor(member)" class="absolute top-4 right-4 z-10">
                <div class="bg-gradient-to-r from-blue-600 to-blue-700 px-3 py-1.5 rounded-full shadow-lg">
                  <div class="flex items-center gap-2 text-white text-xs font-bold">
                    <Crown class="w-3.5 h-3.5" />
                    <span>Director</span>
                  </div>
                </div>
              </div>

              <!-- Member Card -->
              <div class="p-5">
                <!-- Avatar & Basic Info -->
                <div class="flex flex-col items-center text-center mb-4">
                  <!-- Avatar -->
                  <div class="relative mb-3">
                    <div :class="[
                      'w-20 h-20 rounded-full p-1 mb-2 mx-auto',
                      getRoleColor(member).bg,
                      isProfessor(member) ? 'ring-4 ring-blue-100 dark:ring-blue-900/30' : ''
                    ]">
                      <div class="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <span class="text-2xl font-bold text-gray-900 dark:text-white">
                          {{ getInitials(member.name) }}
                        </span>
                      </div>
                    </div>

                    <!-- Role Icon -->
                    <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div :class="[
                        'p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800',
                        getRoleColor(member).bgLight
                      ]">
                        <component
                          :is="getRoleColor(member).icon"
                          class="w-5 h-5"
                          :class="getRoleColor(member).text"
                        />
                      </div>
                    </div>
                  </div>

                  <!-- Name & Role -->
                  <h3 :class="[
                    'font-bold mb-1',
                    isProfessor(member) ? 'text-xl text-gray-900 dark:text-white' : 'text-lg text-gray-900 dark:text-white'
                  ]">
                    {{ member.name }}
                  </h3>
                  <p :class="['font-semibold mb-3', getRoleColor(member).text]">
                    {{ member.role }}
                  </p>
                </div>

                <!-- Stats -->
                <div class="grid grid-cols-3 gap-3 mb-4">
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <BookOpen class="w-4 h-4 text-gray-400" />
                    </div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ member.publications || 0 }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Papers</div>
                  </div>
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <Case class="w-4 h-4 text-gray-400" />
                    </div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ member.projects || 0 }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                  </div>
                  <div class="text-center">
                    <div class="flex items-center justify-center gap-1 mb-1">
                      <Calendar class="w-4 h-4 text-gray-400" />
                    </div>
                    <div class="text-lg font-bold text-gray-900 dark:text-white">{{ member.year || 'Now' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">Since</div>
                  </div>
                </div>

                <!-- Expertise Tags -->
                <div class="mb-4">
                  <div class="flex flex-wrap gap-1.5 justify-center">
                    <span
                      v-for="(skill, skillIndex) in (member.expertise || []).slice(0, 3)"
                      :key="skillIndex"
                      :class="[
                        'px-2.5 py-1 rounded-full text-xs font-medium border',
                        getRoleColor(member).bgLight,
                        getRoleColor(member).text,
                        getRoleColor(member).border
                      ]"
                    >
                      {{ skill }}
                    </span>
                    <span
                      v-if="(member.expertise || []).length > 3"
                      :class="[
                        'px-2.5 py-1 rounded-full text-xs font-medium',
                        getRoleColor(member).bgLight,
                        getRoleColor(member).text
                      ]"
                    >
                      +{{ (member.expertise || []).length - 3 }}
                    </span>
                  </div>
                </div>

                <!-- View Details Button -->
                <button
                  :class="[
                    'w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2 mb-4',
                    expandedDetails.includes(index)
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-gradient-to-r hover:opacity-90 text-white',
                    getRoleColor(member).gradient ? `bg-gradient-to-r ${getRoleColor(member).gradient}` : ''
                  ]"
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Alumni Section -->
        <div v-if="showAlumni && filteredMembers.filter(m => isAlumni(m)).length > 0" class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-3 mb-6">
            <div class="p-2 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/20 dark:to-gray-700/20">
              <History class="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Alumni</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ alumniCount }} former members making impact</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div
              v-for="(member, index) in filteredMembers.filter(m => isAlumni(m))"
              :key="`alumni-${index}`"
              class="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg overflow-hidden group opacity-90 hover:opacity-100"
            >
              <!-- Alumni Badge -->
              <div class="absolute top-4 right-4 z-10">
                <div class="bg-gradient-to-r from-gray-600 to-gray-700 px-3 py-1.5 rounded-full shadow-lg">
                  <div class="flex items-center gap-2 text-white text-xs font-bold">
                    <Award class="w-3.5 h-3.5" />
                    <span>Alumni</span>
                  </div>
                </div>
              </div>

              <!-- Alumni Card -->
              <div class="p-5">
                <!-- Avatar & Basic Info -->
                <div class="flex flex-col items-center text-center mb-4">
                  <!-- Avatar -->
                  <div class="relative mb-3">
                    <div class="w-16 h-16 rounded-full p-1 mb-2 mx-auto bg-gradient-to-br from-gray-400 to-gray-600">
                      <div class="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <span class="text-xl font-bold text-gray-900 dark:text-white">
                          {{ getInitials(member.name) }}
                        </span>
                      </div>
                    </div>

                    <!-- Alumni Icon -->
                    <div class="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                      <div class="p-2 rounded-full shadow-lg border-2 border-white dark:border-gray-800 bg-gray-50 dark:bg-gray-700">
                        <History class="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <!-- Name & Role -->
                  <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    {{ member.name }}
                  </h3>
                  <p class="text-gray-600 dark:text-gray-400 font-medium mb-2">
                    {{ member.role }}
                  </p>

                  <!-- Current Position -->
                  <div v-if="member.currentPosition" class="mb-3">
                    <div class="flex items-center justify-center gap-1 text-sm">
                      <School class="w-3.5 h-3.5 text-gray-400" />
                      <span class="text-gray-700 dark:text-gray-300 font-medium">{{ member.currentPosition }}</span>
                    </div>
                  </div>
                </div>

                <!-- Alumni Period -->
                <div class="flex items-center justify-center gap-2 mb-4 text-sm text-gray-600 dark:text-gray-400">
                  <Calendar class="w-4 h-4" />
                  <span>{{ member.startYear || '20XX' }} - {{ member.endYear || 'Present' }}</span>
                </div>

                <!-- Legacy Tags -->
                <div v-if="member.expertise || member.legacy" class="mb-4">
                  <div class="flex flex-wrap gap-1.5 justify-center">
                    <span
                      v-for="(skill, skillIndex) in (member.expertise || member.legacy || []).slice(0, 3)"
                      :key="skillIndex"
                      class="px-2.5 py-1 rounded-full text-xs font-medium border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {{ skill }}
                    </span>
                  </div>
                </div>

                <!-- View Details Button -->
                <button
                  @click="toggleDetails(`alumni-${index}`)"
                  :class="[
                    'w-full py-2.5 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2',
                    expandedDetails.includes(`alumni-${index}`)
                      ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 hover:opacity-90 text-white'
                  ]"
                >
                  <component :is="expandedDetails.includes(`alumni-${index}`) ? EyeOff : Eye" class="w-4 h-4" />
                  {{ expandedDetails.includes(`alumni-${index}`) ? 'Hide Details' : 'View Details' }}
                </button>

                <!-- Alumni Expanded Details -->
                <div
                  v-if="expandedDetails.includes(`alumni-${index}`)"
                  class="pt-4 border-t border-gray-100 dark:border-gray-700 space-y-4 animate-fadeIn mt-4"
                >
                  <!-- Education -->
                  <div v-if="member.education">
                    <div class="flex items-center gap-2 mb-2">
                      <Cap class="w-4 h-4 text-gray-400" />
                      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Education</h4>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ member.education }}</p>
                  </div>

                  <!-- Current Position -->
                  <div v-if="member.currentPosition">
                    <div class="flex items-center gap-2 mb-2">
                      <Briefcase class="w-4 h-4 text-gray-400" />
                      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Current Position</h4>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ member.currentPosition }}</p>
                  </div>

                  <!-- Alumni Contribution -->
                  <div v-if="member.alumniContribution || member.bio">
                    <div class="flex items-center gap-2 mb-2">
                      <Award class="w-4 h-4 text-gray-400" />
                      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Contribution</h4>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">{{ member.alumniContribution || member.bio }}</p>
                  </div>

                  <!-- Contact Buttons -->
                  <div class="flex gap-2 pt-2">
                    <a
                      v-if="member.email"
                      :href="`mailto:${member.email}`"
                      class="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-600 transition-all hover:scale-105"
                    >
                      <Mail class="w-4 h-4" />
                      Email
                    </a>
                    <a
                      v-if="member.website || member.linkedin"
                      :href="member.website || member.linkedin"
                      target="_blank"
                      class="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all hover:scale-105"
                    >
                      <ExternalLink class="w-4 h-4" />
                      Profile
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredMembers.length === 0"
          class="text-center py-16 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 mt-8"
        >
          <div class="max-w-md mx-auto">
            <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800 flex items-center justify-center">
              <Search class="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">No matching members found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Try searching with different keywords or toggle alumni visibility.
            </p>
            <button
              @click="clearSearch"
              class="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg hover:shadow-xl mr-3"
            >
              Clear Search
            </button>
            <button
              @click="toggleAlumni"
              class="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:opacity-90 transition-opacity font-medium shadow-lg hover:shadow-xl"
            >
              {{ showAlumni ? 'Hide Alumni' : 'Show Alumni' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Stats Footer -->
      <div class="max-w-7xl mx-auto mt-8 md:mt-14 px-4">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-gray-700 shadow-sm">

          <!-- Header - Always centered on mobile -->
          <div class="text-center mb-8 md:mb-6">
            <div class="inline-flex items-center gap-4 mb-4">
              <div class="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-md">
                <Building2 class="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Research Team</h3>
                <p class="text-gray-600 dark:text-gray-400 mt-1 text-sm md:text-base">
                  Soonchunhyang University • {{ new Date().getFullYear() }}
                </p>
              </div>
            </div>
          </div>

          <!-- Stats grid - Responsive layout -->
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6">
            <div class="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <div class="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">{{ sortedMembers.filter(m => isProfessor(m)).length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Professors</div>
            </div>
            <div class="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <div class="text-2xl md:text-3xl font-bold text-green-600 dark:text-green-400">{{ sortedMembers.filter(m => m.role.toLowerCase().includes('phd') && !isAlumni(m)).length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">PhD</div>
            </div>
            <div class="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <div class="text-2xl md:text-3xl font-bold text-cyan-600 dark:text-cyan-400">{{ sortedMembers.filter(m => m.role.toLowerCase().includes('master') && !isAlumni(m)).length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Masters</div>
            </div>
            <div class="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <div class="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400">{{ sortedMembers.filter(m => m.role.toLowerCase().includes('postdoc') && !isAlumni(m)).length }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Postdocs</div>
            </div>
            <div class="text-center p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl">
              <div class="text-2xl md:text-3xl font-bold text-gray-600 dark:text-gray-400">{{ alumniCount }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Alumni</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Fade in animation for details */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Custom scrollbar for the member cards if needed */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(59, 130, 246, 0.3);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(59, 130, 246, 0.5);
}

/* Hover effects for member cards */
.group:hover .group-hover\:scale-105 {
  transform: scale(1.05);
}

/* Gradient border effect for professor cards */
.border-2.border-blue-300 {
  position: relative;
}

.border-2.border-blue-300::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: linear-gradient(45deg, #3b82f6, #8b5cf6, #3b82f6);
  border-radius: 18px;
  z-index: -1;
  opacity: 0.1;
}

/* Alumni specific styles */
.opacity-90 {
  opacity: 0.9;
}

.opacity-90:hover {
  opacity: 1;
}
</style>
