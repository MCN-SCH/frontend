<script setup>
import { FileText, Calendar, MapPin, Users, ChevronRight, Award, Image, ExternalLink, X, ZoomIn, Trophy, ChevronLeft } from 'lucide-vue-next';
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';

const props = defineProps({
  news: Array,
  events: Array
});

// Gallery zoom state
const selectedPhoto = ref(null);
const isZoomOpen = ref(false);

// Carousel states
const awardIndex = ref(0);
const galleryIndex = ref(0);
const awardInterval = ref(null);
const galleryInterval = ref(null);
const isAwardPaused = ref(false);
const isGalleryPaused = ref(false);

const getBadgeType = (type) => {
  const types = {
    'Publication': 'info',
    'Funding': 'success',
    'Collaboration': 'default',
    'Award': 'warning',
    'Conference': 'info',
    'Seminar': 'default'
  };
  return types[type] || 'default';
};

// Sample awards data with images
const awards = [
  {
    title: 'Best Paper Award - IEEE ICC 2024',
    description: 'Awarded for outstanding research on "AI-Driven Network Slicing for 6G Communications"',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&h=800&fit=crop',
    orientation: 'vertical',
    type: 'Best Paper',
    icon: Trophy
  },
  {
    title: 'Outstanding Researcher Award 2023',
    description: 'Recognized for exceptional contributions to mobile computing and networking research',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800&h=600&fit=crop',
    orientation: 'horizontal',
    type: 'Research Excellence',
    icon: Award
  },
  {
    title: 'Best Student Paper Award - ACM MobiCom',
    description: 'Student research on "Edge Computing for Real-Time Medical IoT Systems"',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&h=800&fit=crop',
    orientation: 'vertical',
    type: 'Student Award',
    icon: Award
  },
  {
    title: 'Innovation Award - Samsung Research 2024',
    description: 'Recognized for breakthrough research in 5G/6G network optimization',
    date: '2024',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=600&fit=crop',
    orientation: 'horizontal',
    type: 'Innovation',
    icon: Award
  },
  {
    title: 'Best Paper Award - IEEE Globecom 2023',
    description: 'Outstanding research on "Edge AI for Next-Generation Networks"',
    date: '2023',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=600&h=800&fit=crop',
    orientation: 'vertical',
    type: 'Best Paper',
    icon: Trophy
  }
];

// Sample gallery photos with high-res versions
const galleryPhotos = [
  {
    url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=900&fit=crop',
    title: 'Lab Meeting',
    alt: 'MCN Lab team meeting'
  },
  {
    url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop',
    title: 'Research Collaboration',
    alt: 'Research collaboration session'
  },
  {
    url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=900&fit=crop',
    title: 'Conference Presentation',
    alt: 'Research presentation at conference'
  },
  {
    url: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=1200&h=900&fit=crop',
    title: 'Lab Workshop',
    alt: 'MCN Lab workshop'
  },
  {
    url: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1200&h=900&fit=crop',
    title: 'Team Building',
    alt: 'Lab team building activity'
  },
  {
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=1200&h=900&fit=crop',
    title: 'Research Showcase',
    alt: 'Research showcase event'
  },
  {
    url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=900&fit=crop',
    title: 'Student Presentation',
    alt: 'Student presenting research'
  },
  {
    url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=400&h=300&fit=crop',
    highRes: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1200&h=900&fit=crop',
    title: 'Lab Discussion',
    alt: 'Lab discussion session'
  }
];

// Computed visible items for carousel
const ITEMS_PER_SLIDE = 4;
const GALLERY_ITEMS_PER_SLIDE = 6;

const visibleAwards = computed(() => {
  const items = [];
  const total = awards.length;
  const start = awardIndex.value % total;
  for (let i = 0; i < Math.min(ITEMS_PER_SLIDE, total); i++) {
    const idx = (start + i) % total;
    items.push(awards[idx]);
  }
  return items;
});

const visibleGallery = computed(() => {
  const items = [];
  const total = galleryPhotos.length;
  const start = galleryIndex.value % total;
  for (let i = 0; i < Math.min(GALLERY_ITEMS_PER_SLIDE, total); i++) {
    const idx = (start + i) % total;
    items.push(galleryPhotos[idx]);
  }
  return items;
});

// Carousel navigation
const nextAward = () => {
  awardIndex.value = (awardIndex.value + 1) % awards.length;
};

const prevAward = () => {
  awardIndex.value = (awardIndex.value - 1 + awards.length) % awards.length;
};

const nextGallery = () => {
  galleryIndex.value = (galleryIndex.value + 1) % galleryPhotos.length;
};

const prevGallery = () => {
  galleryIndex.value = (galleryIndex.value - 1 + galleryPhotos.length) % galleryPhotos.length;
};

// Auto-slide functions
const startAwardAutoSlide = () => {
  if (awardInterval.value) clearInterval(awardInterval.value);
  awardInterval.value = setInterval(() => {
    if (!isAwardPaused.value) {
      nextAward();
    }
  }, 4000);
};

