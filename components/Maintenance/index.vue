<script setup>
import { ref, onMounted } from 'vue'
import { ElButton, ElProgress, ElTooltip } from 'element-plus'
import {
  Clock,
  Mail,
  AlertCircle,
  Calendar,
  Shield,
  HardHat,
  Server,
  Settings,
} from 'lucide-vue-next'

const props = defineProps({
  title: {
    type: String,
    default: 'Under Maintenance',
  },
  subtitle: {
    type: String,
    default: "We're working hard to improve your experience",
  },
  progress: {
    type: Number,
    default: 65,
  },
  estimatedCompletion: {
    type: String,
    default: 'December 31, 2024',
  },
  contactEmail: {
    type: String,
    default: 'support@sch-lab.edu',
  },
  showContact: {
    type: Boolean,
    default: true,
  },
  showProgress: {
    type: Boolean,
    default: true,
  },
})

const currentTime = ref('')
const isDarkMode = ref(false)

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)

  // Check dark mode
  if (typeof window !== 'undefined') {
    isDarkMode.value = window.matchMedia('(prefers-color-scheme: dark)').matches
  }
})

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour12: true,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

const handleContact = () => {
  window.location.href = `mailto:${props.contactEmail}`
}

const handleRefresh = () => {
  window.location.reload()
}
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4"
  >
    <div class="max-w-4xl w-full mx-auto">
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          class="absolute -top-40 -right-40 w-60 h-60 md:w-80 md:h-80 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
        ></div>
        <div
          class="absolute -bottom-40 -left-40 w-60 h-60 md:w-80 md:h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"
        ></div>
      </div>

      <div
        class="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 border border-gray-200 dark:border-gray-700"
      >
        <!-- Header -->
        <div class="text-center mb-6 md:mb-10">
          <img
            src="@/assets/image/logo/mcn.svg"
            alt="Maintenance Icon"
            class="mx-auto"
          />

          <p
            class="mt-5 text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto px-2"
          >
            {{ subtitle }}
          </p>
        </div>
        <!-- Notice Box -->
        <div
          class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl p-4 md:p-6 mb-6 md:mb-10 border border-yellow-200 dark:border-yellow-700"
        >
          <div class="flex items-start gap-3 md:gap-4">
            <AlertCircle
              class="w-6 h-6 md:w-8 md:h-8 text-yellow-600 dark:text-yellow-400 mt-0.5 md:mt-1 flex-shrink-0"
            />
            <div>
              <h3
                class="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3"
              >
                Important Notice
              </h3>
              <div
                class="space-y-2 md:space-y-3 text-sm md:text-base text-gray-700 dark:text-gray-300"
              >
                <p>
                  We are currently performing scheduled maintenance to improve
                  system performance and add new features.
                </p>
                <ul class="list-disc pl-4 md:pl-5 space-y-1 md:space-y-2">
                  <li>Some features may be temporarily unavailable</li>
                  <li>Data is being backed up regularly</li>
                  <li>No data will be lost during maintenance</li>
                  <li>Estimated downtime: 2-4 hours</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col xs:flex-row gap-3 md:gap-4 justify-center">
          <div>
            <ElButton
              v-if="showContact"
              type="primary"
              :size="'default'"
              @click="handleContact"
              class="flex items-center justify-center gap-1 md:gap-2 w-full xs:w-auto"
            >
              <Mail class="w-4 h-4 md:w-5 md:h-5" />
              <span class="text-sm md:text-base">Contact Support</span>
            </ElButton>
          </div>

          <ElButton
            type="success"
            :size="'default'"
            @click="handleRefresh"
            class="flex items-center justify-center gap-1 md:gap-2 w-full xs:w-auto"
          >
            <Settings class="w-4 h-4 md:w-5 md:h-5" />
            <span class="text-sm md:text-base">Refresh Page</span>
          </ElButton>
          <div>
            <ElButton
              type="info"
              :size="'default'"
              @click="handleRefresh"
              class="flex items-center justify-center gap-1 md:gap-2 w-full xs:w-auto"
            >
              <Clock class="w-4 h-4 md:w-5 md:h-5" />
              <span class="text-sm md:text-base">Check Status</span>
            </ElButton>
          </div>
        </div>

        <!-- Footer -->
        <div
          class="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-200 dark:border-gray-700 text-center"
        >
          <p class="text-xs md:text-sm text-gray-500 dark:text-gray-400">
            Soonchunhyang University Research Lab • MCN Laboratory •
            {{ new Date().getFullYear() }}
          </p>
          <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Maintenance ID: SCH-MNT-{{
              new Date().getTime().toString().slice(-8)
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* Custom breakpoint for extra small screens */
@media (min-width: 475px) {
  .xs\:flex-row {
    flex-direction: row;
  }

  .xs\:w-auto {
    width: auto;
  }
}

/* Improve mobile touch targets */
@media (max-width: 640px) {
  :deep(.el-button) {
    padding: 10px 16px;
    min-height: 44px;
  }
}
</style>
