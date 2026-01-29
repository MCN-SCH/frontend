<script setup>
defineProps({
  text: String,
  type: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger', 'info'].includes(value)
  }
});

const typeClasses = {
  default: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  info: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
};
</script>

<template>
  <span class="px-3 py-1 rounded-full text-xs font-medium" :class="typeClasses[type]">
    {{ text }}
  </span>
</template>
