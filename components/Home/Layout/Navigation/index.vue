<script setup>
import { Cpu, Sun, Moon, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  darkMode: Boolean,
  currentLanguage: String
});

const emit = defineEmits(['toggleDarkMode', 'toggleLanguage', 'scrollTo', 'toggleMenu']);

const menuItems = [
  { id: 'about', label: 'About' },
  { id: 'research', label: 'Research' },
  { id: 'people', label: 'People' },
  { id: 'publications', label: 'Publications' },
  { id: 'projects', label: 'Projects' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'contact', label: 'Contact' }
];
</script>

<template>
  <nav class="fixed w-full z-50 backdrop-blur-xl bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-white/10 shadow-lg">    <div class="container mx-auto px-6 py-3">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center space-x-3 cursor-pointer group" @click="$emit('scrollTo', 'hero')">
          <div class="relative">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
              <Cpu class="w-6 h-6 text-white" />
            </div>
            <div class="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <div class="font-bold text-lg dark:text-white">MCN Research Lab</div>
            <div class="text-xs text-gray-500 dark:text-gray-400">Soonchunhyang University</div>
          </div>
        </div>

        <!-- Desktop Menu -->
        <div class="hidden lg:flex items-center space-x-8">
          <button
            v-for="item in menuItems"
            :key="item.id"
            @click="$emit('scrollTo', item.id)"
            class="nav-link font-medium"
          >
            {{ item.label }}
          </button>

          <!-- Control Buttons -->
          <div class="flex items-center space-x-3">
            <button @click="$emit('toggleLanguage')"
                    class="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700">
              <span class="text-sm font-medium">{{ currentLanguage }}</span>
            </button>
            <button @click="$emit('toggleDarkMode')"
                    class="p-2 rounded-lg border border-gray-200 hover:border-blue-500 dark:border-gray-700">
              <Sun v-if="darkMode" class="w-5 h-5 text-yellow-500" />
              <Moon v-else class="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu Button -->
        <button @click="$emit('toggleMenu')" class="lg:hidden">
          <div class="space-y-1.5">
            <div class="w-6 h-0.5 bg-gray-700 dark:bg-gray-300"></div>
            <div class="w-6 h-0.5 bg-gray-700 dark:bg-gray-300"></div>
            <div class="w-6 h-0.5 bg-gray-700 dark:bg-gray-300"></div>
          </div>
        </button>
      </div>

      <!-- Mobile Menu -->
      <div v-if="$slots.mobileMenu" class="lg:hidden mt-4 pb-4 space-y-3">
        <slot name="mobileMenu" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link {
  @apply text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-300 relative;
  &::after {
    content: '';
    @apply absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-300;
  }
  &:hover::after {
    @apply w-full;
  }
}
</style>
