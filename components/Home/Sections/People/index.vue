<script setup>
import { ref, computed } from 'vue'
import { Search, BookOpen, Briefcase, Calendar } from 'lucide-vue-next'

const props = defineProps({
  labMembers: Array
})

const searchQuery = ref('')
const activeTab = ref('all')

// Dialog
const dialogVisible = ref(false)
const selectedMember = ref(null)

const openDialog = (member) => {
  selectedMember.value = member
  dialogVisible.value = true
}

// Tabs
const tabs = [
  { key: 'all', label: 'All' },
  { key: 'professor', label: 'Professor' },
  { key: 'phd', label: 'PhD' },
  { key: 'master', label: 'Master' },
  { key: 'alumni', label: 'Alumni' }
]

// Helpers
const isProfessor = (m) => {
  const r = m.role.toLowerCase()
  return r.includes('professor') || r.includes('director') || r.includes('pi')
}

const isAlumni = (m) => {
  return m.role.toLowerCase().includes('alumni') || m.status === 'alumni'
}

// Filter
const filteredMembers = computed(() => {
  let members = [...props.labMembers]

  members = members.filter(m => {
    const role = m.role.toLowerCase()

    if (activeTab.value === 'all') return !isAlumni(m)
    if (activeTab.value === 'professor') return isProfessor(m)
    if (activeTab.value === 'phd') return role.includes('phd') && !isAlumni(m)
    if (activeTab.value === 'master') return role.includes('master') && !isAlumni(m)
    if (activeTab.value === 'alumni') return isAlumni(m)

    return true
  })

  if (!searchQuery.value.trim()) return members

  const q = searchQuery.value.toLowerCase()
  return members.filter(m =>
    m.name.toLowerCase().includes(q) ||
    m.role.toLowerCase().includes(q)
  )
})

// Count
const counts = computed(() => ({
  all: props.labMembers.filter(m => !isAlumni(m)).length,
  professor: props.labMembers.filter(m => isProfessor(m)).length,
  phd: props.labMembers.filter(m => m.role.toLowerCase().includes('phd') && !isAlumni(m)).length,
  master: props.labMembers.filter(m => m.role.toLowerCase().includes('master') && !isAlumni(m)).length,
  alumni: props.labMembers.filter(m => isAlumni(m)).length
}))
</script>

