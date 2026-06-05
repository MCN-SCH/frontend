<script setup>
import { Phone } from '@element-plus/icons-vue'

useSeoMeta({
  title: 'MCN | Unverified',
  description: 'Your phone number is not verified. Please verify your phone number to access the portal.'
})
</script>

<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <el-card class="max-w-md w-full text-center p-6 shadow-lg rounded-lg">
      <el-icon size="50" class="text-yellow-500 mb-3">
        <Phone />
      </el-icon>
      <h1 class="text-2xl font-bold text-yellow-600">Verification Required</h1>
      <p class="text-gray-600 mt-2">
        Please verify access before proceeding.
      </p>
      <el-button type="primary" class="mt-4 w-full" @click="navigateTo('/portal/otp')">
        Go Verify
      </el-button>
    </el-card>
  </div>
</template>

<style scoped>
.el-card {
  background-color: white;
}
</style>
