<script setup>
import { ref } from 'vue';
import { FileText, ExternalLink, Code, Download, Eye, Clock, ArrowRight, X } from 'lucide-vue-next';

const props = defineProps({
  publications: {
    type: Array,
    default: () => []
  }
});

const selectedPublication = ref(null);
const showDialog = ref(false);

const getBadgeColor = (badge) => {
  const colors = {
    'International Journal': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    'Conference': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    'Book Chapter': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    'Patent': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' }
  };
  return colors[badge] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
};

// Helper function to format date
const getYear = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).getFullYear();
};

// Helper function to format full date
const getFullDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Helper function to format authors
const getAuthors = (pub) => {
  if (!pub.authors || pub.authors.length === 0) {
    return 'Authors information coming soon';
  }

  // Sort authors by author_order and join names
  const sortedAuthors = [...pub.authors].sort((a, b) => a.author_order - b.author_order);
  return sortedAuthors.map(author => author.author_name).join(', ');
};

// Helper function to get author count
const getAuthorCount = (pub) => {
  return pub.authors ? pub.authors.length : 0;
};

// Helper to open URL
const openUrl = (url) => {
  if (url) {
    window.open(url, '_blank');
  }
};

// Open details dialog
const openDetails = (pub) => {
  selectedPublication.value = pub;
  showDialog.value = true;
};

// Close dialog
const closeDialog = () => {
  showDialog.value = false;
  selectedPublication.value = null;
};

// Format abstract (handle null/undefined)
const getAbstract = (pub) => {
  return pub.abstract || '';
};

// Format keywords
const getKeywords = (pub) => {
  if (!pub.keywords) return [];
  return pub.keywords.split(',').map(k => k.trim());
};
</script>

