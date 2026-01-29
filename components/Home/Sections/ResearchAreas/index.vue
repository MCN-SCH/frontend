<script setup>
import { ref, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Sparkles, TrendingUp, Users, ChevronRight, Zap, Brain, Shield, Database, Cpu, Users as UsersIcon } from 'lucide-vue-next';

const props = defineProps({
  researchAreas: Array
});

const emit = defineEmits(['viewDetails']);

const swiperModules = [Navigation, Pagination, Autoplay];
const swiperRef = ref(null);

const handleSwiper = (swiper) => {
  swiperRef.value = swiper;
};

const nextSlide = () => {
  if (swiperRef.value) swiperRef.value.slideNext();
};

const prevSlide = () => {
  if (swiperRef.value) swiperRef.value.slidePrev();
};
</script>

<template>
  <section id="research" class="py-16 bg-white dark:bg-gray-900 relative transition-colors duration-300">
    <div class="container mx-auto px-4 md:px-6">
      <!-- Compact Header -->
      <div class="max-w-7xl mx-auto mb-12">
        <div class="flex items-center justify-between mb-8">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#CD5C5C]/10 to-[#CD5C5C]/5 dark:from-[#CD5C5C]/20 dark:to-[#CD5C5C]/10 border border-[#CD5C5C]/20 dark:border-[#CD5C5C]/30 mb-4">
              <Sparkles class="w-3 h-3 text-[#CD5C5C] dark:text-[#FF6B6B]" />
              <span class="text-xs font-semibold text-[#CD5C5C] dark:text-[#FF6B6B] tracking-wide">RESEARCH FOCUS</span>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
              Research Areas
              <span class="text-[#CD5C5C] dark:text-[#FF6B6B]">•</span>
              <span class="text-gray-500 dark:text-gray-400 text-xl ml-2">연구 분야</span>
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2 max-w-xl">
              Cutting-edge computing research blending Korean innovation with global impact
            </p>
          </div>

          <!-- Navigation Controls - Compact -->
          <div class="flex items-center gap-2">
            <button @click="prevSlide" class="w-10 h-10 rounded-full border border-gray-300 dark:border-gray-700 hover:border-[#CD5C5C] dark:hover:border-[#FF6B6B] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
              <ChevronRight class="w-4 h-4 transform rotate-180 text-gray-600 dark:text-gray-400" />
            </button>
            <button @click="nextSlide" class="w-10 h-10 rounded-full bg-gradient-to-r from-[#CD5C5C] to-[#FF6B6B] dark:from-[#FF6B6B] dark:to-[#CD5C5C] text-white hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-[#FF6B6B]/20 transition-shadow flex items-center justify-center">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="flex items-center gap-6 text-sm">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <TrendingUp class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">50+</div>
              <div class="text-gray-500 dark:text-gray-400">Projects</div>
            </div>
          </div>
          <div class="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
              <Users class="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">100+</div>
              <div class="text-gray-500 dark:text-gray-400">Researchers</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Swiper Container with proper spacing for pagination -->
      <div class="max-w-7xl mx-auto">
        <div class="relative">
          <!-- Swiper with extra bottom padding -->
          <Swiper
            :modules="swiperModules"
            :slidesPerView="1"
            :spaceBetween="20"
            :pagination="{
              clickable: true,
              el: '.custom-pagination'
            }"
            :navigation="false"
            :autoplay="{ delay: 4000, disableOnInteraction: false }"
            :breakpoints="{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 }
            }"
            @swiper="handleSwiper"
            class="!pb-16">
            <SwiperSlide v-for="area in (researchAreas)" :key="area.title">
              <div
                class="bg-white dark:bg-gray-800 rounded-2xl p-6 h-[380px] flex flex-col border border-gray-200 dark:border-gray-700 hover:border-[#CD5C5C]/30 dark:hover:border-[#FF6B6B]/30 hover:shadow-lg dark:hover:shadow-xl dark:hover:shadow-gray-900/50 transition-all duration-300 group cursor-pointer"
                @click="emit('viewDetails', area)"
              >
                <!-- Icon & Korean Title -->
                <div class="mb-4">
                  <div class="flex items-center gap-3 mb-3">
                    <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm dark:shadow-gray-900/50" :class="`bg-gradient-to-br ${area.color}`">
                      <component :is="area.icon" class="w-6 h-6 text-white" />
                    </div>
                    <span class="text-sm font-medium text-gray-500 dark:text-gray-400">{{ area.korean }}</span>
                  </div>
                </div>

                <!-- Content -->
                <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-[#CD5C5C] dark:group-hover:text-[#FF6B6B] transition-colors">
                  {{ area.title }}
                </h3>

                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                  {{ area.desc }}
                </p>

                <!-- Stats -->
                <div class="mb-4">
                  <div class="inline-flex items-center px-2.5 py-1 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{{ area.stats }}</span>
                  </div>
                </div>

                <!-- Features -->
                <div class="flex flex-wrap gap-1.5 mb-6">
                  <span v-for="feature in area.features.slice(0, 3)" :key="feature"
                        class="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md">
                    {{ feature }}
                  </span>
                </div>

                <!-- CTA Button -->
                <button class="mt-auto w-full py-2.5 px-4 rounded-lg border border-gray-300 dark:border-gray-600 hover:border-[#CD5C5C] dark:hover:border-[#FF6B6B] hover:bg-[#CD5C5C]/5 dark:hover:bg-[#FF6B6B]/10 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#CD5C5C] dark:hover:text-[#FF6B6B] flex items-center justify-center group-hover:shadow-sm dark:group-hover:shadow-gray-900/30 transition-all">
                  View Details
                  <ChevronRight class="w-3 h-3 ml-1.5 group-hover:translate-x-1 text-gray-500 dark:text-gray-400 group-hover:text-[#CD5C5C] dark:group-hover:text-[#FF6B6B]" />
                </button>
              </div>
            </SwiperSlide>
          </Swiper>

          <!-- Custom Pagination Container - Positioned below slides -->
          <div class="custom-pagination flex items-center justify-center w-full h-8 pt-5"></div>
        </div>
      </div>

    </div>
  </section>
</template>

<style scoped>
/* Fix pagination positioning */
:deep(.swiper) {
  padding-bottom: 20px !important; /* Extra space for pagination */
}

/* Custom pagination styling */
.custom-pagination {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

:deep(.custom-pagination .swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background-color: #d1d5db;
  opacity: 1;
  margin: 0 4px;
  transition: all 0.3s ease;
}

:deep(.custom-pagination .swiper-pagination-bullet-active) {
  width: 24px;
  height: 8px;
  background: linear-gradient(to right, #CD5C5C, #FF6B6B);
  border-radius: 4px;
}

/* Dark mode pagination */
@media (prefers-color-scheme: dark) {
  :deep(.custom-pagination .swiper-pagination-bullet) {
    background-color: #4b5563;
  }

  :deep(.custom-pagination .swiper-pagination-bullet-active) {
    background: linear-gradient(to right, #FF6B6B, #CD5C5C);
  }
}

.dark :deep(.custom-pagination .swiper-pagination-bullet) {
  background-color: #4b5563;
}

.dark :deep(.custom-pagination .swiper-pagination-bullet-active) {
  background: linear-gradient(to right, #FF6B6B, #CD5C5C);
}

/* Card hover effects */
.group:hover {
  transform: translateY(-4px);
}

/* Ensure proper spacing between elements */
.swiper-slide {
  height: auto;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  :deep(.custom-pagination .swiper-pagination-bullet) {
    width: 6px;
    height: 6px;
  }

  :deep(.custom-pagination .swiper-pagination-bullet-active) {
    width: 20px;
    height: 6px;
  }
}
</style>
