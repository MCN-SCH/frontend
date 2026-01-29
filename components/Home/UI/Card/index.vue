<script setup>
defineProps({
  title: String,
  subtitle: String,
  description: String,
  image: String,
  tags: Array,
  stats: Array,
  color: {
    type: String,
    default: '#3F7BBD'
  }
});

const emit = defineEmits(['click']);
</script>

<template>
  <div class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
    <div v-if="image" class="h-48 bg-gradient-to-br from-blue-400 to-blue-600 relative overflow-hidden">
      <slot name="image">
        <div class="absolute inset-0 flex items-center justify-center">
          <slot name="icon" />
        </div>
      </slot>
    </div>

    <div class="p-6">
      <div v-if="$slots.header" class="mb-4">
        <slot name="header" />
      </div>

      <h3 v-if="title" class="text-xl font-bold mb-3">{{ title }}</h3>
      <p v-if="subtitle" class="text-blue-600 dark:text-blue-400 text-sm font-medium mb-2">{{ subtitle }}</p>
      <p v-if="description" class="text-gray-600 dark:text-gray-300 mb-4">{{ description }}</p>

      <div v-if="tags" class="flex flex-wrap gap-2 mb-4">
        <span v-for="tag in tags" :key="tag"
              class="px-3 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
          {{ tag }}
        </span>
      </div>

      <div v-if="stats" class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <div v-for="stat in stats" :key="stat.label" class="flex items-center">
          <component :is="stat.icon" class="w-4 h-4 mr-1" />
          {{ stat.value }}
        </div>
      </div>

      <slot />

      <button v-if="$slots.action" @click="emit('click')"
              class="mt-4 text-blue-600 dark:text-blue-400 font-medium text-sm flex items-center group">
        <slot name="action" />
      </button>
    </div>
  </div>
</template>
