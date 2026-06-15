<script setup>
import { Microscope, Users2, Zap, Sparkles, Target, Globe, Shield, Cpu, Cloud, Brain } from 'lucide-vue-next';

const features = [
  {
    icon: Microscope,
    title: 'Research Excellence',
    description: 'Publishing in top-tier venues like IEEE, ACM, and advancing computing frontiers with innovative solutions.',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    icon: Users2,
    title: 'Collaborative Ecosystem',
    description: 'Fostering synergy between students, researchers, and industry leaders across Korea and globally.',
    color: 'from-teal-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600'
  },
  {
    icon: Zap,
    title: 'Real-World Impact',
    description: 'Translating research into practical solutions that drive Korea\'s digital transformation.',
    color: 'from-amber-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Building international partnerships and leading cross-border research initiatives.',
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
  }
];

const researchAreas = [
  {
    icon: Cpu,
    title: 'Distributed Systems',
    description: 'Cloud-native architectures, edge computing, and scalable infrastructure',
    color: 'border-blue-200 dark:border-blue-800'
  },
  {
    icon: Brain,
    title: 'AI/ML Systems',
    description: 'Optimization algorithms, neural architecture search, efficient ML',
    color: 'border-purple-200 dark:border-purple-800'
  },
  {
    icon: Cloud,
    title: '5G/6G Networks',
    description: 'Next-generation wireless, network slicing, IoT connectivity',
    color: 'border-teal-200 dark:border-teal-800'
  },
  {
    icon: Shield,
    title: 'Cyber Security',
    description: 'Privacy-preserving systems, threat detection, blockchain',
    color: 'border-amber-200 dark:border-amber-800'
  }
];

const patterns = {
  pattern1: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,20 L80,80 M80,20 L20,80' stroke='%233b82f6' stroke-width='2' fill='none' opacity='0.1'/%3E%3C/svg%3E`,
  pattern2: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' x='40' y='40' fill='%2310b981' opacity='0.1'/%3E%3C/svg%3E`,
  pattern3: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='10' fill='%23f59e0b' opacity='0.1'/%3E%3C/svg%3E`,
  pattern4: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,20 80,80 20,80' fill='%238b5cf6' opacity='0.1'/%3E%3C/svg%3E`,
  pattern5: `data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10' stroke='%23e5e7eb' fill='none' stroke-width='0.5'/%3E%3C/svg%3E`,
  pattern6: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,30 L70,70 M70,30 L30,70' stroke='%23333' stroke-width='2' opacity='0.05' fill='none'/%3E%3C/svg%3E`
};
</script>

