<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {
  FileText,
  ExternalLink,
  Code,
  Download,
  Eye,
  X,
  Search,
  Users,
  ChevronDown,
  Grid3x3,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronUp
} from 'lucide-vue-next';
import { useHomeStore } from '~/store/home.js'

useSeoMeta({
  title: 'Publications | Research Lab',
  description: 'Explore our research publications including journal articles, conference papers, book chapters, and patents from our research lab.',
})

definePageMeta({
  layout: 'default',
  middleware: ['maintenance'],
})

// Navigation State
const isMenuOpen = ref(false);
const currentLanguage = ref('EN');
const showKoreanText = ref(false);
const darkMode = ref(false);
const showScrollTop = ref(false);
const currentRoute = ref('publications');

// State
const publications = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const selectedType = ref('all');
const selectedYear = ref('all');
const sortBy = ref('date_desc');
const viewMode = ref('grid');
const selectedPublication = ref(null);
const showDialog = ref(false);

// Pagination state
const currentPage = ref(1);
const perPage = ref(12);
const totalPages = ref(0);
const totalPublications = ref(0);
const paginationLinks = ref([]);

// Available filters
const availableYears = ref([]);

// Publication types
const publicationTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'International Journal', label: 'International Journals' },
  { value: 'International Conference', label: 'Conference Papers' },
  { value: 'Domestic Journal', label: 'Domestic Journals' },
  { value: 'Book Chapter', label: 'Book Chapters' },
  { value: 'Patent', label: 'Patents' }
];

// Helper functions
const getBadgeColor = (badge) => {
  const colors = {
    'International Journal': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    'International Conference': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    'Domestic Journal': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    'Book Chapter': { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300' },
    'Patent': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' }
  };
  return colors[badge] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
};

const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

const getFullDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const getAuthors = (pub) => {
  if (!pub.authors || pub.authors.length === 0) {
    return 'Authors information coming soon';
  }
  const sortedAuthors = [...pub.authors].sort((a, b) => a.author_order - b.author_order);
  return sortedAuthors.map(author => author.author_name).join(', ');
};

const getAuthorCount = (pub) => {
  return pub.authors ? pub.authors.length : 0;
};

const getAbstract = (pub) => {
  return pub.abstract || 'Abstract not available for this publication.';
};

const getKeywords = (pub) => {
  if (!pub.keywords) return [];
  return pub.keywords.split(',').map(k => k.trim());
};

// Navigation methods
const scrollToSection = (sectionId) => {
  if (sectionId === 'publications') {
    // Already on publications page, just scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Navigate to home page with section hash
    window.location.href = `/#${sectionId}`;
  }
  isMenuOpen.value = false;
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

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

const openDetails = (pub) => {
  selectedPublication.value = pub;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  selectedPublication.value = null;
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedType.value = 'all';
  selectedYear.value = 'all';
  sortBy.value = 'date_desc';
  currentPage.value = 1;
  fetchPublications();
};

// Pagination methods
const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchPublications();
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    fetchPublications();
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    fetchPublications();
  }
};

// Generate pagination range for display
const paginationRange = computed(() => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages.value; i++) {
    if (i === 1 || i === totalPages.value || (i >= currentPage.value - delta && i <= currentPage.value + delta)) {
      range.push(i);
    }
  }

  range.forEach((i) => {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push('...');
      }
    }
    rangeWithDots.push(i);
    l = i;
  });

  return rangeWithDots;
});

// Stats
const stats = computed(() => ({
  total: totalPublications.value,
  journals: publications.value.filter(p => p.badge === 'International Journal').length,
  conferences: publications.value.filter(p => p.badge === 'International Conference').length,
  citations: publications.value.reduce((sum, pub) => sum + (pub.citations || 0), 0)
}));

const store = useHomeStore()
const { publication } = store

