<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBackgroundAnimation } from '@/composables/useBackgroundAnimation';

// Data
import {
  researchAreas,
  labMembers,
  recentPublications,
  achievements,
  currentProjects,
  facilities,
  newsUpdates,
  upcomingEvents
} from '@/composables/useData.js';
import { ChevronUp } from 'lucide-vue-next'
import { useHomeStore } from '~/store/home.js'

useSeoMeta({
  title: 'Home',
  description: 'Welcome to our Research Lab - Pioneering Innovations in Science and Technology',
})

definePageMeta({
  layout: 'default',
  middleware: ['maintenance'],
})

// Background Animation
const techCanvas = ref(null)
const { currentSeason, setSeason } = useBackgroundAnimation(techCanvas)
const store = useHomeStore()

const { index } = store
const data = ref(null)
// State
const isMenuOpen = ref(false);
const currentLanguage = ref('EN');
const showKoreanText = ref(false);
const darkMode = ref(false);
const showScrollTop = ref(false);
const activePub = ref(null);
const showBibtex = ref(false);
const loading = ref(false)
const member = ref(null)
// Methods
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    isMenuOpen.value = false;
  }
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const toggleLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'EN' ? 'KR' : 'EN';
  showKoreanText.value = !showKoreanText.value;
};

const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  if (darkMode.value) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('darkMode', darkMode.value);
};

const openBibtex = (pub) => {
  activePub.value = pub;
  showBibtex.value = true;
};

const fetchHome = async () => {
  loading.value = true

  try {
    data.value = await index()
    member.value = data.value?.member || null
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchHome();
  gsap.registerPlugin(ScrollTrigger);

  // Set light mode as default
  document.documentElement.classList.remove('dark');

  // Check saved preference
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  }

  // Animations
  gsap.from('.hero-title', {
    y: 20,
    opacity: 0,
    duration: 0.4,
    ease: 'power2.out'
  });

  gsap.from('.hero-subtitle', {
    y: 15,
    opacity: 0,
    duration: 0.5,
    delay: 0.1,
    ease: 'power2.out'
  });

  // Stagger animations
  gsap.utils.toArray('.stagger-item').forEach((el, i) => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      y: 20,
      opacity: 0,
      duration: 0.3,
      delay: i * 0.05,
      ease: 'power2.out'
    });
  });

  // Scroll to top button
  window.addEventListener('scroll', () => {
    showScrollTop.value = window.scrollY > 500;
  });
});

// For testing different seasons - you can uncomment and change the season
// onMounted(() => {
//   setTimeout(() => {
//     setSeason('winter') // Try 'spring', 'summer', 'fall', 'winter'
//   }, 100)
// })
</script>

<template>
  <div v-if="data" class="min-h-screen text-gray-900 overflow-x-hidden transition-colors duration-300 dark:text-white">
    <!-- Background Canvas -->
    <div class="tech-background">
      <canvas ref="techCanvas"></canvas>
    </div>

    <!-- Navigation -->
    <NavBar
      :dark-mode="darkMode"
      :current-language="currentLanguage"
      @toggle-dark-mode="toggleDarkMode"
      @toggle-language="toggleLanguage"
      @scroll-to="scrollToSection"
      @toggle-menu="isMenuOpen = !isMenuOpen"
    >
      <template #mobileMenu>
        <button @click="scrollToSection('about')" class="block w-full text-left py-2 dark:text-gray-300">About</button>
        <button @click="scrollToSection('research')" class="block w-full text-left py-2 dark:text-gray-300">Research</button>
        <button @click="scrollToSection('people')" class="block w-full text-left py-2 dark:text-gray-300">People</button>
        <button @click="scrollToSection('publications')" class="block w-full text-left py-2 dark:text-gray-300">Publications</button>
        <button @click="scrollToSection('projects')" class="block w-full text-left py-2 dark:text-gray-300">Projects</button>
        <button @click="scrollToSection('facilities')" class="block w-full text-left py-2 dark:text-gray-300">Facilities</button>
        <button @click="scrollToSection('contact')" class="block w-full text-left py-2 dark:text-gray-300">Contact</button>
      </template>
    </NavBar>

    <!-- Hero Section -->
    <HomeSectionsHero @scroll-to="scrollToSection" />

    <!-- About Section -->
    <HomeSectionsAbout />

    <!-- Research Areas -->
    <HomeSectionsResearchAreas :research-areas="researchAreas" />

    <!-- Stats Section -->
    <HomeSectionsStats :achievements="achievements" />

    <!-- People Section -->
    <HomeSectionsPeople :lab-members="member" />

    <!-- Publications -->
    <HomeSectionsPublications
      :publications="recentPublications"
      @open-bibtex="openBibtex"
    />

    <!-- Projects -->
    <HomeSectionsProjects :projects="currentProjects" />

    <!-- Facilities -->
    <HomeSectionsFacilities :facilities="facilities" />

    <!-- News & Events -->
    <HomeSectionsNewsEvents
      :news="newsUpdates"
      :events="upcomingEvents"
    />

    <!-- Contact -->
    <HomeSectionsContact />

    <!-- Footer -->
    <HomeLayoutFooter />

    <!-- Scroll to Top Button -->
    <button @click="scrollToTop"
            :class="[
              'fixed right-6 bottom-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center',
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            ]">
      <ChevronUp class="w-6 h-6" />
    </button>

    <!-- BibTeX Modal -->
    <div v-if="showBibtex" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">BibTeX Citation</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ activePub?.title }}</p>
          </div>
          <button @click="showBibtex = false" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center">
            ✕
          </button>
        </div>
        <div class="p-6 overflow-auto">
          <pre class="bg-gray-900 text-gray-100 p-6 rounded-lg text-sm overflow-x-auto">{{ activePub?.bibtex || '@article{sample,\n  title={Sample Paper},\n  author={Author},\n  year=2024\n}' }}</pre>
          <div class="mt-4 flex justify-end">
            <button @click="navigator.clipboard.writeText(activePub?.bibtex || '')"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
section {
  scroll-margin-top: 80px;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3F7BBD, #6B9BD2);
  border-radius: 5px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2C5A8A, #3F7BBD);
}

.dark ::-webkit-scrollbar-track {
  background: #2D3748;
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3F7BBD, #6B9BD2);
  border: 2px solid #2D3748;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2C5A8A, #3F7BBD);
}
.tech-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  overflow: hidden;
  pointer-events: none; /* Allows clicking through to content */
}

.tech-background canvas {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover; /* Ensures canvas covers entire area */
}
/* Remove the overlay that might be hiding the canvas */
.tech-background::after {
  display: none; /* Remove this overlay */
}
</style>
