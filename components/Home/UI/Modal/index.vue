<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: String,
  subtitle: String,
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large', 'full'].includes(value)
  }
});

const emit = defineEmits(['close']);

const sizeClasses = {
  small: 'max-w-md',
  medium: 'max-w-2xl',
  large: 'max-w-4xl',
  full: 'max-w-full mx-4'
};

const handleBackgroundClick = (event) => {
  if (event.target === event.currentTarget) {
    emit('close');
  }
};
</script>

<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 backdrop-blur-sm transition-opacity duration-200"
    @click="handleBackgroundClick"
  >
    <div
      :class="[
        'bg-white dark:bg-gray-800 rounded-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl transition-all duration-300 transform',
        sizeClasses[size],
        show ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      ]"
    >
      <!-- Header -->
      <div v-if="title || $slots.header" class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
        <div>
          <h3 v-if="title" class="text-xl font-bold text-gray-900 dark:text-white">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ subtitle }}</p>
          <slot name="header" />
        </div>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-colors duration-200"
          aria-label="Close modal"
        >
          ✕
        </button>
      </div>

      <!-- Content -->
      <div class="p-6 overflow-auto">
        <slot />
      </div>

      <!-- Footer -->
      <div v-if="$slots.footer" class="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
