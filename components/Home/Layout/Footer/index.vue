<script setup>
import {
  Avatar,
  Promotion,
  VideoPlay,
  ChatDotRound,
} from '@element-plus/icons-vue'

const currentYear = new Date().getFullYear()

// Lab highlights carousel
const labHighlights = [
  {
    title: 'AI Research Breakthrough',
    description: 'Published in Nature Communications',
    tag: 'Latest',
  },
  {
    title: 'Hackathon Winners 2024',
    description: '1st Place in National AI Competition',
    tag: 'Achievement',
  },
  {
    title: 'Industry Collaboration',
    description: 'Partnership with Samsung Research',
    tag: 'News',
  },
  {
    title: 'Conference Speaker',
    description: 'Keynote at ICML 2024',
    tag: 'Recognition',
  },
]

// Quick links
const quickLinks = [
  {
    name: 'University Website',
    icon: '🏠',
    color: 'text-purple-400',
    url: 'https://www.sch.ac.kr/',
  },
  {
    name: 'Publications',
    icon: '📚',
    color: 'text-blue-400',
    url: 'https://mcn.sch.ac.kr/publications',
  },
]

// Social media platforms
const socialMedia = [
  {
    icon: Avatar,
    name: 'Instagram',
    color: 'hover:bg-gradient-to-r from-purple-500 to-pink-500',
    url: '#',
  },
  {
    icon: Promotion,
    name: 'Twitter',
    color: 'hover:bg-gradient-to-r from-blue-400 to-cyan-400',
    url: '#',
  },
  {
    icon: VideoPlay,
    name: 'YouTube',
    color: 'hover:bg-gradient-to-r from-red-500 to-orange-500',
    url: '#',
  },
  {
    icon: ChatDotRound,
    name: 'KakaoTalk',
    color: 'hover:bg-gradient-to-r from-yellow-300 to-yellow-500',
    url: '#',
  },
]
</script>

