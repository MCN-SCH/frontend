<script setup>

// You can set this from environment or API
const isMaintenanceMode = true // Set to false when not in maintenance

definePageMeta({
  layout: 'default',
  middleware: ['maintenance'],
})

// Custom maintenance data
const maintenanceData = {
  subtitle: 'Our website is undergoing scheduled upgrades',
  progress: 75,
  estimatedCompletion: 'January 15, 2025, 18:00 KST',
  contactEmail: 'mcn-lab@sch.ac.kr',
  showContact: true,
  showProgress: true
}

console.log('Maintenance Mode:', isMaintenanceMode)
</script>

<template>
  <div>
    <Maintenance
      v-if="isMaintenanceMode"
      v-bind="maintenanceData"
    />
    <div v-else>
    </div>
  </div>
</template>
