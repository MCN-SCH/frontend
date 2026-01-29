<script setup>
import { FileText, ExternalLink, Code, Download, Eye, Clock, ArrowRight } from 'lucide-vue-next';
import SectionHeader from '@/components/Home/ui/SectionHeader';
import Card from '@/components/Home/ui/Card';
import Badge from '@/components/Home/ui/Badge';
import Button from '@/components/Home/ui/Button';

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
  <section id="publications" class="py-20 bg-gray-50 dark:bg-gray-900/50">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <SectionHeader
          badge-text="Research Output"
          badge-icon="FileText"
          title="Recent Publications"
          subtitle="Selected publications from our research in top-tier venues."
        />

        <div class="mt-12 space-y-6">
          <Card
            v-for="pub in publications"
            :key="pub.title"
            class="hover:shadow-lg transition-shadow duration-300"
          >
            <div class="p-6">
              <!-- Header with badges -->
              <div class="flex flex-wrap items-center gap-2 mb-4">
                <div class="px-3 py-1 rounded-full text-xs font-medium"
                     :class="[getBadgeColor(pub.badge).bg, getBadgeColor(pub.badge).text]">
                  {{ pub.badge }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ pub.impact }}</div>
                <Badge v-if="pub.award" :text="pub.award" type="warning" />
              </div>

              <!-- Title -->
              <h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3 leading-tight">
                {{ pub.title }}
              </h3>

              <!-- Authors and venue -->
              <p class="text-gray-600 dark:text-gray-300 mb-2">{{ pub.authors }}</p>
              <p class="text-gray-500 dark:text-gray-400 text-sm mb-4">
                {{ pub.venue }} · {{ pub.year }}
              </p>

              <!-- Abstract preview -->
              <p class="text-gray-600 dark:text-gray-300 text-sm mb-5 line-clamp-2">
                {{ pub.abstract }}
              </p>

              <!-- Stats -->
              <div class="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <div class="flex items-center">
                  <FileText class="w-4 h-4 mr-2" />
                  <span>{{ pub.citations }} citations</span>
                </div>
                <div class="flex items-center">
                  <Clock class="w-4 h-4 mr-2" />
                  <span>{{ pub.status }}</span>
                </div>
              </div>

              <!-- Action buttons -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t border-gray-100 dark:border-gray-700">
                <div class="flex flex-wrap gap-2">
                  <Button
                    @click="window.open(pub.link, '_blank')"
                    variant="outline"
                    size="small"
                    class="flex-1 sm:flex-none"
                  >
                    <ExternalLink class="w-4 h-4 mr-2" />
                    View Paper
                  </Button>
                  <Button
                    @click="$emit('openBibtex', pub)"
                    variant="outline"
                    size="small"
                    class="flex-1 sm:flex-none"
                  >
                    <Code class="w-4 h-4 mr-2" />
                    BibTeX
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    class="flex-1 sm:flex-none"
                  >
                    <Download class="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
                <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 flex items-center justify-center sm:justify-start transition-colors">
                  <Eye class="w-4 h-4 mr-2" />
                  View Details
                </button>
              </div>
            </div>
          </Card>
        </div>

        <!-- Centered "View All Publications" button -->
        <div class="mt-12 flex justify-center">
          <Button variant="secondary" size="medium" class="px-8">
            View All Publications
          </Button>
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
