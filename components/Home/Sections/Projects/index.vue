<script setup>
import { Briefcase, Users, Calendar, DollarSign, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  projects: Array
});

const getStatusBadge = (status) => {
  const types = {
    'Active': { type: 'success', text: 'Active' },
    'Starting Soon': { type: 'info', text: 'Starting Soon' },
    'Completed': { type: 'default', text: 'Completed' }
  };
  return types[status] || { type: 'default', text: status };
};
</script>

<template>
  <section id="projects" class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-6">
      <div class="max-w-7xl mx-auto">
        <HomeUISectionHeader
          badge-text="Research Projects"
          badge-icon="Briefcase"
          title="Current Research Projects"
          subtitle="Funded projects addressing critical challenges in computing and networking."
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <HomeUICard
            v-for="project in projects"
            :key="project.title"
            :title="project.title"
            :description="project.description"
            class="h-full flex flex-col"
          >
            <template #header>
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <HomeUIBadge
                  :text="getStatusBadge(project.status).text"
                  :type="getStatusBadge(project.status).type"
                  class="self-start sm:self-auto"
                />
                <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar class="w-4 h-4 mr-2 shrink-0" />
                  <span class="truncate">{{ project.duration }}</span>
                </div>
              </div>
            </template>

            <div class="mb-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Funding Source</div>
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400 truncate">
                {{ project.funding }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Budget: {{ project.budget }}
              </div>
            </div>

            <div class="mb-6 flex-1">
              <div class="flex flex-wrap gap-2">
                <HomeUIBadge
                  v-for="tech in project.technologies"
                  :key="tech"
                  :text="tech"
                  type="info"
                  class="text-xs"
                />
              </div>
            </div>

            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div class="flex items-center">
                <Users class="w-4 h-4 mr-2 shrink-0" />
                <span>{{ project.members }} members</span>
              </div>
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center group self-start sm:self-auto mt-2 sm:mt-0">
                <span>Details</span>
                <ChevronRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </HomeUICard>
        </div>

        <div class="mt-16 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-2xl p-8">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-2xl font-bold mb-4">Funding Partners</h3>
              <p class="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl">
                We gratefully acknowledge support from our funding partners who enable our
                cutting-edge research in computing and networks.
              </p>
              <div class="flex flex-wrap gap-4">
                <HomeUIBadge text="NRF Korea" type="success" />
                <HomeUIBadge text="IITP" type="info" />
                <HomeUIBadge text="MSIT" type="warning" />
                <HomeUIBadge text="Samsung" type="default" />
                <HomeUIBadge text="LG" type="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
