<script setup>
import { Server, Wifi, Smartphone, Users2 } from 'lucide-vue-next';
import SectionHeader from '@/components/Home/ui/SectionHeader';
import Card from '@/components/Home/ui/Card';
import Badge from '@/components/Home/ui/Badge';

const props = defineProps({
  facilities: Array
});
</script>

<template>
  <section id="facilities" class="py-20">
    <div class="container mx-auto px-6">
      <div class="max-w-7xl mx-auto">
        <SectionHeader
          badge-text="Research Facilities"
          badge-icon="Server"
          title="Our Research Infrastructure"
          subtitle="State-of-the-art facilities and equipment supporting cutting-edge research."
        />

        <div class="grid md:grid-cols-4 gap-8">
          <Card
            v-for="facility in facilities"
            :key="facility.name"
            :title="facility.name"
            :description="facility.description"
          >
            <template #header>
              <div class="h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl mb-6 flex items-center justify-center">
                <component :is="facility.icon" class="w-20 h-20 text-gray-400 dark:text-gray-500" />
              </div>
            </template>

            <div class="space-y-2">
              <div v-for="spec in facility.specs" :key="spec" class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div class="w-2 h-2 rounded-full bg-blue-500 mr-3 flex-shrink-0"></div>
                <span>{{ spec }}</span>
              </div>
            </div>

            <template #action>
              View Details
            </template>
          </Card>
        </div>

        <div class="mt-16 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-2xl p-8">
          <div class="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 class="text-2xl font-bold mb-4">Access & Usage</h3>
              <ul class="space-y-3">
                <li class="flex items-center">
                  <Badge text="Available" type="success" class="mr-3" />
                  <span class="text-gray-700 dark:text-gray-300">Lab members have 24/7 access</span>
                </li>
                <li class="flex items-center">
                  <Badge text="Training" type="info" class="mr-3" />
                  <span class="text-gray-700 dark:text-gray-300">Required training before equipment use</span>
                </li>
                <li class="flex items-center">
                  <Badge text="Reservation" type="warning" class="mr-3" />
                  <span class="text-gray-700 dark:text-gray-300">Online reservation system for shared equipment</span>
                </li>
                <li class="flex items-center">
                  <Badge text="Collaboration" type="default" class="mr-3" />
                  <span class="text-gray-700 dark:text-gray-300">Available for external collaborators</span>
                </li>
              </ul>
            </div>
            <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
              <h4 class="font-bold text-lg mb-4">Equipment Requests</h4>
              <p class="text-gray-700 dark:text-gray-300 mb-4">
                Lab members can request new equipment purchases through the lab manager.
                Requests are reviewed quarterly.
              </p>
              <Button variant="outline" size="small">
                Submit Equipment Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
