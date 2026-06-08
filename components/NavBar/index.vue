<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Sun, Moon } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({
  darkMode: Boolean,
  currentLanguage: String,
})

const emit = defineEmits(['toggleDarkMode', 'toggleLanguage', 'scrollTo'])

const isScrolled = ref(false)
const mobileMenuOpen = ref(false)
const activeSection = ref('hero')
const navLinks = [
  { id: 'hero', label: 'home' },
  { id: 'about', label: 'about' },
  { id: 'research', label: 'research' },
  { id: 'team', label: 'team' },
  { id: 'publications', label: 'publications' },
  { id: 'projects', label: 'projects' },
  { id: 'facilities', label: 'facilities' },
  { id: 'contact', label: 'contact' },
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 30
}

const scrollToSection = (id) => {
  activeSection.value = id
  emit('scrollTo', id)
  mobileMenuOpen.value = false
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'fixed top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-500',
      'w-[95%] max-w-7xl rounded-2xl',
      isScrolled
        ? 'bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl'
        : 'bg-white/90 dark:bg-gray-900/90 shadow-lg',
    ]"
  >
    <div class="flex items-center justify-between px-6 py-3">
      <!-- LOGO -->
      <div
        class="flex items-center gap-3 cursor-pointer group"
        @click="scrollToSection('hero')"
      >
        <img
          src="@/assets/image/logo/mcn.svg"
          class="h-10 transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <!-- DESKTOP NAV -->
      <nav class="hidden lg:flex items-center gap-8">
        <button
          v-for="link in navLinks"
          :key="link.id"
          @click="scrollToSection(link.id)"
          class="relative group text-sm font-medium"
        >
          <span
            :class="[
              'transition-colors duration-300',
              activeSection === link.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 group-hover:text-blue-500',
            ]"
          >
            {{ $t(link.label) }}
          </span>

          <!-- underline -->
          <span
            class="absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-300"
            :class="
              activeSection === link.id ? 'w-full' : 'w-0 group-hover:w-full'
            "
          ></span>
        </button>
      </nav>

      <!-- RIGHT CONTROLS -->
      <div class="hidden lg:flex items-center gap-3">
        <!-- Language -->
        <Locale />

        <!-- Dark Mode -->
        <button
          @click="$emit('toggleDarkMode')"
          class="p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition"
        >
          <Sun v-if="darkMode" class="w-5 h-5 text-yellow-500" />
          <Moon v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- MOBILE BUTTON -->
      <button
        class="lg:hidden flex flex-col gap-1.5"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <span class="w-6 h-[2px] bg-gray-700 dark:bg-gray-300 transition" />

        <span class="w-6 h-[2px] bg-gray-700 dark:bg-gray-300 transition" />

        <span class="w-6 h-[2px] bg-gray-700 dark:bg-gray-300 transition" />
      </button>
    </div>

    <!-- MOBILE MENU -->

    <transition name="menu">
      <div
        v-if="mobileMenuOpen"
        class="lg:hidden border-t border-gray-200 dark:border-gray-700"
      >
        <div class="flex flex-col px-6 py-4 space-y-3">
          <button
            v-for="link in navLinks"
            :key="link.id"
            @click="scrollToSection(link.id)"
            class="text-left py-2 font-medium text-gray-700 dark:text-gray-300 hover:text-blue-500"
          >
            {{ link.label }}
          </button>

          <button
            @click="$emit('toggleLanguage')"
            class="text-left py-2 font-medium"
          >
            Language: {{ currentLanguage }}
          </button>
        </div>
      </div>
    </transition>
  </header>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
  transition: all 0.3s ease;
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
