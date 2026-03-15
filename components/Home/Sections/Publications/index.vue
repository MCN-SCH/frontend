<script setup>
import { FileText, ExternalLink, Code, Download, Eye, Clock, ArrowRight } from 'lucide-vue-next';

const props = defineProps({
  publications: Array
});

const emit = defineEmits(['openBibtex']);

const getBadgeColor = (badge) => {
  const colors = {
    'Blockchain': { bg: 'bg-purple-100 dark:bg-purple-900/30', text: 'text-purple-700 dark:text-purple-300' },
    'Edge Computing': { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-300' },
    '5G Networks': { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300' },
    'AI/ML': { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300' }
  };
  return colors[badge] || { bg: 'bg-gray-100 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300' };
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

        <div class="mt-8 sm:mt-12">
          <!-- Top 2 publications in a row on desktop -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:mb-8">
            <HomeUICard
              v-for="pub in publications.slice(0, 2)"
              :key="pub.title"
              class="hover:shadow-lg transition-shadow duration-300 h-full"
            >
              <div class="p-4 sm:p-6 h-full flex flex-col">
                <!-- Header with badges -->
                <div class="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <div class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                       :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                    {{ pub.badge }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ pub.impact }}</div>
                  <HomeUIBadge v-if="pub.award" :text="pub.award" type="warning" size="small" />
                </div>

                <!-- Title -->
                <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 leading-tight line-clamp-2">
                  {{ pub.title }}
                </h3>

                <!-- Authors and venue -->
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2 line-clamp-1">{{ pub.authors }}</p>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  {{ pub.venue }} · {{ pub.year }}
                </p>

                <!-- Abstract preview -->
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 line-clamp-3 flex-1">
                  {{ pub.abstract }}
                </p>

                <!-- Stats -->
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                  <div class="flex items-center">
                    <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ pub.citations }} citations</span>
                  </div>
                  <div class="flex items-center">
                    <Clock class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ pub.status }}</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700">
                  <div class="grid grid-cols-2 gap-2">
                    <HomeUIButton
                      @click="window.open(pub.link, '_blank')"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs"
                    >
                      <ExternalLink class="w-3 h-3 mr-1" />
                      Paper
                    </HomeUIButton>
                    <HomeUIButton
                      @click="$emit('openBibtex', pub)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs"
                    >
                      <Code class="w-3 h-3 mr-1" />
                      BibTeX
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
              :key="pub.title"
              class="hover:shadow-lg transition-shadow duration-300"
            >
              <div class="p-4 sm:p-6">
                <!-- Header with badges -->
                <div class="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                  <div class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium"
                       :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                    {{ pub.badge }}
                  </div>
                  <div class="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{{ pub.impact }}</div>
                  <HomeUIBadge v-if="pub.award" :text="pub.award" type="warning" />
                </div>

                <!-- Title -->
                <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2 sm:mb-3 leading-tight">
                  {{ pub.title }}
                </h3>

                <!-- Authors and venue -->
                <p class="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-2">{{ pub.authors }}</p>
                <p class="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  {{ pub.venue }} · {{ pub.year }}
                </p>

                <!-- Abstract preview -->
                <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-4 sm:mb-5 line-clamp-2">
                  {{ pub.abstract }}
                </p>

                <!-- Stats -->
                <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
                  <div class="flex items-center">
                    <FileText class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ pub.citations }} citations</span>
                  </div>
                  <div class="flex items-center">
                    <Clock class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span>{{ pub.status }}</span>
                  </div>
                </div>

                <!-- Action buttons -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pt-4 sm:pt-5 border-t border-gray-100 dark:border-gray-700">
                  <div class="grid grid-cols-2 sm:flex gap-2 w-full sm:w-auto">
                    <HomeUIButton
                      @click="window.open(pub.link, '_blank')"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm"
                    >
                      <ExternalLink class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      <span class="hidden sm:inline">View Paper</span>
                      <span class="sm:hidden">Paper</span>
                    </HomeUIButton>
                    <HomeUIButton
                      @click="$emit('openBibtex', pub)"
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm"
                    >
                      <Code class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      BibTeX
                    </HomeUIButton>
                    <HomeUIButton
                      variant="outline"
                      size="small"
                      class="justify-center text-xs sm:text-sm col-span-2 sm:col-span-1 mt-2 sm:mt-0"
                    >
                      <Download class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                      PDF
                    </HomeUIButton>
                  </div>
                  <HomeUIButton
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

        <!-- Centered "View All Publications" button -->
        <div class="mt-12 flex justify-center">
          <HomeUIButton variant="secondary" size="medium" class="px-8">
            View All Publications
          </HomeUIButton>
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

@media (max-width: 640px) {
  .line-clamp-2 {
    -webkit-line-clamp: 3;
  }
}
</style>
