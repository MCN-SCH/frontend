<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#3853A4]"
    >
      <!-- Animated Tech Grid Background -->
      <div class="absolute inset-0 tech-grid"></div>

      <!-- Soft Moving Gradient Overlay -->
      <div class="absolute inset-0 animated-overlay"></div>

      <!-- Content -->
      <div class="relative text-center text-white px-6">

        <!-- Animated Logo -->
        <div class="relative flex items-center justify-center mb-10">

          <!-- Pulse Ring -->
          <div class="absolute w-40 h-40 rounded-full border-2 border-[#4CC8EE] animate-pulse-ring opacity-40"></div>

          <!-- Logo Circle -->
          <div class="w-28 h-28 rounded-full bg-[#4CC8EE] flex items-center justify-center shadow-2xl">
            <span class="text-[#3853A4] text-2xl font-bold tracking-widest">
              MCN
            </span>
          </div>

        </div>

        <!-- Lab Name -->
        <h1 class="text-2xl md:text-3xl font-bold tracking-wide">
          Mobile Computing & Networks Lab
        </h1>

        <p class="mt-2 text-sm opacity-80">
          Soonchunhyang University · Republic of Korea
        </p>

        <!-- Divider -->
        <div class="w-24 h-[2px] bg-[#4CC8EE] mx-auto my-6"></div>

        <!-- Progress Bar -->
        <el-progress
          :percentage="percentage"
          :stroke-width="8"
          :show-text="false"
          class="w-64 mx-auto"
          color="#4CC8EE"
        />

        <p class="mt-4 text-sm opacity-80 tracking-wide">
          Initializing Network Systems... {{ percentage }}%
        </p>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const visible = ref(true)
const percentage = ref(0)

onMounted(() => {
  const interval = setInterval(() => {
    if (percentage.value < 100) {
      percentage.value += 5
    } else {
      clearInterval(interval)
      setTimeout(() => {
        visible.value = false
      }, 400)
    }
  }, 100)
})
</script>

<style scoped>

/* Fade Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================
   Animated Tech Grid
========================= */
.tech-grid {
  background-color: #3853A4;
  background-image:
    linear-gradient(#4CC8EE33 1px, transparent 1px),
    linear-gradient(90deg, #4CC8EE33 1px, transparent 1px);
  background-size: 40px 40px;
  animation: gridMove 20s linear infinite;
  opacity: 0.25;
}

@keyframes gridMove {
  from { background-position: 0 0; }
  to { background-position: 40px 40px; }
}

/* =========================
   Soft Moving Overlay
========================= */
.animated-overlay {
  background: linear-gradient(
    -45deg,
    #3853A4,
    #4CC8EE,
    #3853A4,
    #4CC8EE
  );
  background-size: 400% 400%;
  animation: gradientFlow 12s ease infinite;
  opacity: 0.15;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* =========================
   Pulse Ring Animation
========================= */
@keyframes pulseRing {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  70% {
    transform: scale(1.6);
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
}

.animate-pulse-ring {
  animation: pulseRing 2.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}

</style>