<template>
  <section id="team" class="relative py-12 md:py-16 overflow-hidden">

    <!-- ✅ YOUR BACKGROUND (UNCHANGED) -->
    <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50/10 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10">
      <div class="absolute inset-0 opacity-[0.03]">
        <div class="absolute inset-0" style="background-image:
          radial-gradient(circle at 25% 25%, currentColor 1px, transparent 1px),
          radial-gradient(circle at 75% 75%, currentColor 1px, transparent 1px);
          background-size: 60px 60px;">
        </div>
      </div>
    </div>

    <div class="relative z-10 max-w-7xl mx-auto px-4">

      <!-- HEADER -->
      <div class="text-center mb-10">
        <h2 class="text-4xl font-bold text-gray-900 dark:text-white">
          Meet Our Team
        </h2>
        <p class="text-gray-500">Research lab members overview</p>
      </div>

      <!-- SEARCH -->
      <div class="max-w-xl mx-auto mb-6 relative">
        <Search class="absolute left-3 top-3 w-5 text-gray-400"/>
        <input
          v-model="searchQuery"
          class="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-gray-800"
          placeholder="Search members..."
        />
      </div>

      <!-- TABS -->
      <div class="flex flex-wrap justify-center gap-2 mb-8">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition',
            activeTab === tab.key
              ? 'bg-blue-600 text-white shadow'
              : 'bg-white dark:bg-gray-800 border text-gray-600 dark:text-gray-300'
          ]"
        >
          {{ tab.label }} ({{ counts[tab.key] }})
        </button>
      </div>

      <!-- GRID -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

        <div
          v-for="(member, index) in filteredMembers"
          :key="index"
          class="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border hover:shadow-xl transition group"
        >

          <!-- 🔥 BIG SQUARE IMAGE -->
          <div class="w-full aspect-square overflow-hidden bg-gray-100">
            <img
              v-if="member.image"
              :src="member.image"
              class="w-full h-full object-cover group-hover:scale-105 transition"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          </div>

          <!-- INFO -->
          <div class="p-4 text-center">
            <h3 class="font-bold text-lg text-gray-900 dark:text-white">
              {{ member.name }}
            </h3>
            <p class="text-sm text-gray-500 mb-3">{{ member.role }}</p>

            <!-- Stats -->
            <div class="grid grid-cols-3 text-xs mb-4">
              <div>
                <BookOpen class="mx-auto w-4 text-gray-400"/>
                {{ member.publications || 0 }}
              </div>
              <div>
                <Briefcase class="mx-auto w-4 text-gray-400"/>
                {{ member.projects || 0 }}
              </div>
              <div>
                <Calendar class="mx-auto w-4 text-gray-400"/>
                {{ member.year || 'Now' }}
              </div>
            </div>

            <!-- BUTTON -->
            <button
              @click="openDialog(member)"
              class="w-full py-2 rounded-lg bg-blue-600 text-white text-sm hover:opacity-90"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      <!-- EMPTY -->
      <div v-if="filteredMembers.length === 0" class="text-center py-10 text-gray-500">
        No members found
      </div>

      <!-- 🔥 DIALOG -->
      <el-dialog
        v-model="dialogVisible"
        width="650px"
        :close-on-click-modal="true"
      >
        <div v-if="selectedMember">

          <!-- 🔥 BIG IMAGE -->
          <div class="mb-5 overflow-hidden">
            <img
              v-if="selectedMember.image"
              :src="selectedMember.image"
              class="mx-auto w-2/4 h-2/4 object-cover rounded-lg shadow-lg"
            />
          </div>

          <!-- NAME -->
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ selectedMember.name }}
          </h3>

          <!-- ROLE -->
          <p class="text-blue-600 font-medium mb-4">
            {{ selectedMember.role }}
          </p>

          <!-- BIO -->
          <p v-if="selectedMember.bio" class="text-gray-600 mb-4 leading-relaxed">
            {{ selectedMember.bio }}
          </p>

          <!-- INFO GRID -->
          <div class="grid grid-cols-2 gap-4 mb-4 text-sm">

            <div v-if="selectedMember.education">
              <p class="text-gray-400">Education</p>
              <p class="font-medium">{{ selectedMember.education }}</p>
            </div>

            <div>
              <p class="text-gray-400">Since</p>
              <p class="font-medium">{{ selectedMember.year }}</p>
            </div>

            <div>
              <p class="text-gray-400">Publications</p>
              <p class="font-medium">{{ selectedMember.publications }}</p>
            </div>

            <div>
              <p class="text-gray-400">Projects</p>
              <p class="font-medium">{{ selectedMember.projects }}</p>
            </div>

          </div>

          <!-- EXPERTISE -->
          <div v-if="selectedMember.expertise?.length" class="mb-5">
            <p class="text-gray-400 mb-2">Expertise</p>
            <div class="flex flex-wrap gap-2">
        <span
          v-for="(skill, i) in selectedMember.expertise"
          :key="i"
          class="px-3 py-1 text-xs bg-blue-100 text-blue-600 rounded-full"
        >
          {{ skill }}
        </span>
            </div>
          </div>

          <!-- CONTACT -->
          <div class="flex flex-wrap gap-2 pt-3 border-t">

            <a
              v-if="selectedMember.email"
              :href="`mailto:${selectedMember.email}`"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
            >
              Email
            </a>

            <a
              v-if="selectedMember.website"
              :href="selectedMember.website"
              target="_blank"
              class="px-4 py-2 bg-gray-100 rounded-lg text-sm"
            >
              Website
            </a>

            <a
              v-if="selectedMember.linkedin"
              :href="selectedMember.linkedin"
              target="_blank"
              class="px-4 py-2 bg-gray-200 rounded-lg text-sm"
            >
              LinkedIn
            </a>

          </div>

        </div>
      </el-dialog>

    </div>
  </section>
</template>
