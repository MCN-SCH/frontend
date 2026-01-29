<script setup>
import { ChevronUp } from 'lucide-vue-next';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['click']);
</script>

<template>
  <button
    @click="$emit('click')"
    :class="[
      'fixed right-6 bottom-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group',
      show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
    ]"
    aria-label="Scroll to top"
  >
    <ChevronUp class="w-6 h-6 transition-transform group-hover:-translate-y-1" />
    <div class="absolute inset-0 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors"></div>
  </button>
</template>
