<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BrainCircuit,
  Network,
  Cloud,
  ShieldCheck,
  Globe2,
  Microscope,
  Lightbulb,
  FlaskConical,
} from 'lucide-vue-next'

const props = defineProps({
  showKoreanText: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'AI Convergence Technology Research Center',
  },
  subTitle: {
    type: String,
    default:
      'Advancing intelligent technologies through interdisciplinary research, innovation, and collaboration.',
  },
  laboratory: {
    type: String,
    default: 'Soonchunhyang University',
  },
})

const emit = defineEmits(['scrollTo'])

const currentSlide = ref(0)
let slideInterval = null

const slides = [
  {
    number: '01',
    category: 'ARTIFICIAL INTELLIGENCE',
    title: 'Intelligent AI for a Smarter Future',
    koreanTitle: '더 나은 미래를 위한 지능형 인공지능',
    description:
      'Exploring intelligent algorithms, machine learning, and deep learning to develop innovative solutions for complex real-world challenges.',
    icon: BrainCircuit,
    tags: ['Machine Learning', 'Deep Learning', 'AI Models'],
  },
  {
    number: '02',
    category: 'NEXT-GENERATION NETWORKS',
    title: 'Connecting Intelligence Everywhere',
    koreanTitle: '어디서나 연결되는 지능형 기술',
    description:
      'Investigating intelligent communication systems, next-generation networks, and connected technologies for an increasingly digital world.',
    icon: Network,
    tags: ['6G Networks', 'IoT', 'Wireless Systems'],
  },
  {
    number: '03',
    category: 'CLOUD & EDGE COMPUTING',
    title: 'Building Distributed Intelligence',
    koreanTitle: '분산 지능형 컴퓨팅 기술',
    description:
      'Developing scalable computing architectures and distributed intelligence through cloud, edge, and collaborative computing technologies.',
    icon: Cloud,
    tags: ['Cloud Computing', 'Edge AI', 'Distributed Systems'],
  },
  {
    number: '04',
    category: 'TRUST & SECURITY',
    title: 'Creating a Secure Digital Future',
    koreanTitle: '안전하고 신뢰할 수 있는 디지털 미래',
    description:
      'Exploring trustworthy AI, intelligent security, and privacy-preserving technologies to support reliable digital ecosystems.',
    icon: ShieldCheck,
    tags: ['AI Security', 'Privacy', 'Trustworthy AI'],
  },
]

const activeSlide = computed(() => slides[currentSlide.value])

function nextSlide() {
  currentSlide.value = (currentSlide.value + 1) % slides.length
}

function previousSlide() {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length
}

function goToSlide(index) {
  currentSlide.value = index
}

function navigateTo(section) {
  emit('scrollTo', section)
}

onMounted(() => {
  slideInterval = setInterval(nextSlide, 6000)
})

onBeforeUnmount(() => {
  if (slideInterval) {
    clearInterval(slideInterval)
    slideInterval = null
  }
})
</script>

