<script setup>
import { Mail, MapPin, GraduationCap } from 'lucide-vue-next'
const emit = defineEmits(['apply'])

const contactInfo = [
  {
    icon: MapPin,
    title: 'Location',
    details: [
      'Multi Media Building, Room 510',
      '22 Sooncheonhyang-ro, Asan-si',
      'Chungcheongnam-do, South Korea 31538'
    ],
    description: 'Main research lab location'
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['mcnlab@sch.ac.kr', '------@sch.ac.kr (Prof. ----)'],
    description: 'For general inquiries'
  },
  {
    icon: GraduationCap,
    title: 'Join Our Lab',
    details: ['PhD, Masters, Undergraduate positions available'],
    description: 'We welcome applications from prospective researchers'
  }
]
</script>

<template>
  <section id="contact" class="relative py-24 overflow-hidden">

    <!-- Background glow -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute w-[500px] h-[500px] bg-blue-400/20 blur-[140px] rounded-full top-0 left-0"></div>
      <div class="absolute w-[500px] h-[500px] bg-purple-400/20 blur-[140px] rounded-full bottom-0 right-0"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="max-w-7xl mx-auto">

        <HomeUISectionHeader
          badge-text="Get In Touch"
          badge-icon="Mail"
          title="Contact Our Lab"
          subtitle="Interested in collaboration, research positions, or learning more about our work?"
        />

        <div class="grid lg:grid-cols-3 gap-8 mt-14">

          <div
            v-for="info in contactInfo"
            :key="info.title"
            class="group relative p-[1px] rounded-2xl bg-white hover:bg-gradient-to-br hover:from-blue-400 hover:via-purple-400 hover:to-cyan-400 transition-all duration-300"
          >
            <!-- card -->
            <div
              class="h-full rounded-2xl bg-white dark:bg-gray-900 p-8 transition duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
            >
              <!-- icon -->
              <div
                class="w-14 h-14 mb-6 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800"
              >
                <component :is="info.icon" class="w-7 h-7 text-gray-700 dark:text-gray-300"/>
              </div>

              <h3 class="text-xl font-semibold mb-3">
                {{ info.title }}
              </h3>

              <div class="space-y-1 mb-3">
                <p
                  v-for="detail in info.details"
                  :key="detail"
                  class="text-gray-600 dark:text-gray-400"
                >
                  {{ detail }}
                </p>
              </div>

              <p
                v-if="info.description"
                class="text-sm text-gray-500 dark:text-gray-500"
              >
                {{ info.description }}
              </p>

              <HomeUIButton
                v-if="info.title === 'Join Our Lab'"
                @click="$emit('apply')"
                class="mt-6 w-full"
                size="small"
              >
                Apply Now
              </HomeUIButton>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>
</template>
