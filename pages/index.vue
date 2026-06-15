<script setup>
import { ref, onMounted } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useBackgroundAnimation } from '@/composables/useBackgroundAnimation';
import { ChevronUp } from 'lucide-vue-next'
import { useHomeStore } from '~/store/home.js'

// Data
import {
  researchAreas,
  achievements,
  currentProjects,
  facilities,
  newsUpdates,
  upcomingEvents,
  professorInfo
} from '@/composables/useData.js';

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

// Navigation State
const isMenuOpen = ref(false);
const currentLanguage = ref('EN');
const showKoreanText = ref(false);
const darkMode = ref(false);
const showScrollTop = ref(false);
const currentRoute = ref('home');

// State
const loading = ref(false)
const member = ref(null)
const publication = ref(null)

// Methods
const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
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

const fetchHome = async () => {
  loading.value = true

  try {
    data.value = await index()
    member.value = data.value || null
    member.value.professor = member.value.professor.map(professor => ({
      ...professor,
      ...professorInfo,
    }))
    publication.value = data.value?.publication || null
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;
};

onMounted(() => {
  setTimeout(() => {
    setSeason('summer') // Try 'spring', 'summer', 'fall', 'winter'
  }, 100)
  fetchHome();
  gsap.registerPlugin(ScrollTrigger);

  // Set light mode as default
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
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
  window.addEventListener('scroll', handleScroll);
});
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
      :current-route="currentRoute"
      @toggle-dark-mode="toggleDarkMode"
      @toggle-language="toggleLanguage"
      @scroll-to="scrollToSection"
      @toggle-menu="isMenuOpen = !isMenuOpen"
    />

    <!-- Hero Section -->
    <section id="home">
      <HomeSectionsHero @scroll-to="scrollToSection" />
    </section>

    <!-- About Section -->
    <section id="about">
      <HomeSectionsAbout />
    </section>

    <!-- Research Areas -->
    <section id="research">
      <HomeSectionsResearchAreas :research-areas="researchAreas" />
    </section>

<!--    &lt;!&ndash; Stats Section &ndash;&gt;-->
<!--    <section id="stats">-->
<!--      <HomeSectionsStats :achievements="achievements" />-->
<!--    </section>-->

    <!-- People Section -->
    <section id="people">
      <HomeSectionsPeople :lab-members="member" />
    </section>

    <!-- Publications -->
    <section id="publications">
      <HomeSectionsPublications :publications="publication" />
    </section>

    <!-- Projects -->
    <section id="projects">
      <HomeSectionsProjects :projects="currentProjects" />
    </section>

    <!-- Facilities -->
    <section id="facilities">
      <HomeSectionsFacilities :facilities="facilities" />
    </section>

    <!-- News & Events -->
    <section id="news">
      <HomeSectionsNewsEvents :news="newsUpdates" :events="upcomingEvents" />
    </section>

    <!-- Contact -->
    <section id="contact">
      <HomeSectionsContact />
    </section>

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
  pointer-events: none;
}

.tech-background canvas {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}
</style>