<template>
  <section
    id="home"
    class="relative isolate w-full overflow-x-clip bg-transparent text-slate-900 dark:text-white"
  >
    <div
      class="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <!-- Overall gradient overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-b from-white/80 via-white/60 to-white/60 dark:from-slate-950/80 dark:via-slate-950/15 dark:to-slate-950/50"
      />

      <!-- Top-left white / blue glow -->
      <div
        class="absolute -left-40 -top-10 h-[500px] w-[500px] rounded-full bg-white/70 blur-[130px] dark:bg-blue-500/15"
      />

      <!-- Top-right blue glow -->
      <div
        class="absolute -right-40 top-40 h-[550px] w-[550px] rounded-full bg-blue-100/50 blur-[140px] dark:bg-indigo-500/15"
      />

      <!-- Bottom violet glow -->
      <div
        class="absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-violet-100/45 blur-[130px] dark:bg-violet-500/10"
      />

      <!-- Center white highlight -->
      <div
        class="absolute left-1/2 top-0 h-[250px] w-[80%] -translate-x-1/2 rounded-full bg-white/40 blur-[120px] dark:bg-white/[0.025]"
      />
    </div>

    <!-- =====================================================
         MAIN CONTENT
    ====================================================== -->
    <div
      class="relative z-10 mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pb-28 lg:pt-40"
    >
      <!-- =================================================
           HERO INTRODUCTION
      ================================================== -->
      <div class="relative z-10 mx-auto max-w-5xl text-center">
        <!-- University identity -->
        <div
          class="mb-8 inline-flex max-w-full items-center gap-3 rounded-full border border-white/60 bg-white/40 px-5 py-2.5 shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.06]"
        >
          <span class="relative flex h-2.5 w-2.5 shrink-0">
            <span
              class="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-50"
            />
            <span
              class="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-600"
            />
          </span>

          <span
            class="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-slate-700 dark:text-slate-200 sm:text-xs"
          >
            {{ laboratory }}
          </span>

          <Sparkles class="h-3.5 w-3.5 shrink-0 text-blue-500" />
        </div>

        <!-- Main heading -->
        <h1
          class="mx-auto max-w-5xl break-words text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {{ title }}
        </h1>

        <!-- Main description -->
        <h1
          class="mx-auto max-w-5xl break-words text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mt-5 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent"
        >
          {{ subTitle }}
          <Sparkles
            class="w-8 h-8 md:w-10 md:h-10 inline-block ml-3 text-yellow-400"
          />
        </h1>
        <!-- Korean introduction -->
        <p
          v-if="showKoreanText"
          class="mx-auto mt-3 max-w-3xl text-sm leading-7 text-slate-500 dark:text-slate-100 sm:text-base"
        >
          {{ $t('ai_hero_text') }}
        </p>

        <!-- Research keywords -->
        <div class="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          <span
            v-for="keyword in [
              'Artificial Intelligence',
              '6G & Networks',
              'Cloud Computing',
              'IoT',
            ]"
            :key="keyword"
            class="rounded-full border border-white/60 bg-white/40 px-4 py-2 text-xs font-medium text-slate-600 shadow-sm backdrop-blur-lg dark:border-white/90 dark:bg-white/[0.05] dark:text-slate-300"
          >
            {{ keyword }}
          </span>
        </div>

        <!-- Call-to-action buttons -->
        <div
          class="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            type="button"
            @click="navigateTo('research')"
            class="group inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-bold text-white shadow-xl shadow-blue-600/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-600/30 sm:w-auto"
          >
            Explore Our Research
            <ArrowUpRight
              class="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            />
          </button>

          <button
            type="button"
            @click="navigateTo('contact')"
            class="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-white/60 bg-white/40 px-8 py-4 text-sm font-bold text-slate-700 shadow-lg shadow-slate-900/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/70 dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10 sm:w-auto"
          >
            Collaborate With Us
            <ArrowUpRight class="h-4 w-4" />
          </button>
        </div>
      </div>

      <!-- =================================================
           LIQUID GLASS RESEARCH SHOWCASE
      ================================================== -->

      <div class="relative z-10 mx-auto mt-20 w-full max-w-6xl sm:mt-24">
        <!-- Main glass container -->
        <div
          class="relative isolate overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl sm:p-8 lg:p-10 dark:border-slate-700/70 dark:bg-slate-950/90 dark:shadow-black/40"
        >
          <!-- Background reflections -->
          <div
            class="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-400/15 blur-3xl dark:bg-blue-500/15"
          />

          <div
            class="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl dark:bg-violet-500/15"
          />

          <!-- Subtle dark-mode surface gradient -->
          <div
            class="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-white/20 via-transparent to-blue-100/20 dark:from-slate-800/40 dark:via-slate-950/10 dark:to-blue-950/30"
          />

          <div
            class="relative z-10 grid min-w-0 gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"
          >
            <!-- Left showcase introduction -->
            <div class="min-w-0">
              <!-- Section label -->
              <div
                class="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200/80 bg-blue-50/90 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-700 backdrop-blur-md dark:border-blue-400/25 dark:bg-blue-950/80 dark:text-blue-300"
              >
                <Sparkles class="h-3.5 w-3.5" />
                Research Highlights
              </div>

              <!-- Heading -->
              <h2
                class="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl dark:text-slate-50"
              >
                Researching Today.

                <span
                  class="block bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-violet-400"
                >
                  Shaping Tomorrow.
                </span>
              </h2>

              <!-- Description -->
              <p
                class="mt-5 max-w-lg text-sm leading-7 text-slate-700 sm:text-base dark:text-slate-300"
              >
                We bring together emerging technologies and interdisciplinary
                expertise to explore new possibilities in intelligent systems,
                connected environments, and next-generation computing.
              </p>

              <!-- Research principles -->
              <div class="mt-8 space-y-5">
                <!-- Research & Innovation -->
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-200/70 bg-blue-50 text-blue-700 dark:border-blue-400/20 dark:bg-blue-950/80 dark:text-blue-300"
                  >
                    <Lightbulb class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h3
                      class="text-sm font-bold text-slate-900 dark:text-slate-100"
                    >
                      Research & Innovation
                    </h3>

                    <p
                      class="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-400"
                    >
                      Exploring new ideas and emerging technologies.
                    </p>
                  </div>
                </div>

                <!-- Global Collaboration -->
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-200/70 bg-violet-50 text-violet-700 dark:border-violet-400/20 dark:bg-violet-950/80 dark:text-violet-300"
                  >
                    <Globe2 class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h3
                      class="text-sm font-bold text-slate-900 dark:text-slate-100"
                    >
                      Global Collaboration
                    </h3>

                    <p
                      class="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-400"
                    >
                      Connecting researchers and interdisciplinary communities.
                    </p>
                  </div>
                </div>

                <!-- Practical Applications -->
                <div class="flex items-start gap-3">
                  <div
                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/70 bg-cyan-50 text-cyan-700 dark:border-cyan-400/20 dark:bg-cyan-950/80 dark:text-cyan-300"
                  >
                    <FlaskConical class="h-5 w-5" />
                  </div>

                  <div class="min-w-0">
                    <h3
                      class="text-sm font-bold text-slate-900 dark:text-slate-100"
                    >
                      Practical Applications
                    </h3>

                    <p
                      class="mt-1 text-xs leading-6 text-slate-600 dark:text-slate-400"
                    >
                      Translating research into meaningful solutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right rotating research card -->
            <div
              class="relative flex min-h-[390px] min-w-0 flex-col overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-slate-50/90 p-6 shadow-inner shadow-slate-900/5 backdrop-blur-xl sm:min-h-[410px] sm:p-8 dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-black/30"
            >
              <!-- Decorative rings -->
              <div
                class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-blue-400/20 dark:border-blue-400/15"
              />

              <div
                class="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full border border-blue-400/20 dark:border-blue-400/15"
              />

              <div
                class="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-400/10 blur-2xl dark:bg-violet-500/15"
              />

              <!-- Slide category -->
              <div class="relative flex items-center justify-between gap-3">
                <span
                  class="min-w-0 text-[10px] font-bold tracking-[0.16em] text-blue-700 dark:text-blue-300 sm:text-xs"
                >
                  {{ activeSlide.category }}
                </span>

                <span
                  class="shrink-0 font-mono text-sm font-bold text-slate-500 dark:text-slate-400"
                >
                  {{ activeSlide.number }} / 04
                </span>
              </div>

              <!-- Active slide content -->
              <div class="relative flex flex-1 flex-col justify-center py-8">
                <Transition name="slide-fade" mode="out-in">
                  <div :key="currentSlide" class="min-w-0">
                    <!-- Icon -->
                    <div
                      class="mb-7 flex h-20 w-20 items-center justify-center rounded-3xl border border-blue-200/80 bg-white/90 text-blue-600 shadow-xl shadow-blue-900/10 dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300 dark:shadow-black/30"
                    >
                      <component
                        :is="activeSlide.icon"
                        class="h-10 w-10"
                        :stroke-width="1.5"
                      />
                    </div>

                    <!-- Slide title -->
                    <h3
                      class="max-w-md break-words text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl dark:text-white"
                    >
                      {{ activeSlide.title }}
                    </h3>

                    <!-- Korean title -->
                    <p
                      v-if="showKoreanText"
                      class="mt-2 text-sm font-medium text-blue-700 dark:text-blue-300"
                    >
                      {{ activeSlide.koreanTitle }}
                    </p>

                    <!-- Description -->
                    <p
                      class="mt-4 max-w-md text-sm leading-7 text-slate-700 dark:text-slate-300"
                    >
                      {{ activeSlide.description }}
                    </p>
                  </div>
                </Transition>
              </div>

              <!-- Research tags -->
              <div class="relative flex flex-wrap gap-2">
                <span
                  v-for="tag in activeSlide.tags"
                  :key="tag"
                  class="max-w-full rounded-full border border-slate-200 bg-white/90 px-3 py-1.5 text-[10px] font-semibold text-slate-700 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- Carousel controls -->
              <div
                class="relative mt-7 flex items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-700"
              >
                <!-- Slide indicators -->
                <div class="flex items-center gap-2">
                  <button
                    v-for="(slide, index) in slides"
                    :key="slide.number"
                    type="button"
                    @click="goToSlide(index)"
                    :aria-label="`Go to research highlight ${index + 1}`"
                    :aria-current="currentSlide === index ? 'true' : undefined"
                    class="h-1.5 rounded-full transition-all duration-300"
                    :class="
                      currentSlide === index
                        ? 'w-9 bg-blue-600 dark:bg-blue-400'
                        : 'w-3 bg-slate-300 hover:bg-blue-400 dark:bg-slate-600 dark:hover:bg-blue-400'
                    "
                  />
                </div>

                <!-- Previous / Next -->
                <div class="flex shrink-0 gap-2">
                  <button
                    type="button"
                    @click="previousSlide"
                    aria-label="Previous slide"
                    class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500/50 dark:hover:bg-slate-700 dark:hover:text-blue-300"
                  >
                    <ChevronLeft class="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    @click="nextSlide"
                    aria-label="Next slide"
                    class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-blue-500/50 dark:hover:bg-slate-700 dark:hover:text-blue-300"
                  >
                    <ChevronRight class="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- =================================================
           INFORMATION STRIP
      ================================================== -->

      <div
        class="relative z-10 mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <!-- Research Excellence -->
        <div
          class="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-black/30 dark:hover:border-blue-500/40"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-blue-200/70 bg-blue-50 text-blue-700 transition-colors duration-300 group-hover:bg-blue-100 dark:border-blue-400/20 dark:bg-blue-950/80 dark:text-blue-300 dark:group-hover:bg-blue-900/80"
          >
            <Microscope class="h-5 w-5" />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">
              Research Excellence
            </p>

            <p
              class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400"
            >
              Advancing scientific knowledge
            </p>
          </div>
        </div>

        <!-- Global Collaboration -->
        <div
          class="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-black/30 dark:hover:border-violet-500/40"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-violet-200/70 bg-violet-50 text-violet-700 transition-colors duration-300 group-hover:bg-violet-100 dark:border-violet-400/20 dark:bg-violet-950/80 dark:text-violet-300 dark:group-hover:bg-violet-900/80"
          >
            <Globe2 class="h-5 w-5" />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">
              Global Collaboration
            </p>

            <p
              class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400"
            >
              Building research partnerships
            </p>
          </div>
        </div>

        <!-- Future Innovation -->
        <div
          class="group flex min-w-0 items-center gap-4 rounded-2xl border border-white/80 bg-white/85 p-5 shadow-lg shadow-slate-900/5 backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-black/30 dark:hover:border-cyan-500/40"
        >
          <div
            class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-200/70 bg-cyan-50 text-cyan-700 transition-colors duration-300 group-hover:bg-cyan-100 dark:border-cyan-400/20 dark:bg-cyan-950/80 dark:text-cyan-300 dark:group-hover:bg-cyan-900/80"
          >
            <Lightbulb class="h-5 w-5" />
          </div>

          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-900 dark:text-slate-100">
              Future Innovation
            </p>

            <p
              class="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-400"
            >
              Transforming ideas into impact
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (prefers-reduced-motion: reduce) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: none;
  }
}
</style>
