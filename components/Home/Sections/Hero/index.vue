<script setup>
import { ref, onMounted } from 'vue'
import {
  Rocket,
  Server,
  ChevronRight,
  Sparkles,
  TrendingUp,
  Users,
  Award,
  BookOpen,
  Zap,
  ArrowRight,
  Calendar,
  Shield,
} from 'lucide-vue-next'

defineProps({
  showKoreanText: Boolean,
})

const emit = defineEmits(['scrollTo'])

const heroSlides = ref([
  {
    id: 1,
    title: 'AI-Enhanced Mobile Computing',
    description: 'Developing next-gen AI algorithms for mobile edge computing',
    icon: Zap,
    color: 'from-blue-500 to-cyan-400',
    bgColor: 'bg-blue-500/10',
    achievements: ['IEEE MobiCom 2023', '5 Patents'],
  },
  {
    id: 2,
    title: '6G Network Research',
    description: 'Pioneering 6G communication technologies and standards',
    icon: TrendingUp,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    achievements: ['3 National Projects', '₩800M Funding'],
  },
  {
    id: 3,
    title: 'Cloud-Native Systems',
    description: 'Building scalable cloud infrastructure for smart cities',
    icon: Server,
    color: 'from-green-500 to-emerald-400',
    bgColor: 'bg-green-500/10',
    achievements: ['ACM SIGCOMM 2024', 'Industry Collaboration'],
  },
  {
    id: 4,
    title: 'IoT Security Solutions',
    description: 'Advanced security frameworks for IoT ecosystems',
    icon: Shield,
    color: 'from-orange-500 to-yellow-400',
    bgColor: 'bg-orange-500/10',
    achievements: ['Best Paper Award', 'Tech Transfer'],
  },
])

const currentSlide = ref(0)

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
}

