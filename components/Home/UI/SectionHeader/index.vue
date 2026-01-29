<script setup>
defineProps({
  title: String,
  subtitle: String,
  badgeText: String,
  badgeIcon: String,
  showViewAll: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <div class="text-center mb-16">
    <div v-if="badgeText" class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
      {{ badgeText }}
    </div>
    <h2 class="text-4xl font-bold mb-6">{{ title }}</h2>
    <p v-if="subtitle" class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
      {{ subtitle }}
    </p>
    <slot />
  </div>
</template>
