<script setup>
import { useAuthStore } from '~/store/auth.js'

const route = useRoute()

const authStore = useAuthStore()
const deviceCookie = useCookie('device_id')

</script>

<template>
  <div>
    Secret Content
  </div>
</template>
