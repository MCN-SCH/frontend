<script setup>
import { FileText, Calendar, MapPin, Users, ChevronRight } from 'lucide-vue-next';

const props = defineProps({
  news: Array,
  events: Array
});

const getBadgeType = (type) => {
  const types = {
    'Publication': 'info',
    'Funding': 'success',
    'Collaboration': 'default',
    'Award': 'warning'
  };
  return types[type] || 'default';
};
</script>

<template>
  <section class="py-20 bg-gray-50 dark:bg-gray-900">
    <div class="container mx-auto px-6">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12">
          <!-- News -->
          <div>
            <div class="flex items-center justify-between mb-8">
              <div>
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
                  <FileText class="w-4 h-4 mr-2" />
                  Latest News
                </div>
                <h2 class="text-3xl font-bold">Lab Updates</h2>
              </div>
              <HomeUIButton variant="outline" size="small">
                View All
              </HomeUIButton>
            </div>

            <div class="space-y-6">
              <HomeUICard
                v-for="item in news"
                :key="item.title"
                :title="item.title"
                :description="item.description"
              >
                <template #header>
                  <div class="flex items-center justify-between mb-3">
                    <HomeUIBadge :text="item.type" :type="getBadgeType(item.type)" />
                    <div class="text-sm text-gray-500 dark:text-gray-400">{{ item.date }}</div>
                  </div>
                </template>

                <template #action>
                  Read More
                  <ChevronRight class="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </template>
              </HomeUICard>
            </div>
          </div>

          <!-- Events -->
          <div>
            <div class="flex items-center justify-between mb-8">
              <div>
                <div class="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-2">
                  <Calendar class="w-4 h-4 mr-2" />
                  Upcoming Events
                </div>
                <h2 class="text-3xl font-bold">Events & Seminars</h2>
              </div>
              <HomeUIButton variant="outline" size="small">
                Calendar
              </HomeUIButton>
            </div>

            <div class="space-y-6">
              <HomeUICard
                v-for="event in events"
                :key="event.title"
                :title="event.title"
              >
                <template #header>
                  <div class="flex items-start gap-4 mb-4">
                    <div class="text-center min-w-16">
                      <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {{ event.date.split('.')[2] }}
                      </div>
                      <div class="text-sm text-gray-500 dark:text-gray-400">
                        {{ event.date.slice(0,7) }}
                      </div>
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-2">
                        <HomeUIBadge :text="event.type" type="default" />
                        <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                          <Users class="w-4 h-4 mr-1" />
                          {{ event.participants }}
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <p class="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {{ event.description }}
                </p>

                <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin class="w-4 h-4 mr-2" />
                  {{ event.location }}
                </div>

                <template #action>
                  Event Details
                </template>
              </HomeUICard>
            </div>

            <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 class="font-bold text-lg mb-4">Weekly Seminars</h4>
              <p class="text-gray-600 dark:text-gray-300 mb-4">
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
  </section>
</template>