<template>
  <section id="publications" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <HomeUISectionHeader
          badge-text="Research Output"
          badge-icon="FileText"
          title="Recent Publications"
          subtitle="Selected publications from our research in top-tier venues."
        />

        <div v-if="publications && publications.length > 0" class="mt-8 sm:mt-12">
          <!-- Top 2 publications in a row on desktop -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:mb-8">
            <HomeUICard
              v-for="pub in publications.slice(0, 2)"
              :key="pub.id"
              class="hover:shadow-lg transition-shadow duration-300 h-full"
            >
              <div class="p-4 sm:p-6 h-full flex flex-col">
                <!-- Header with badges -->
                <div class="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <div class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                       :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                    {{ pub.badge || 'Publication' }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ pub.journal || 'Journal' }}</div>
                </div>

                <!-- Title -->
                <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 leading-tight line-clamp-2">
                  {{ pub.title }}
                </h3>

                <!-- Authors -->
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                  {{ getAuthors(pub) }}
                </p>

                <!-- Venue and Year -->
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  {{ pub.journal || pub.venue }} · {{ getYear(pub.date) }}
                </p>

                <!-- Abstract preview -->
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 line-clamp-3 flex-1">
                  {{ getAbstract(pub) }}
                </p>

                <!-- Stats -->
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                  <div class="flex items-center">
                    <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ pub.citations || 0 }} citations</span>
                  </div>
                  <div class="flex items-center">
                    <Clock class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>Published {{ getYear(pub.date) }}</span>
                  </div>
                  <div class="flex items-center" v-if="getAuthorCount(pub) > 0">
                    <Users class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ getAuthorCount(pub) }} authors</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700">
                  <div class="grid grid-cols-2 gap-2">
                    <HomeUIButton
                      @click="openUrl(pub.url)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs"
                      :disabled="!pub.url"
                    >
                      <ExternalLink class="w-3 h-3 mr-1" />
                      Paper
                    </HomeUIButton>
                    <HomeUIButton
                      @click="openDetails(pub)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs"
                    >
                      <Eye class="w-3 h-3 mr-1" />
                      Details
                    </HomeUIButton>
                  </div>
                </div>
              </div>
            </HomeUICard>
          </div>

          <!-- Remaining publications in a vertical list -->
          <div class="space-y-4 sm:space-y-6">
            <HomeUICard
              v-for="pub in publications.slice(2)"
              :key="pub.id"
              class="hover:shadow-lg transition-shadow duration-300"
            >
              <div class="p-4 sm:p-6">
                <!-- Header with badges -->
                <div class="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <div class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                       :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                    {{ pub.badge || 'Publication' }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ pub.journal || 'Journal' }}</div>
                </div>

                <!-- Title -->
                <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 leading-tight">
                  {{ pub.title }}
                </h3>

                <!-- Authors -->
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">
                  {{ getAuthors(pub) }}
                </p>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  {{ pub.journal || pub.venue }} · {{ getYear(pub.date) }}
                </p>

                <!-- Abstract preview -->
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 line-clamp-2">
                  {{ getAbstract(pub) }}
                </p>

                <!-- Stats -->
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                  <div class="flex items-center">
                    <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ pub.citations || 0 }} citations</span>
                  </div>
                  <div class="flex items-center">
                    <Clock class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>Published {{ getYear(pub.date) }}</span>
                  </div>
                  <div v-if="pub.doi" class="flex items-center">
                    <Code class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span class="truncate">DOI: {{ pub.doi }}</span>
                  </div>
                  <div class="flex items-center" v-if="getAuthorCount(pub) > 0">
                    <Users class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ getAuthorCount(pub) }} authors</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700">
                  <div class="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                    <HomeUIButton
                      @click="openUrl(pub.url)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm"
                      :disabled="!pub.url"
                    >
                      <ExternalLink class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span class="hidden sm:inline">View Paper</span>
                      <span class="sm:hidden">Paper</span>
                    </HomeUIButton>
                    <HomeUIButton
                      v-if="pub.doi"
                      @click="openUrl(`https://doi.org/${pub.doi}`)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm"
                    >
                      <ExternalLink class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      DOI
                    </HomeUIButton>
                    <HomeUIButton
                      v-else
                      disabled
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm opacity-50 cursor-not-allowed"
                    >
                      <ExternalLink class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      No DOI
                    </HomeUIButton>
                    <HomeUIButton
                      v-if="pub.pdf"
                      @click="openUrl(pub.pdf)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm"
                    >
                      <Download class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      PDF
                    </HomeUIButton>
                  </div>
                  <HomeUIButton
                    @click="openDetails(pub)"
                    class="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-center sm:justify-start transition-colors w-full sm:w-auto"
                  >
                    <Eye class="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    View Details
                  </HomeUIButton>
                </div>
              </div>
            </HomeUICard>
          </div>
        </div>

        <!-- Empty state -->
        <div v-else class="mt-8 sm:mt-12 text-center py-12">
          <p class="text-gray-500 dark:text-gray-400">No publications available at this time.</p>
        </div>

        <!-- Centered "View All Publications" button -->
        <div v-if="publications && publications.length > 0" class="mt-12 flex justify-center">
          <HomeUIButton variant="secondary" size="medium" class="px-8" @click="navigateTo('publications')">
            View All Publications
          </HomeUIButton>
        </div>
      </div>
    </div>

    <!-- Details Dialog -->
    <div v-if="showDialog" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-90 transition-opacity" @click="closeDialog"></div>

        <!-- Center modal -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Header -->
          <div class="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 px-6 py-4 sm:px-8 sm:py-6">
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

          <!-- Content -->
          <div class="px-6 py-6 sm:px-8 sm:py-8">
            <div class="space-y-6">
              <!-- Authors -->
              <div>
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Authors</h4>
                <p class="text-gray-800 dark:text-gray-200 leading-relaxed">{{ getAuthors(selectedPublication) }}</p>
              </div>

              <!-- Publication Info -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Journal / Venue</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ selectedPublication?.journal || selectedPublication?.venue || 'N/A' }}</p>
                </div>
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Publication Date</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ getFullDate(selectedPublication?.date) }}</p>
                </div>
                <div v-if="selectedPublication?.doi">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">DOI</h4>
                  <a :href="`https://doi.org/${selectedPublication.doi}`" target="_blank" class="text-blue-600 dark:text-blue-400 hover:underline break-all">
                    {{ selectedPublication.doi }}
                  </a>
                </div>
                <div v-if="selectedPublication?.citations !== undefined">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Citations</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ selectedPublication.citations }}</p>
                </div>
                <div v-if="selectedPublication?.publisher">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Publisher</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ selectedPublication.publisher }}</p>
                </div>
                <div v-if="getAuthorCount(selectedPublication) > 0">
                  <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Total Authors</h4>
                  <p class="text-gray-800 dark:text-gray-200">{{ getAuthorCount(selectedPublication) }}</p>
                </div>
              </div>

              <!-- Author List with Details -->
              <div v-if="selectedPublication?.authors && selectedPublication.authors.length > 0">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-3">Author Details</h4>
                <div class="space-y-2">
                  <div v-for="author in [...selectedPublication.authors].sort((a, b) => a.author_order - b.author_order)"
                       :key="author.id"
                       class="flex items-start gap-2 text-sm">
                    <span class="font-medium text-gray-600 dark:text-gray-400 min-w-[30px]">{{ author.author_order }}.</span>
                    <div class="flex-1">
                      <span class="text-gray-800 dark:text-gray-200">{{ author.author_name }}</span>
                      <span v-if="author.affiliation" class="text-gray-500 dark:text-gray-400 text-xs ml-2">({{ author.affiliation }})</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Abstract -->
              <div>
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Abstract</h4>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ getAbstract(selectedPublication) }}</p>
              </div>

              <!-- Keywords -->
              <div v-if="selectedPublication?.keywords">
                <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Keywords</h4>
                <div class="flex flex-wrap gap-2">
                  <span v-for="keyword in getKeywords(selectedPublication)" :key="keyword"
                        class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {{ keyword }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer with actions -->
          <div class="bg-gray-50 dark:bg-gray-900 px-6 py-4 sm:px-8 sm:py-6">
            <div class="flex flex-wrap gap-3 justify-end">
              <HomeUIButton
                v-if="selectedPublication?.url"
                @click="openUrl(selectedPublication.url)"
                variant="primary"
                size="medium"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                View Paper
              </HomeUIButton>
              <HomeUIButton
                v-if="selectedPublication?.doi"
                @click="openUrl(`https://doi.org/${selectedPublication.doi}`)"
                variant="secondary"
                size="medium"
              >
                <ExternalLink class="w-4 h-4 mr-2" />
                View DOI
              </HomeUIButton>
              <HomeUIButton
                v-if="selectedPublication?.pdf"
                @click="openUrl(selectedPublication.pdf)"
                variant="outline"
                size="medium"
              >
                <Download class="w-4 h-4 mr-2" />
                Download PDF
              </HomeUIButton>
              <HomeUIButton
                @click="closeDialog"
                variant="outline"
                size="medium"
              >
                Close
              </HomeUIButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
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

@media (max-width: 640px) {
  .line-clamp-2 {
    -webkit-line-clamp: 3;
  }
}
</style>