const startGalleryAutoSlide = () => {
  if (galleryInterval.value) clearInterval(galleryInterval.value);
  galleryInterval.value = setInterval(() => {
    if (!isGalleryPaused.value) {
      nextGallery();
    }
  }, 5000);
};

// Pause on hover
const pauseAward = () => { isAwardPaused.value = true; };
const resumeAward = () => { isAwardPaused.value = false; };
const pauseGallery = () => { isGalleryPaused.value = true; };
const resumeGallery = () => { isGalleryPaused.value = false; };

// Open zoom dialog
const openZoom = (photo) => {
  selectedPhoto.value = photo;
  isZoomOpen.value = true;
  document.body.style.overflow = 'hidden';
  isGalleryPaused.value = true;
};

// Close zoom dialog
const closeZoom = () => {
  isZoomOpen.value = false;
  document.body.style.overflow = '';
  setTimeout(() => {
    selectedPhoto.value = null;
  }, 300);
  isGalleryPaused.value = false;
};

// Handle escape key
const handleEscape = (e) => {
  if (e.key === 'Escape' && isZoomOpen.value) {
    closeZoom();
  }
};

// Mount event listener
onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  startAwardAutoSlide();
  startGalleryAutoSlide();
});

// Cleanup
onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  if (awardInterval.value) clearInterval(awardInterval.value);
  if (galleryInterval.value) clearInterval(galleryInterval.value);
});

// Watch for index changes to reset animations
watch([awardIndex, galleryIndex], () => {
  // Force re-render for animation
});
</script>

