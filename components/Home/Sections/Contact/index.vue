<script setup>
import { Mail, MapPin, GraduationCap } from 'lucide-vue-next';
const emit = defineEmits(['apply']);

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
];
</script>

<template>
  <section id="contact" class="py-20">
    <div class="container mx-auto px-6">
      <div class="max-w-7xl mx-auto">
        <HomeUISectionHeader
          badge-text="Get In Touch"
          badge-icon="Mail"
          title="Contact Our Lab"
          subtitle="Interested in collaboration, research positions, or learning more about our work?"
        />

        <div class="grid lg:grid-cols-2 gap-12">
          <!-- Contact Info -->
          <div>
            <div class="bg-gradient-to-br from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-lg">
              <h3 class="text-2xl font-bold mb-8">Contact Information</h3>

              <div class="space-y-6">
                <div v-for="info in contactInfo" :key="info.title" class="flex items-start">
                  <div class="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4 flex-shrink-0">
                    <component :is="info.icon" class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h4 class="font-bold text-lg mb-1">{{ info.title }}</h4>
                    <div class="space-y-1">
                      <p v-for="detail in info.details" :key="detail" class="text-gray-600 dark:text-gray-300">
                        {{ detail }}
                      </p>
                    </div>
                    <p v-if="info.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {{ info.description }}
                    </p>
                    <HomeUIButton
                      v-if="info.title === 'Join Our Lab'"
                      @click="$emit('apply')"
                      class="mt-3"
                      size="small"
                    >
                      Apply Now
                    </HomeUIButton>
                  </div>
                </div>
              </div>

              <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <h4 class="font-bold text-lg mb-4">Office Hours</h4>
                <div class="space-y-2 text-gray-600 dark:text-gray-300">
                  <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p>Saturday: By appointment</p>
                  <p>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Form -->
          <div>
            <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
              <h3 class="text-2xl font-bold mb-6">Send Us a Message</h3>

              <form class="space-y-6">
                <div class="grid md:grid-cols-2 gap-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all duration-300"
                      placeholder="Your name"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all duration-300"
                      placeholder="your.email@example.com"
                    >
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Affiliation</label>
                  <input
                    type="text"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all duration-300"
                    placeholder="University / Company"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject *</label>
                  <select
                    required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all duration-300"
                  >
                    <option value="">Select a subject</option>
                    <option value="collaboration">Research Collaboration</option>
                    <option value="position">Position Inquiry</option>
                    <option value="visit">Lab Visit Request</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message *</label>
                  <textarea
                    rows="5"
                    required
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 outline-none transition-all duration-300 resize-none"
                    placeholder="Your message..."
                  ></textarea>
                </div>

                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <input type="checkbox" id="subscribe" class="mr-2">
                  <label for="subscribe">Subscribe to lab updates and newsletter</label>
                </div>

                <Button type="submit" variant="primary" full-width>
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
