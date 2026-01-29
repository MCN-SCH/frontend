<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Cpu, Sun, Moon } from 'lucide-vue-next'

const props = defineProps({
  darkMode: Boolean,
  currentLanguage: String
})

const emit = defineEmits(['toggleDarkMode', 'toggleLanguage', 'scrollTo', 'toggleMenu'])

// State management
const isScrolled = ref(false)
const isHidden = ref(false)
const mobileMenuOpen = ref(false)
const lastScrollY = ref(0)
const swing = ref(0)

// Navigation links
const navLinks = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'team', label: 'Team' },
  { id: 'publications', label: 'Publications' },
  { id: 'projects', label: 'Projects' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'contact', label: 'Contact' }
]

// Scroll handler with rope swing effect
const handleScroll = () => {
  const current = window.scrollY
  const delta = current - lastScrollY.value

  isScrolled.value = current > 20
  isHidden.value = delta > 8 && current > 120

  // Rope swing calculation (only on desktop)
  if (window.innerWidth >= 768) {
    swing.value += delta * 0.08
    swing.value *= 0.9
    swing.value = Math.max(-8, Math.min(8, swing.value))
  }

  lastScrollY.value = current
}

const scrollToSection = (id) => {
  emit('scrollTo', id)
  mobileMenuOpen.value = false
}

// Lifecycle
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
      'fixed z-50 transition-all duration-500 ease-out',
      'left-3 right-3 sm:left-4 sm:right-4 top-3 sm:top-4',
      isHidden ? '-translate-y-40 opacity-0' : 'opacity-100',
      isScrolled
        ? 'bg-white/75 backdrop-blur-xl shadow-2xl dark:bg-gray-900/75 dark:shadow-gray-900/50'
        : 'bg-white/95 shadow-lg dark:bg-gray-900/95',
      'border',
      isScrolled
        ? 'border-gray-200/40 dark:border-gray-700/40'
        : 'border-gray-200/60 dark:border-gray-700/30',
      'rounded-2xl'
    ]"
  >
    <!-- ROPES - Hidden on mobile, shown on desktop -->
    <div class="rope-wrap left-rope hidden md:block" :style="{ transform: `rotateZ(${swing}deg)` }">
      <span class="rope"></span>
      <span class="knot"></span>
    </div>

    <div class="rope-wrap right-rope hidden md:block" :style="{ transform: `rotateZ(${-swing}deg)` }">
      <span class="rope"></span>
      <span class="knot"></span>
    </div>

    <!-- NAV CONTENT -->
    <div class="container mx-auto px-4 sm:px-6 py-2.5 sm:py-2 flex items-center justify-between gap-3 sm:gap-4">
      <!-- LOGO - Optimized for mobile -->
      <div class="flex items-center space-x-2 sm:space-x-3 cursor-pointer group min-w-0 flex-shrink" @click="scrollToSection('hero')">
        <div class="relative flex-shrink-0">
          <img
            src="@/assets/image/logo/mcn.svg"
            alt="MCN Lab Logo"
            class="h-8 sm:h-10 md:h-12 w-auto"
          />
        </div>
      </div>

      <!-- DESKTOP NAV -->
      <nav class="hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8">
        <button
          v-for="link in navLinks"
          :key="link.id"
          @click="scrollToSection(link.id)"
          class="relative group cursor-pointer whitespace-nowrap"
        >
          <span
            :class="[
              'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium',
              'transition-colors duration-300 text-sm xl:text-base'
            ]"
          >
            {{ link.label }}
          </span>
          <span
            class="absolute left-0 -bottom-1 h-[2px] bg-gradient-to-r from-blue-600 to-blue-700 transition-all duration-300 w-0 group-hover:w-full"
          ></span>
        </button>
      </nav>

      <!-- RIGHT SECTION - Desktop -->
      <div class="hidden lg:flex items-center gap-3 xl:gap-4">
        <!-- Language Toggle -->
        <button @click="$emit('toggleLanguage')"
                class="flex items-center space-x-2 px-3 py-1.5 xl:py-2 rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 transition-colors duration-300">
          <span class="text-sm font-medium dark:text-gray-300">{{ currentLanguage }}</span>
        </button>

        <!-- Dark Mode Toggle -->
        <button @click="$emit('toggleDarkMode')"
                class="p-1.5 xl:p-2 rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 transition-colors duration-300">
          <Sun v-if="darkMode" class="w-5 h-5 text-yellow-500" />
          <Moon v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      <!-- MOBILE CONTROLS - Visible on mobile -->
      <div class="flex lg:hidden items-center gap-3">
        <!-- Dark Mode Toggle - Mobile -->
        <button @click="$emit('toggleDarkMode')"
                class="p-1.5 rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 transition-colors duration-300">
          <Sun v-if="darkMode" class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          <Moon v-else class="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <!-- Language Toggle - Mobile -->
        <button @click="$emit('toggleLanguage')"
                class="px-2 py-1.5 rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700 dark:hover:border-blue-500 transition-colors duration-300">
          <span class="text-xs font-medium dark:text-gray-300">{{ currentLanguage === '한국어' ? 'KO' : 'EN' }}</span>
        </button>

        <!-- Mobile Menu Button -->
        <button @click="$emit('toggleMenu')" class="ml-1">
          <div class="w-6 flex flex-col gap-1.5">
            <span :class="[
              'h-0.5 transition-transform duration-200',
              mobileMenuOpen ? 'rotate-45 translate-y-2' : 'bg-gray-700 dark:bg-gray-300'
            ]"></span>
            <span :class="[
              'h-0.5 transition-opacity duration-200',
              mobileMenuOpen ? 'opacity-0' : 'bg-gray-700 dark:bg-gray-300'
            ]"></span>
            <span :class="[
              'h-0.5 transition-transform duration-200',
              mobileMenuOpen ? '-rotate-45 -translate-y-2' : 'bg-gray-700 dark:bg-gray-300'
            ]"></span>
          </div>
        </button>
      </div>
    </div>

    <!-- MOBILE MENU -->
    <transition name="slide-fade">
      <div
        v-if="$slots.mobileMenu"
        class="lg:hidden px-4 sm:px-6 pb-4 pt-1 flex flex-col gap-3"
      >
        <slot name="mobileMenu" />
      </div>
    </transition>
  </header>
</template>

<style scoped>
/* ROPES */
.rope-wrap {
  position: absolute;
  top: -28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform-origin: top;
  pointer-events: none;
  z-index: -1;
}

.left-rope { left: 4rem; }
.right-rope { right: 4rem; }

.rope {
  width: 4px;
  height: 26px;
  background: repeating-linear-gradient(
    45deg,
    #c7a76c,
    #c7a76c 2px,
    #b8945f 2px,
    #b8945f 4px
  );
  border-radius: 2px;
}

.knot {
  width: 10px;
  height: 10px;
  background: #b8945f;
  border-radius: 50%;
  margin-top: 2px;
}

/* Mobile animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.25s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Active link indicator */
.active-link {
  @apply text-blue-600 dark:text-blue-400 font-semibold;
}

.active-link::after {
  content: '';
  @apply absolute left-0 -bottom-1 h-[2px] w-full bg-gradient-to-r from-blue-600 to-blue-700;
}

/* Better touch targets for mobile */
@media (max-width: 640px) {
  button {
    min-height: 36px;
    min-width: 36px;
  }
}
</style>
