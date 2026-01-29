<script setup>
import { Briefcase, Users, Calendar, DollarSign, ChevronRight } from 'lucide-vue-next';
import SectionHeader from '@/components/Home/ui/SectionHeader';
import Card from '@/components/Home/ui/Card';
import Badge from '@/components/Home/ui/Badge';

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
        <SectionHeader
          badge-text="Research Projects"
          badge-icon="Briefcase"
          title="Current Research Projects"
          subtitle="Funded projects addressing critical challenges in computing and networking."
        />

        <div class="grid md:grid-cols-3 gap-8">
          <Card
            v-for="project in projects"
            :key="project.title"
            :title="project.title"
            :description="project.description"
          >
            <template #header>
              <div class="flex items-center justify-between mb-6">
                <Badge
                  :text="getStatusBadge(project.status).text"
                  :type="getStatusBadge(project.status).type"
                />
                <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  <Calendar class="w-4 h-4 mr-1" />
                  {{ project.duration }}
                </div>
              </div>
            </template>

            <div class="mb-6">
              <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">Funding Source</div>
              <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
                {{ project.funding }}
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Budget: {{ project.budget }}
              </div>
            </div>

            <div class="flex flex-wrap gap-2 mb-6">
              <Badge
                v-for="tech in project.technologies"
                :key="tech"
                :text="tech"
                type="info"
              />
            </div>

            <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div class="flex items-center">
                <Users class="w-4 h-4 mr-2" />
                {{ project.members }} members
              </div>
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium flex items-center group">
                Project Details
                <ChevronRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </Card>
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
                <Badge text="NRF Korea" type="success" />
                <Badge text="IITP" type="info" />
                <Badge text="MSIT" type="warning" />
                <Badge text="Samsung" type="default" />
                <Badge text="LG" type="default" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