// Fetch publications with pagination and filters
const fetchPublications = async () => {
  loading.value = true;
  try {
    // Build query params as an object
    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      sort: sortBy.value
    };

    if (searchQuery.value) {
      params.search = searchQuery.value;
    }
    if (selectedType.value !== 'all') {
      params.type = selectedType.value;
    }
    if (selectedYear.value !== 'all') {
      params.year = selectedYear.value;
    }

    // Pass the params object to the publication method
    const response = await publication(params);

    if (response) {
      const responseData = response;
      publications.value = responseData.data || [];
      totalPages.value = responseData.last_page || 1;
      totalPublications.value = responseData.total || publications.value.length;
      currentPage.value = responseData.current_page || 1;
      paginationLinks.value = responseData.links || [];

      if (publications.value.length > 0 && availableYears.value.length === 0) {
        const years = new Set();
        publications.value.forEach(pub => {
          if (pub.date) {
            years.add(new Date(pub.date).getFullYear());
          }
        });
        availableYears.value = Array.from(years).sort((a, b) => b - a);
      }
    } else {
      publications.value = [];
      totalPublications.value = 0;
      totalPages.value = 0;
    }
  } catch (error) {
    console.error('Error fetching publications:', error);
    publications.value = [];
    totalPublications.value = 0;
    totalPages.value = 0;
  } finally {
    loading.value = false;
  }
};

const fetchAvailableYears = async () => {
  try {
    const response = await publication({ per_page: 100 });

    if (response && response.data && response.data.data) {
      const years = new Set();
      response.data.data.forEach(pub => {
        if (pub.date) {
          years.add(new Date(pub.date).getFullYear());
        }
      });
      availableYears.value = Array.from(years).sort((a, b) => b - a);
    }
  } catch (error) {
    console.error('Error fetching available years:', error);
  }
};

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 500;
};

// Add this at the top with other refs
let debounceTimer = null;

// Replace the watch with this:
watch([searchQuery, selectedType, selectedYear, sortBy], () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchPublications();
  }, 300);
});