const prevSlide = () => {
  currentSlide.value =
    (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
}

onMounted(() => {
  const interval = setInterval(nextSlide, 5000)
  return () => clearInterval(interval)
})
</script>

<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center pt-20 md:pt-16 lg:pt-16 overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-gradient-to-br from-white via-blue-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900"
    >
      <div class="absolute inset-0 opacity-5">
        <div
          class="absolute top-10 left-10 w-64 h-64 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNDUgMzBMMzAgNDVMMTUgMzBMMzAgMTVaIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDc4RkYiIHN0cm9rZS13aWR0aD0iMC41Ii8+PC9zdmc+')]"
        ></div>
        <div
          class="absolute bottom-10 right-10 w-96 h-96 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzNSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMDA3OEZGIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLWRhc2hhcnJheT0iMiAyIi8+PC9zdmc+')]"
        ></div>
      </div>
    </div>

    <div class="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <div class="relative">
            <div
              class="inline-flex flex-col sm:flex-row sm:items-center gap-2 px-4 py-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 shadow-lg"
            >
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                >
                  <Rocket class="w-3 h-3 text-white" />
                </div>
                <span class="font-bold"
                  >Soonchunhyang University's Research Lab</span
                >
              </div>
              <span class="text-center sm:text-left">Since 20**</span>
            </div>

            <div class="mb-6 text-center md:text-left">
              <h1
                class="text-3xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
              >
                <span class="block text-gray-900 dark:text-white"
                  >Mobile Computing</span
                >
                <span class="block">
                  <span
                    class="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
                  >
                    & Networking Lab
                  </span>
                  <Sparkles
                    class="w-8 h-8 md:w-10 md:h-10 inline-block ml-3 text-yellow-400"
                  />
                </span>
              </h1>
              <div
                class="flex items-center justify-center md:justify-start gap-2 text-lg text-gray-600 dark:text-gray-300"
              >
                <div
                  class="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-transparent"
                ></div>
                <span>SCHU MCN Laboratory</span>
              </div>
            </div>

            <p class="text-xl text-gray-700 dark:text-gray-300 mb-5 leading-relaxed font-medium text-center md:text-left">
  <span class="block text-blue-600 dark:text-blue-400 font-bold mt-2">
    AI • 6G • Cloud • IoT • Security
  </span>
            </p>

            <!-- Stats Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div
                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-2">
                  <BookOpen class="w-5 h-5 text-blue-500" />
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    45+
                  </div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Research Papers
                </div>
              </div>
              <div
                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-2">
                  <Users class="w-5 h-5 text-green-500" />
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    12+
                  </div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Researchers
                </div>
              </div>
              <div
                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-2">
                  <Award class="w-5 h-5 text-yellow-500" />
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    ₩2.1B
                  </div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Research Funding
                </div>
              </div>
              <div
                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="flex items-center gap-2">
                  <Calendar class="w-5 h-5 text-purple-500" />
                  <div class="text-2xl font-bold text-gray-900 dark:text-white">
                    8
                  </div>
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Active Projects
                </div>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-wrap gap-4">
              <HomeUIButton
                @click="$emit('scrollTo', 'research')"
                class="group relative overflow-hidden p-2"
                :icon="ChevronRight"
                icon-position="right"
                size="lg"
              >
                <span class="relative z-10">Explore Research</span>
                <div
                  class="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-700 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 -z-10"
                ></div>
              </HomeUIButton>
              <HomeUIButton
                @click="$emit('scrollTo', 'contact')"
                variant="secondary"
                size="lg"
                class="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 transition-all p-2"
              >
                Join Our Team
              </HomeUIButton>
            </div>
          </div>

          <!-- Right Content - Slideshow -->
          <div class="relative">
            <!-- Main Slide Container -->
            <div
              class="relative bg-gradient-to-br from-white to-blue-50/30 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-1 shadow-2xl overflow-hidden"
            >
              <div
                class="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5"
              ></div>

              <!-- Slide Content -->
              <div
                class="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-8"
              >
                <!-- Slide Navigation -->
                <div class="flex justify-between items-center mb-6">
                  <div class="flex items-center gap-2">
                    <div
                      v-for="(slide, index) in heroSlides"
                      :key="slide.id"
                      @click="currentSlide = index"
                      class="w-2 h-2 rounded-full cursor-pointer transition-all"
                      :class="
                        currentSlide === index
                          ? 'bg-blue-500 w-6'
                          : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
                      "
                    ></div>
                  </div>
                  <div class="flex gap-2">
                    <el-button
                      @click="prevSlide"
                      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Previous slide"
                    >
                      <ArrowRight class="w-5 h-5 rotate-180" />
                    </el-button>
                    <el-button
                      @click="nextSlide"
                      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      aria-label="Next slide"
                    >
                      <ArrowRight class="w-5 h-5" />
                    </el-button>
                  </div>
                </div>

                <!-- Current Slide -->
                <div class="space-y-6">
                  <div class="flex items-center gap-4">
                    <div
                      class="w-16 h-16 rounded-2xl flex items-center justify-center"
                      :class="[
                        heroSlides[currentSlide].bgColor,
                        heroSlides[currentSlide].color.replace(
                          'from-',
                          'bg-gradient-to-r ',
                        ),
                      ]"
                    >
                      <component
                        :is="heroSlides[currentSlide].icon"
                        class="w-8 h-8 text-white"
                      />
                    </div>
                    <div>
                      <div
                        class="text-sm text-blue-600 dark:text-blue-400 font-semibold"
                      >
                        Research Focus
                      </div>
                      <h3
                        class="text-2xl font-bold text-gray-900 dark:text-white"
                      >
                        {{ heroSlides[currentSlide].title }}
                      </h3>
                    </div>
                  </div>

                  <p class="text-gray-600 dark:text-gray-300 text-lg">
                    {{ heroSlides[currentSlide].description }}
                  </p>

                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="(achievement, idx) in heroSlides[currentSlide]
                        .achievements"
                      :key="idx"
                      class="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    >
                      {{ achievement }}
                    </span>
                  </div>

                  <!-- Progress Indicator -->
                  <div class="pt-4">
                    <div
                      class="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                    >
                      <div
                        class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500"
                        :style="{ width: `${(currentSlide + 1) * 25}%` }"
                      ></div>
                    </div>
                    <div
                      class="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2"
                    >
                      <span
                        >Research Area {{ currentSlide + 1 }}/{{
                          heroSlides.length
                        }}</span
                      >
                      <span class="font-medium">Key Achievements</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Floating Elements (Modern GenZ Style) -->
              <div
                class="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-400 rounded-2xl rotate-12 opacity-20 blur-sm"
              ></div>
              <div
                class="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-400 rounded-3xl -rotate-12 opacity-20 blur-sm"
              ></div>
            </div>

            <!-- Additional Info Cards -->
            <div class="grid grid-cols-2 gap-4 mt-6">
              <div
                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  International Collaboration
                </div>
                <div class="font-bold text-gray-900 dark:text-white">
                  KAIST • POSTECH • Seoul National
                </div>
              </div>
              <div
                class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 border border-gray-200 dark:border-gray-700"
              >
                <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">
                  Industry Partners
                </div>
                <div class="font-bold text-gray-900 dark:text-white">
                  Samsung • LG • Naver
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce sm:none md:animate-bounce"
    >
      <div
        class="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
      >
        <div class="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-grid-pattern {
  background-image:
    linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.floating-element {
  animation: float 3s ease-in-out infinite;
}

.hero-title {
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

/* Modern Korean color palette accents */
:deep(.button-primary) {
  background: linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%);
  border: none;
}

:deep(.button-secondary) {
  background: transparent;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

:deep(.button-secondary:hover) {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.1);
}
</style>
