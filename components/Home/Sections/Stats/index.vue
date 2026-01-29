<script setup>
const props = defineProps({
  achievements: Array
});

const defaultAchievements = [
  { count: '20+', label: 'Graduate Students', description: 'Mentored in cutting-edge research projects', icon: '👨‍🎓', color: '#00897B' },
  { count: '100+', label: 'Research Papers', description: 'International Publications', icon: '📄', color: '#2196F3' },
  { count: '50+', label: 'Projects', description: 'Completed & Ongoing', icon: '🚀', color: '#FF9800' },
  { count: '30+', label: 'Patents', description: 'Registered & Pending', icon: '⚡', color: '#9C27B0' },
  { count: '1M+', label: 'Citations', description: 'Global Impact', icon: '📈', color: '#4CAF50' },
  { count: '15+', label: 'Countries', description: 'Collaborations Worldwide', icon: '🌏', color: '#F44336' }
];
</script>

<template>
  <section class="py-12 relative overflow-hidden bg-gradient-to-b from-blue-950 via-indigo-900 to-blue-900">
    <!-- Korean pattern background -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Subtle grid pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
      </div>

      <!-- Gradient overlays -->
      <div class="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-500/10 to-transparent"></div>
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-indigo-500/10 to-transparent"></div>

      <!-- Korean geometric patterns in blue tones -->
      <div class="absolute -top-20 -right-20 w-40 h-40 opacity-10">
        <div class="w-full h-full border-4 border-blue-400 rounded-full"></div>
      </div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 opacity-10">
        <div class="grid grid-cols-4 gap-1">
          <div v-for="n in 16" :key="n"
               class="w-2 h-2 bg-blue-400 rounded-full transform rotate-45"></div>
        </div>
      </div>

      <!-- Floating dots -->
      <div v-for="i in 12" :key="'dot-' + i"
           class="absolute w-1 h-1 bg-blue-400/30 rounded-full"
           :style="{
             top: Math.random() * 100 + '%',
             left: Math.random() * 100 + '%',
             animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
             animationDelay: `${Math.random() * 2}s`
           }"></div>
    </div>

    <div class="container mx-auto px-4 md:px-8 relative z-10">
      <div class="max-w-7xl mx-auto text-center mb-10">
        <!-- Animated gradient badge -->
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-blue-400/10 backdrop-blur-sm border border-blue-400/30 mb-4">
          <div class="w-2 h-2 bg-gradient-to-r from-blue-400 to-cyan-300 rounded-full animate-pulse"></div>
          <span class="text-sm font-medium text-blue-100">OUR IMPACT • 우리의 영향력</span>
        </div>

        <h2 class="text-2xl md:text-3xl font-bold text-white mb-3">
          Numbers That <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Speak</span>
        </h2>
        <p class="text-blue-200/80 max-w-xl mx-auto">
          Quantifying our research excellence and global footprint
        </p>
      </div>

      <!-- Stats Grid with modern cards -->
      <div class="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-5 xl:grid-cols-5 gap-4 md:gap-6">
        <div
          v-for="(stat, index) in (achievements || defaultAchievements)"
          :key="stat.label"
          class="group"
        >
          <div class="bg-gradient-to-br from-blue-800/40 to-blue-900/60 backdrop-blur-sm rounded-xl p-5 h-full border border-blue-700/30 hover:border-blue-400/50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1">
            <!-- Icon with gradient background - using custom color if provided -->
            <div class="mb-4">
              <div
                class="w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg"
                :style="{
                  background: stat.color
                    ? `linear-gradient(135deg, ${stat.color}20, ${stat.color}40)`
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(6, 182, 212, 0.3))',
                  boxShadow: stat.color
                    ? `0 10px 15px -3px ${stat.color}20`
                    : '0 10px 15px -3px rgba(59, 130, 246, 0.2)'
                }"
              >
                <span class="text-2xl">{{ stat.icon }}</span>
              </div>
            </div>

            <!-- Animated counter (conceptual - would need JS for actual counting) -->
            <div class="relative mb-2">
              <div class="text-3xl md:text-4xl font-bold text-white mb-1">
                {{ stat.count }}
              </div>
              <!-- Animated underline on hover - using custom color if provided -->
              <div
                class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 rounded-full group-hover:w-3/4 transition-all duration-500"
                :style="{
                  background: stat.color
                    ? `linear-gradient(to right, ${stat.color}, ${stat.color}CC)`
                    : 'linear-gradient(to right, #60A5FA, #22D3EE)'
                }"
              ></div>
            </div>

            <!-- Label and description -->
            <h3 class="text-sm font-semibold text-blue-100 mb-1">{{ stat.label }}</h3>
            <p class="text-xs text-blue-300/70 flex-grow">{{ stat.description }}</p>

            <!-- Progress indicator (visual only) - using custom color if provided -->
            <div class="w-full mt-4">
              <div class="h-1 w-full bg-blue-900/50 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :style="{
                    width: `${(index + 1) * 15}%`,
                    background: stat.color
                      ? `linear-gradient(to right, ${stat.color}, ${stat.color}AA)`
                      : 'linear-gradient(to right, #60A5FA, #22D3EE)'
                  }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Custom animations */
@keyframes float {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.3;
  }
  33% {
    transform: translateY(-10px) translateX(5px);
    opacity: 0.5;
  }
  66% {
    transform: translateY(5px) translateX(-5px);
    opacity: 0.4;
  }
}

/* Smooth transitions */
* {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass effect enhancement */
.bg-gradient-to-br {
  backdrop-filter: blur(10px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .p-5 {
    padding: 1rem;
  }

  .text-3xl {
    font-size: 1.75rem;
  }
}

@media (min-width: 1024px) {
  .xl\:grid-cols-6 {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