onMounted(() => {
  const savedDarkMode = localStorage.getItem('darkMode');
  if (savedDarkMode === 'true') {
    darkMode.value = true;
    document.documentElement.classList.add('dark');
  }

  fetchPublications();
  fetchAvailableYears();
  window.addEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
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

    <!-- Publications Section with id -->
    <section id="publications"
             class="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-800 dark:to-purple-800 pt-32 pb-16 sm:pt-36 sm:pb-20">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <h1 class="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
            Research Publications
          </h1>
          <p class="text-base sm:text-lg text-white/90 mb-6">
            Explore our collection of peer-reviewed publications, conference papers, and patents
          </p>

          <!-- Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl sm:text-3xl font-bold text-white">{{ stats.total }}</div>
              <div class="text-xs sm:text-sm text-white/80">Total Publications</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl sm:text-3xl font-bold text-white">{{ stats.journals }}</div>
              <div class="text-xs sm:text-sm text-white/80">Journal Articles</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl sm:text-3xl font-bold text-white">{{ stats.conferences }}</div>
              <div class="text-xs sm:text-sm text-white/80">Conference Papers</div>
            </div>
            <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div class="text-2xl sm:text-3xl font-bold text-white">{{ stats.citations }}</div>
              <div class="text-xs sm:text-sm text-white/80">Total Citations</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Filters Section -->
    <section class="sticky top-0 z-40 bg-white dark:bg-gray-800 shadow-md py-4">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col lg:flex-row gap-4">
          <!-- Search Bar -->
          <div class="flex-1">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search by title, author, journal, or abstract..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <!-- Type Filter -->
          <div class="relative">
            <select
              v-model="selectedType"
              class="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option v-for="type in publicationTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
            <ChevronDown
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <!-- Year Filter -->
          <div class="relative">
            <select
              v-model="selectedYear"
              class="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option value="all">All Years</option>
              <option v-for="year in availableYears" :key="year" :value="year">
                {{ year }}
              </option>
            </select>
            <ChevronDown
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <!-- Sort By -->
          <div class="relative">
            <select
              v-model="sortBy"
              class="appearance-none pl-4 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white cursor-pointer"
            >
              <option value="date_desc">Latest First</option>
              <option value="date_asc">Oldest First</option>
              <option value="title_asc">Title A-Z</option>
              <option value="title_desc">Title Z-A</option>
              <option value="citations_desc">Most Cited</option>
            </select>
            <ChevronDown
              class="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <!-- View Mode Toggle -->
          <div class="flex gap-1 border border-gray-300 dark:border-gray-600 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'p-2 rounded-md transition-colors',
                viewMode === 'grid'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <Grid3x3 class="w-5 h-5" />
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'p-2 rounded-md transition-colors',
                viewMode === 'list'
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              ]"
            >
              <List class="w-5 h-5" />
            </button>
          </div>

          <!-- Clear Filters -->
          <button
            v-if="searchQuery || selectedType !== 'all' || selectedYear !== 'all'"
            @click="clearFilters"
            class="px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>

    <!-- Publications Grid/List -->
    <section class="py-12">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-6 text-gray-600 dark:text-gray-400">
          Showing {{ publications.length }} of {{ totalPublications }} publication{{ totalPublications !== 1 ? 's' : ''
          }}
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-600 dark:text-gray-400">Loading publications...</p>
        </div>

        <!-- Grid View -->
        <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="pub in publications"
            :key="pub.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-100 dark:border-gray-700"
          >
            <div class="p-6 h-full flex flex-col">
              <div class="flex flex-wrap items-center gap-2 mb-3">
                <div class="px-3 py-1 rounded-full text-xs font-medium"
                     :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                  {{ pub.badge || 'Publication' }}
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ pub.journal || 'Journal' }}</div>
              </div>

              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2 leading-tight line-clamp-2">
                {{ pub.title }}
              </h3>

              <p class="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {{ getAuthors(pub) }}
              </p>

              <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {{ getYear(pub.date) }}
              </p>

              <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-1">
                {{ getAbstract(pub) }}
              </p>

              <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                <div class="flex items-center gap-2">
                  <FileText class="w-3 h-3" />
                  <span>{{ pub.citations || 0 }} citations</span>
                </div>
                <div class="flex items-center gap-2">
                  <Users class="w-3 h-3" />
                  <span>{{ getAuthorCount(pub) }} authors</span>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100 dark:border-gray-700">
                <div class="grid grid-cols-2 gap-2">
                  <button
                    @click="openUrl(pub.url)"
                    :disabled="!pub.url"
                    class="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ExternalLink class="w-3 h-3 mr-1" />
                    Paper
                  </button>
                  <button
                    @click="openDetails(pub)"
                    class="px-3 py-2 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <Eye class="w-3 h-3 mr-1" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- List View -->
        <div v-else class="space-y-4">
          <div
            v-for="pub in publications"
            :key="pub.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div class="p-6">
              <div class="flex flex-col lg:flex-row lg:items-start gap-4">
                <div class="flex-1">
                  <div class="flex flex-wrap items-center gap-2 mb-3">
                    <div class="px-3 py-1 rounded-full text-xs font-medium"
                         :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                      {{ pub.badge || 'Publication' }}
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ pub.journal || 'Journal' }}</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">•</div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ getYear(pub.date) }}</div>
                  </div>

                  <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {{ pub.title }}
                  </h3>

                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {{ getAuthors(pub) }}
                  </p>

                  <p class="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {{ getAbstract(pub) }}
                  </p>

                  <div class="flex flex-wrap items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <div class="flex items-center gap-1">
                      <FileText class="w-3 h-3" />
                      <span>{{ pub.citations || 0 }} citations</span>
                    </div>
                    <div class="flex items-center gap-1">
                      <Users class="w-3 h-3" />
                      <span>{{ getAuthorCount(pub) }} authors</span>
                    </div>
                    <div v-if="pub.doi" class="flex items-center gap-1">
                      <Code class="w-3 h-3" />
                      <span class="truncate">DOI: {{ pub.doi }}</span>
                    </div>
                  </div>
                </div>

                <div class="flex flex-row lg:flex-col gap-2">
                  <button
                    @click="openUrl(pub.url)"
                    :disabled="!pub.url"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    <ExternalLink class="w-4 h-4 mr-2" />
                    Paper
                  </button>
                  <button
                    @click="openDetails(pub)"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <Eye class="w-4 h-4 mr-2" />
                    Details
                  </button>
                  <button
                    v-if="pub.doi"
                    @click="openUrl(`https://doi.org/${pub.doi}`)"
                    class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-center"
                  >
                    <ExternalLink class="w-4 h-4 mr-2" />
                    DOI
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-8 flex justify-center items-center gap-2">
          <button
            @click="prevPage"
            :disabled="currentPage === 1"
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft class="w-5 h-5" />
          </button>

          <div class="flex gap-2">
            <template v-for="page in paginationRange" :key="page">
              <button
                v-if="page !== '...'"
                @click="goToPage(page)"
                :class="[
                  'px-4 py-2 rounded-lg transition-colors font-medium min-w-[40px]',
                  currentPage === page
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                ]"
              >
                {{ page }}
              </button>
              <span
                v-else
                class="px-2 py-2 text-gray-500 dark:text-gray-400"
              >...</span>
            </template>
          </div>

          <button
            @click="nextPage"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight class="w-5 h-5" />
          </button>
        </div>

        <div v-if="totalPages > 1" class="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
          Page {{ currentPage }} of {{ totalPages }}
        </div>

        <!-- Empty State -->
        <div v-if="!loading && publications.length === 0" class="text-center py-12">
          <FileText class="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">No publications found</h3>
          <p class="text-gray-600 dark:text-gray-400">Try adjusting your search or filter criteria</p>
          <button @click="clearFilters"
                  class="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Clear Filters
          </button>
        </div>
      </div>
    </section>

    <!-- Details Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
         aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-90 transition-opacity"
             @click="closeDialog"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div
            class="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-4 sm:px-8 sm:py-6">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex flex-wrap items-center gap-2 mb-3">
                  <div class="px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur-sm">
                    {{ selectedPublication?.badge || 'Publication' }}
                  </div>
                  <div class="text-sm text-white/80">{{ selectedPublication?.journal || 'Journal' }}</div>
                </div>
                <h3 class="text-xl sm:text-2xl font-bold text-white pr-8" id="modal-title">
                  {{ selectedPublication?.title }}
                </h3>
              </div>
              <button @click="closeDialog" class="text-white/80 hover:text-white transition-colors">
                <X class="w-6 h-6" />
              </button>
            </div>
          </div>

          <div class="px-6 py-6 sm:px-8 sm:py-8">
            <div class="space-y-6">
              <div>
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Authors</h4>
                <p class="text-gray-800 dark:text-gray-200 leading-relaxed">{{ getAuthors(selectedPublication) }}</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Journal / Venue</h4>
                  <p class="text-gray-800 dark:text-gray-200">
                    {{ selectedPublication?.journal || selectedPublication?.venue || 'N/A' }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Publication Date</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ getFullDate(selectedPublication?.date) }}</p>
                </div>
                <div v-if="selectedPublication?.doi">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    DOI</h4>
                  <a :href="`https://doi.org/${selectedPublication.doi}`" target="_blank"
                     class="text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {{ selectedPublication.doi }}
                  </a>
                </div>
                <div v-if="selectedPublication?.citations !== undefined">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    Citations</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ selectedPublication.citations }}</p>
                </div>
              </div>

              <div v-if="selectedPublication?.authors && selectedPublication.authors.length > 0">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">Author
                  Details</h4>
                <div class="space-y-2">
                  <div
                    v-for="author in [...selectedPublication.authors].sort((a, b) => a.author_order - b.author_order)"
                    :key="author.id"
                    class="flex items-start gap-2 text-sm">
                    <span class="font-medium text-gray-600 dark:text-gray-400 min-w-[30px]">{{ author.author_order
                      }}.</span>
                    <div class="flex-1">
                      <span class="text-gray-800 dark:text-gray-200">{{ author.author_name }}</span>
                      <span v-if="author.affiliation"
                            class="text-gray-500 dark:text-gray-400 text-xs ml-2">({{ author.affiliation }})</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Abstract</h4>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ getAbstract(selectedPublication) }}</p>
              </div>

              <div v-if="selectedPublication?.keywords">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                  Keywords</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="keyword in getKeywords(selectedPublication)" :key="keyword"
                        class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {{ keyword }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 sm:px-8 sm:py-6">
            <div class="flex flex-wrap gap-3 justify-end">
              <button
                v-if="selectedPublication?.url"
                @click="openUrl(selectedPublication.url)"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                View Paper
              </button>
              <button
                v-if="selectedPublication?.doi"
                @click="openUrl(`https://doi.org/${selectedPublication.doi}`)"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                View DOI
              </button>
              <button
                v-if="selectedPublication?.pdf"
                @click="openUrl(selectedPublication.pdf)"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center"
              >
                <Download class="w-4 h-4 mr-2" />
                Download PDF
              </button>
              <button
                @click="closeDialog"
                class="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

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

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