<template>
  <section id="about" class="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
    <div class="absolute top-0 left-0 w-64 h-64 opacity-5 dark:opacity-10">
      <div class="w-full h-full" :style="{ backgroundImage: `url('${patterns.pattern6}')` }"></div>
    </div>

    <div class="container relative mx-auto px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 mb-6">
            <Sparkles class="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span class="text-sm font-semibold text-blue-700 dark:text-blue-300">선진 연구 | Advanced Research</span>
          </div>

          <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Advancing<br>Digital Future
          </h2>

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            At the <span class="font-bold text-blue-700 dark:text-blue-300">Mobile Computing & Networks Lab</span>,
            we blend <span class="font-semibold text-purple-600 dark:text-purple-400">Innovation</span> with
            <span class="font-semibold text-teal-600 dark:text-teal-400">global research excellence</span> to shape tomorrow's computing landscape.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          <div
            v-for="(feature, index) in features"
            :key="feature.title"
            class="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-8 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:border-transparent"
          >
            <div
              class="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity"
              :style="{ backgroundImage: `url('${patterns['pattern' + (index + 1)]}')` }"
            ></div>

            <div class="relative">
              <div class="mb-6 flex items-start justify-between">
                <div class="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg" :class="feature.gradient">
                  <component :is="feature.icon" class="w-8 h-8 text-white" />
                </div>
                <div class="text-4xl opacity-10 font-black text-gray-700 dark:text-gray-300 group-hover:opacity-20 transition-opacity">
                  {{ index + 1 }}
                </div>
              </div>

              <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300" :class="`group-hover:bg-gradient-to-r ${feature.color}`">
                {{ feature.title }}
              </h3>

              <p class="text-gray-600 dark:text-gray-400 leading-relaxed">
                {{ feature.description }}
              </p>

              <div class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                <div class="inline-flex items-center text-sm font-medium" :class="`text-transparent bg-clip-text bg-gradient-to-r ${feature.color}`">
                  Learn more
                  <svg class="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Mission & Research Focus - Split Layout -->
        <div class="grid lg:grid-cols-2 gap-8 mb-20">
          <!-- Mission Statement -->
          <div class="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-10">
            <div class="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"></div>
            <div
              class="absolute bottom-0 right-0 w-48 h-48 opacity-5"
              :style="{ backgroundImage: `url('${patterns.pattern2}')` }"
            ></div>

            <div class="relative">
              <div class="inline-flex items-center mb-6">
                <Target class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h3 class="text-2xl font-bold text-gray-800 dark:text-white">Our Vision</h3>
              </div>

              <p class="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-6">
                To pioneer research that bridges <span class="font-semibold text-blue-600 dark:text-blue-400">Technological heritage</span> with
                <span class="font-semibold text-purple-600 dark:text-purple-400">global computing innovation</span>, creating solutions that transform industries and society.
              </p>

              <div class="flex items-center space-x-4">
                <div class="flex-1 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
                <span class="text-sm font-semibold text-gray-500 dark:text-gray-400">서울 → 아산</span>
                <div class="flex-1 h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <!-- Research Areas -->
          <div class="grid grid-cols-2 gap-4">
            <div
              v-for="area in researchAreas"
              :key="area.title"
              class="group relative rounded-2xl p-6 border-2 transition-all duration-300 hover:scale-105 hover:shadow-xl cursor-pointer overflow-hidden"
              :class="[area.color, 'bg-white dark:bg-gray-900']"
            >
              <div
                class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                :style="{ backgroundImage: `url('${patterns.pattern6}')` }"
              ></div>

              <div class="relative">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                  <component :is="area.icon" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
                </div>
                <h4 class="font-bold text-gray-800 dark:text-white mb-2">{{ area.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">{{ area.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats Banner -->
        <div class="relative rounded-3xl bg-blue-500 p-10 mb-20 shadow-2xl overflow-hidden">
          <div
            class="absolute inset-0 opacity-10"
            :style="{ backgroundImage: `url('${patterns.pattern6}')` }"
          ></div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 relative z-10">
            <div class="text-center">
              <div class="text-4xl font-bold text-white mb-2">29+</div>
              <div class="text-blue-100">Research Papers</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-white mb-2">5+</div>
              <div class="text-blue-100">Partners</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-white mb-2">10+</div>
              <div class="text-blue-100">Countries</div>
            </div>
            <div class="text-center">
              <div class="text-4xl font-bold text-white mb-2">100%</div>
              <div class="text-blue-100">Innovation</div>
            </div>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="text-center">
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join us in shaping the future of computing research at Soonchunhyang University.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105">
              Explore Research
            </button>
            <button class="px-8 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-semibold hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300">
              Contact Lab
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom decorative element -->
    <div class="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <div
        class="w-full h-full opacity-20 dark:opacity-10"
        :style="{ backgroundImage: `url('${patterns.pattern5}')` }"
      ></div>
    </div>
  </section>
</template>

<style scoped>
/* Custom carousel slide transitions */
:deep(.el-carousel__item) {
  transition: transform 0.5s ease-in-out;
}

:deep(.el-carousel__mask) {
  border-radius: 24px;
}

:deep(.el-carousel__item) {
  border-radius: 24px;
}

/* Gradient text animations */
@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Hover effects */
.group:hover .group-hover\:bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 2s ease infinite;
}

/* Korean pattern styles */
.pattern-bg-1 {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,20 L80,80 M80,20 L20,80' stroke='%233b82f6' stroke-width='2' fill='none' opacity='0.1'/%3E%3C/svg%3E");
}

.pattern-bg-2 {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' x='40' y='40' fill='%2310b981' opacity='0.1'/%3E%3C/svg%3E");
}

.pattern-bg-3 {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='10' fill='%23f59e0b' opacity='0.1'/%3E%3C/svg%3E");
}

.pattern-bg-4 {
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,20 80,80 20,80' fill='%238b5cf6' opacity='0.1'/%3E%3C/svg%3E");
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2.5rem;
  }

  :deep(.el-carousel) {
    height: 300px !important;
  }

  .p-12 {
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .text-5xl {
    font-size: 2rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .p-10 {
    padding: 1.5rem;
  }
}
</style>