<template>
  <section class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-6">
      <div class="max-w-7xl mx-auto">
        <!-- Awards Carousel Section -->
        <div class="mb-20">
          <div class="flex items-center justify-between mb-8">
            <div>
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 text-amber-700 dark:text-amber-300 text-sm font-medium mb-2 border border-amber-200 dark:border-amber-800">
                <Trophy class="w-4 h-4 mr-2" />
                Awards & Recognition
              </div>
              <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Lab Awards</h2>
              <p class="text-gray-600 dark:text-gray-300 mt-1 text-sm">Celebrating excellence in research and innovation</p>
            </div>
          </div>

          <!-- Awards Carousel -->
          <div class="relative">
            <button
              v-if="awards.length > ITEMS_PER_SLIDE"
              @click="prevAward"
              class="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
              @mouseenter="pauseAward"
              @mouseleave="resumeAward"
            >
              <ChevronLeft class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              v-if="awards.length > ITEMS_PER_SLIDE"
              @click="nextAward"
              class="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
              @mouseenter="pauseAward"
              @mouseleave="resumeAward"
            >
              <ChevronRight class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div
              class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
              @mouseenter="pauseAward"
              @mouseleave="resumeAward"
            >
              <div
                v-for="award in visibleAwards"
                :key="award.title + awardIndex"
                class="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-500 hover:-translate-y-1 flex flex-col"
              >
                <div class="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0">
                  <img
                    :src="award.image"
                    :alt="award.title"
                    class="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div class="absolute top-3 right-3">
                    <span class="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs font-semibold shadow-lg flex items-center gap-1.5">
                      <component :is="award.icon || Award" class="w-3 h-3" />
                      {{ award.type }}
                    </span>
                  </div>
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p class="text-white text-xs font-medium line-clamp-2">{{ award.description }}</p>
                  </div>
                </div>
                <div class="p-4 flex flex-col flex-1">
                  <h4 class="font-bold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2 min-h-[40px]">{{ award.title }}</h4>
                  <div class="flex items-center justify-between mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
                    <span class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Calendar class="w-3 h-3" />
                      {{ award.date }}
                    </span>
                    <button class="text-xs text-amber-600 dark:text-amber-400 font-semibold hover:text-amber-700 dark:hover:text-amber-300 transition-colors flex items-center gap-1 group/btn">
                      Details
                      <ChevronRight class="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="awards.length > ITEMS_PER_SLIDE" class="flex justify-center gap-2 mt-6">
              <button
                v-for="(_, idx) in awards"
                :key="idx"
                @click="awardIndex = idx"
                @mouseenter="pauseAward"
                @mouseleave="resumeAward"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="[
                  idx === awardIndex ? 'bg-amber-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
                ]"
              ></button>
            </div>
          </div>
        </div>

        <!-- News & Events Grid -->
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- News -->
          <div>
            <div class="flex items-center justify-between mb-8">
              <div>
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2 border border-blue-200 dark:border-blue-800">
                  <FileText class="w-4 h-4 mr-2" />
                  Latest News
                </div>
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Lab News</h2>
              </div>
            </div>

            <div class="space-y-5">
              <div
                v-for="item in news"
                :key="item.title"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="px-3 py-1 rounded-full text-xs font-semibold" :class="{
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300': getBadgeType(item.type) === 'info',
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300': getBadgeType(item.type) === 'success',
                    'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300': getBadgeType(item.type) === 'warning',
                    'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300': getBadgeType(item.type) === 'default'
                  }">
                    {{ item.type }}
                  </span>
                  <span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <Calendar class="w-3 h-3" />
                    {{ item.date }}
                  </span>
                </div>
                <h4 class="text-lg font-bold text-gray-800 dark:text-white mb-2">{{ item.title }}</h4>
                <p class="text-gray-600 dark:text-gray-300 text-sm mb-4">{{ item.description }}</p>
                <button class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group">
                  Read More
                  <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>
          </div>

          <!-- Events -->
          <div>
            <div class="flex items-center justify-between mb-8">
              <div>
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2 border border-blue-200 dark:border-blue-800">
                  <Calendar class="w-4 h-4 mr-2" />
                  Upcoming Events
                </div>
                <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Events & Seminars</h2>
              </div>
            </div>

            <div class="space-y-5">
              <div
                v-for="event in events"
                :key="event.title"
                class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                <div class="flex items-start gap-4 mb-3">
                  <div class="text-center min-w-16 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2">
                    <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {{ event.date.split('.')[2] }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ event.date.slice(0,7) }}
                    </div>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-800 dark:text-white">{{ event.title }}</h4>
                  </div>
                </div>

                <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {{ event.description }}
                </p>

                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <MapPin class="w-4 h-4 mr-2" />
                  {{ event.location }}
                </div>

                <button class="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-700 dark:hover:text-blue-300 transition-colors flex items-center gap-1 group">
                  Event Details
                  <ChevronRight class="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </div>

            <div class="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-blue-200 dark:border-gray-700 shadow-lg">
              <div class="flex items-start gap-4">
                <div class="p-3 rounded-xl bg-blue-500 text-white">
                  <Calendar class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="font-bold text-lg text-gray-800 dark:text-white mb-1">Weekly Seminars</h4>
                  <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                    Join our weekly research seminars every Wednesday at 2 PM in the lab meeting room.
                    Open to all students and researchers.
                  </p>
                  <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar class="w-4 h-4 mr-2" />
                    Every Wednesday, 2:00 PM - 3:30 PM
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Gallery Carousel -->
        <div class="mt-20">
          <div class="flex items-center justify-between mb-8">
            <div>
              <div class="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-2 border border-purple-200 dark:border-purple-800">
                <Image class="w-4 h-4 mr-2" />
                Gallery
              </div>
              <h2 class="text-3xl font-bold text-gray-800 dark:text-white">Lab Photos</h2>
              <p class="text-gray-600 dark:text-gray-300 mt-1 text-sm">Moments from our research journey</p>
            </div>
            <button class="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-2">
              <ExternalLink class="w-4 h-4" />
              View All
            </button>
          </div>

          <!-- Gallery Carousel -->
          <div class="relative">
            <button
              v-if="galleryPhotos.length > GALLERY_ITEMS_PER_SLIDE"
              @click="prevGallery"
              class="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
              @mouseenter="pauseGallery"
              @mouseleave="resumeGallery"
            >
              <ChevronLeft class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <button
              v-if="galleryPhotos.length > GALLERY_ITEMS_PER_SLIDE"
              @click="nextGallery"
              class="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110"
              @mouseenter="pauseGallery"
              @mouseleave="resumeGallery"
            >
              <ChevronRight class="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>

            <div
              class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
              @mouseenter="pauseGallery"
              @mouseleave="resumeGallery"
            >
              <div
                v-for="photo in visibleGallery"
                :key="photo.url + galleryIndex"
                @click="openZoom(photo)"
                class="group relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-500 cursor-pointer"
              >
                <img
                  :src="photo.url"
                  :alt="photo.alt"
                  class="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span class="text-white text-xs font-medium">{{ photo.title }}</span>
                </div>
                <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ZoomIn class="w-8 h-8 text-white opacity-80" />
                </div>
              </div>
            </div>

            <div v-if="galleryPhotos.length > GALLERY_ITEMS_PER_SLIDE" class="flex justify-center gap-2 mt-6">
              <button
                v-for="(_, idx) in galleryPhotos"
                :key="idx"
                @click="galleryIndex = idx"
                @mouseenter="pauseGallery"
                @mouseleave="resumeGallery"
                class="w-2 h-2 rounded-full transition-all duration-300"
                :class="[
                  idx === galleryIndex ? 'bg-purple-500 w-6' : 'bg-gray-300 dark:bg-gray-600'
                ]"
              ></button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Zoom Dialog -->
    <Teleport to="body">
      <div
        v-if="isZoomOpen"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        @click="closeZoom"
      >
        <div class="relative max-w-5xl w-full mx-4" @click.stop>
          <button
            @click="closeZoom"
            class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            aria-label="Close zoom"
          >
            <X class="w-8 h-8" />
          </button>

          <div class="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <img
              v-if="selectedPhoto"
              :src="selectedPhoto.highRes || selectedPhoto.url"
              :alt="selectedPhoto.alt"
              class="w-full h-auto max-h-[80vh] object-contain"
              loading="lazy"
            />
          </div>

          <div v-if="selectedPhoto" class="mt-4 text-center text-white">
            <h4 class="text-lg font-semibold">{{ selectedPhoto.title }}</h4>
            <p class="text-sm text-gray-300">{{ selectedPhoto.alt }}</p>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Smooth transitions for carousel */
.carousel-slide {
  transition: all 0.5s ease-in-out;
}
</style>
