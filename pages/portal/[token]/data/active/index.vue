<script setup>
import { Tools } from '@element-plus/icons-vue'

useHead({
  title: 'Under Maintenance'
})

definePageMeta({
  layout: 'admin',
  middleware: ['authenticated'],
})

</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6"
  >
    <div class="max-w-lg w-full text-center">
      <div
        class="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10"
      >
        <el-icon :size="50">
          <Tools />
        </el-icon>
      </div>

      <h1 class="text-4xl font-bold text-gray-800 mb-4">
        Under Maintenance
      </h1>

      <p class="text-gray-600 text-lg mb-8">
        We're currently performing scheduled maintenance to improve our
        services. Please check back shortly.
      </p>

      <div
        class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
      >
        <div class="flex items-center justify-center gap-2 mb-4">
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"
            />
            <span
              class="relative inline-flex rounded-full h-3 w-3 bg-orange-500"
            />
          </span>

          <span class="font-medium text-gray-700">
            Maintenance in Progress
          </span>
        </div>

        <p class="text-sm text-gray-500">
          We apologize for the inconvenience and appreciate your patience.
        </p>
      </div>

      <div class="mt-8">
        <el-button
          type="primary"
          size="large"
        >
          Refresh
        </el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-primary\/10 {
  background-color: rgba(64, 158, 255, 0.1);
}
</style>