<template>
  <footer
    class="relative overflow-hidden bg-gradient-to-b from-gray-900 to-black text-white pt-12"
  >
    <!-- Korean traditional pattern overlay -->
    <div class="absolute inset-0 opacity-5"></div>

    <!-- Animated gradient border -->
    <div
      class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x"
    ></div>

    <div class="container mx-auto px-4 sm:px-6 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid lg:grid-cols-12 gap-8 mb-12">
          <!-- Logo and Description -->
          <div class="lg:col-span-4">
            <div class="mb-6">
              <div>
                <img
                  src="@/assets/image/logo/mcn.svg"
                  alt="MCN Lab Logo"
                  class="h-8 sm:h-10 md:h-12 w-auto"
                />
              </div>
            </div>
            <p class="text-gray-300 mb-6 leading-relaxed text-justify">
              Mobile Computing and Networking Laboratory (MCN Lab) is under the
              supervision of Professor Kim Seokhoon, Ph.D., who leads the
              research candidates for master's, Ph.D., and postdoctoral degrees.
            </p>

            <!-- Quick Access Grid -->
            <div class="mb-8">
              <h4 class="font-bold text-lg mb-4 flex items-center">
                <span class="mr-2">⚡</span> Quick Access
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <a
                  v-for="link in quickLinks"
                  :key="link.name"
                  :href="link.url"
                  class="group flex items-center space-x-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <span class="text-xl" :class="link.color">{{
                    link.icon
                  }}</span>
                  <span
                    class="text-sm group-hover:text-cyan-300 transition-colors"
                    >{{ link.name }}</span
                  >
                </a>
              </div>
            </div>
          </div>

          <!-- Contact and Location -->
          <div class="lg:col-span-4">
            <div class="mb-4">
              <h4 class="font-bold text-lg mb-4 flex items-center">
                <span class="mr-2">📍</span> Find Us
              </h4>
              <div class="space-y-4">
                <div
                  class="flex items-start space-x-3 p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/30"
                >
                  <div class="mt-1">
                    <div class="w-2 h-2 bg-cyan-400 rounded-full"></div>
                  </div>
                  <div>
                    <p class="font-medium mb-1">Multi Media Building</p>
                    <p class="text-sm text-gray-400">
                      Soonchunhyang University
                    </p>
                    <p class="text-sm text-gray-400">
                      Asan, Chungcheongnam-do, South Korea
                    </p>
                  </div>
                </div>

                <div
                  class="p-4 rounded-xl bg-gradient-to-r from-gray-800/50 to-gray-900/50 border border-gray-700/30"
                >
                  <h5 class="font-medium mb-2 flex items-center">
                    <span class="mr-2">📧</span> Contact Info
                  </h5>
                  <ul class="space-y-2 text-sm">
                    <li class="flex items-center space-x-2 text-gray-300">
                      <span class="text-cyan-400">→</span>
                      <span>Office: M515 (5th Floor)</span>
                    </li>
                    <li class="flex items-center space-x-2 text-gray-300">
                      <span class="text-cyan-400">→</span>
                      <span>Office Hours: 9:00 AM - 5:00 PM </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Resources and Social -->
          <div class="lg:col-span-4">
            <!-- Resources -->
            <div class="mb-8">
              <h4 class="font-bold text-lg mb-4 flex items-center">
                <span class="mr-2">📁</span> Resources
              </h4>
              <div class="grid grid-cols-2 gap-3">
                <a
                  href="#"
                  class="group p-3 rounded-lg bg-gray-800/50 hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-cyan-900/30 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300"
                >
                  <div class="text-blue-400 mb-1">📊</div>
                  <p
                    class="text-sm font-medium group-hover:text-blue-300 transition-colors"
                  >
                    Research Data
                  </p>
                  <p class="text-xs text-gray-400">Datasets & Tools</p>
                </a>
                <a
                  href="https://library.sch.ac.kr/local/html/researchSupport3"
                  class="group p-3 rounded-lg bg-gray-800/50 hover:bg-gradient-to-r hover:from-purple-900/30 hover:to-pink-900/30 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300"
                >
                  <div class="text-purple-400 mb-1">🎓</div>
                  <p
                    class="text-sm font-medium group-hover:text-purple-300 transition-colors"
                  >
                    Thesis Guide
                  </p>
                  <p class="text-xs text-gray-400">Templates & Tips</p>
                </a>
                <a
                  href="#"
                  class="group p-3 rounded-lg bg-gray-800/50 hover:bg-gradient-to-r hover:from-green-900/30 hover:to-emerald-900/30 border border-gray-700/50 hover:border-green-500/50 transition-all duration-300"
                >
                  <div class="text-green-400 mb-1">👨‍💻</div>
                  <p
                    class="text-sm font-medium group-hover:text-green-300 transition-colors"
                  >
                    Gallery
                  </p>
                  <p class="text-xs text-gray-400">Images & Media</p>
                </a>
                <a
                  href="https://library.sch.ac.kr/"
                  class="group p-3 rounded-lg bg-gray-800/50 hover:bg-gradient-to-r hover:from-yellow-900/30 hover:to-orange-900/30 border border-gray-700/50 hover:border-yellow-500/50 transition-all duration-300"
                >
                  <div class="text-yellow-400 mb-1">📖</div>
                  <p
                    class="text-sm font-medium group-hover:text-yellow-300 transition-colors"
                  >
                    University Library
                  </p>
                  <p class="text-xs text-gray-400">중앙도서관</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer Bottom -->
        <div class="pt-8 border-t border-gray-800/50 text-center mb-10">
          <div
            class="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
          >
            <p class="text-gray-400 text-sm">
              © {{ currentYear }} Mobile Computing & Networking Lab,
              Soonchunhyang University. All rights reserved.
            </p>
            <div class="flex items-center space-x-6">
              <a
                href="#"
                class="text-gray-400 hover:text-cyan-300 text-sm transition-colors"
                >Privacy Policy</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-cyan-300 text-sm transition-colors"
                >Terms of Use</a
              >
              <a
                href="#"
                class="text-gray-400 hover:text-cyan-300 text-sm transition-colors"
                >Accessibility</a
              >
              <span
                class="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700"
              >
                Made in Korea
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Floating decorative elements -->
    <div
      class="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl"
    ></div>
    <div
      class="absolute top-20 left-4 w-16 h-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-xl"
    ></div>
  </footer>
</template>

<style>
@keyframes gradient-x {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-x {
  background-size: 200% 200%;
  animation: gradient-x 3s ease infinite;
}

/* Custom scrollbar for carousel */
.el-carousel__arrow {
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
}

.el-carousel__arrow:hover {
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Smooth transitions */
* {
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    transform 0.3s ease;
}
</style>
