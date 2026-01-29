<script setup>
import { ChevronRight } from 'lucide-vue-next';

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value)
  },
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  icon: String,
  iconPosition: {
    type: String,
    default: 'right',
    validator: (value) => ['left', 'right'].includes(value)
  },
  fullWidth: Boolean
});

const variantClasses = {
  primary: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl',
  secondary: 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg',
  outline: 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20'
};

const sizeClasses = {
  small: 'px-4 py-2 text-sm',
  medium: 'px-6 py-3 text-base',
  large: 'px-8 py-4 text-lg'
};
</script>

<template>
  <button
    :class="[
      'rounded-lg font-semibold transition-all duration-300 flex items-center justify-center',
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? 'w-full' : '',
      $slots.default && icon ? 'gap-2' : ''
    ]"
  >
    <component v-if="icon && iconPosition === 'left'" :is="icon" class="w-5 h-5" />
    <slot />
    <component v-if="icon && iconPosition === 'right'" :is="icon" class="w-5 h-5" />
    <ChevronRight v-if="!icon && iconPosition === 'right'" class="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
  </button>
</template>
