<script setup>
import {
  Microscope, Users2, Zap, Sparkles, Target, Globe, Shield, Cpu, Cloud, Brain,
  Network, Wifi, Server, Database, Radio, Car, Heart, Activity, UserPlus,
  Mail, MapPin, GraduationCap, BookOpen, Code, Layers, Cpu as CpuIcon,
  Satellite, Smartphone, Router, Shield as ShieldIcon,
  ExternalLink
} from 'lucide-vue-next';

// Google Maps directions link (opens in new tab)
const directionsLink = 'https://www.google.com/maps/place/MCN+Lab/@36.7690201,126.9325293,17z/data=!4m6!3m5!1s0x357ae744ad3ff7fd:0xb1de05bc8a92b9b7!8m2!3d36.7690201!4d126.9325293!16s%2Fg%2F11qxy5m7z3?entry=ttu';

// Naver Map link (popular in Korea)
const naverMapLink = 'https://map.naver.com/v5/search/%EC%88%9C%EC%B2%9C%ED%96%A5%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A9%80%ED%8B%B0%EB%AF%B8%EB%94%94%EC%96%B4%EA%B4%80%20M514';

// Kakao Map link (popular in Korea)
const kakaoMapLink = 'https://map.kakao.com/?q=%EC%88%9C%EC%B2%9C%ED%96%A5%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A9%80%ED%8B%B0%EB%AF%B8%EB%94%94%EC%96%B4%EA%B4%80%20M514';

const features = [
  {
    icon: Microscope,
    title: 'Research Excellence',
    description: 'Publishing in top-tier venues like IEEE, ACM, and advancing computing frontiers with innovative solutions.',
    color: 'from-blue-500 to-indigo-600',
    gradient: 'bg-gradient-to-br from-blue-500 to-indigo-600'
  },
  {
    icon: Users2,
    title: 'Collaborative Ecosystem',
    description: 'Fostering synergy between students, researchers, and industry leaders across Korea and globally.',
    color: 'from-teal-500 to-emerald-600',
    gradient: 'bg-gradient-to-br from-teal-500 to-emerald-600'
  },
  {
    icon: Zap,
    title: 'Real-World Impact',
    description: 'Translating research into practical solutions that drive Korea\'s digital transformation.',
    color: 'from-amber-500 to-orange-600',
    gradient: 'bg-gradient-to-br from-amber-500 to-orange-600'
  },
  {
    icon: Globe,
    title: 'Global Network',
    description: 'Building international partnerships and leading cross-border research initiatives.',
    color: 'from-purple-500 to-pink-600',
    gradient: 'bg-gradient-to-br from-purple-500 to-pink-600'
  }
];

const researchDomains = [
  {
    icon: Network,
    title: 'Next-Generation Networking',
    description: '5G/6G, RAN, fronthaul/backhaul/core, applied machine learning, traffic engineering',
    color: 'border-blue-200 dark:border-blue-800',
    items: ['5G Evolved Packet Core (EPC)', 'Virtual EPC & SDN', 'Network Function Virtualization (NFV)', 'Mobile Edge Computing (MEC)', 'Network Slicing']
  },
  {
    icon: Cpu,
    title: 'AI/ML Systems',
    description: 'Convergence of AI, SDN, NFV, MEC, and network slicing for next-gen networks',
    color: 'border-purple-200 dark:border-purple-800',
    items: ['Applied Machine Learning', 'Deep Learning for Networks', 'AI-based SDRAN', 'Intelligent Resource Management']
  },
  {
    icon: Car,
    title: 'Internet of Vehicle (IoV)',
    description: 'Social IoV, ultra-high reliability, ultra-low latency for V2V and V2X',
    color: 'border-teal-200 dark:border-teal-800',
    items: ['Social IoV (SIoV)', 'UHRV2V Communication', 'ULLV2V Communication', 'Vehicle-to-Everything (V2X)']
  },
  {
    icon: Heart,
    title: 'Medical Communications',
    description: 'Mission-critical healthcare systems with ultra-reliable low-latency communication',
    color: 'border-amber-200 dark:border-amber-800',
    items: ['Remote Operation Systems', 'ECG & Hypertension Monitoring', 'Hospital Bigdata Systems', 'Medical IoT Networks']
  },
  {
    icon: Wifi,
    title: 'IoT & Sensor Networks',
    description: 'Heterogeneous IoT, wireless sensor networks, and real-time IoT traffic engineering',
    color: 'border-green-200 dark:border-green-800',
    items: ['Heterogeneous IoT (HetIoT)', 'Wireless Sensor Networks', 'Wireless Body Area Networks', 'Narrow-Band IoT', 'Real-Time IoT Traffic']
  },
  {
    icon: Server,
    title: 'Edge & Cloud Computing',
    description: 'Software-defined edge cloud, mobile cloud computing, and core network environments',
    color: 'border-rose-200 dark:border-rose-800',
    items: ['Software-Defined Edge Cloud (SDEC)', 'Software-Defined RAN (SDRAN)', 'Mobile Cloud Computing', 'SDN/NFV/MEC Integration']
  }
];

const patterns = {
  pattern1: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20,20 L80,80 M80,20 L20,80' stroke='%233b82f6' stroke-width='2' fill='none' opacity='0.1'/%3E%3C/svg%3E`,
  pattern2: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='20' height='20' x='40' y='40' fill='%2310b981' opacity='0.1'/%3E%3C/svg%3E`,
  pattern3: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='50' cy='50' r='10' fill='%23f59e0b' opacity='0.1'/%3E%3C/svg%3E`,
  pattern4: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolygon points='50,20 80,80 20,80' fill='%238b5cf6' opacity='0.1'/%3E%3C/svg%3E`,
  pattern5: `data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,10 Q25,0 50,10 T100,10' stroke='%23e5e7eb' fill='none' stroke-width='0.5'/%3E%3C/svg%3E`,
  pattern6: `data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30,30 L70,70 M70,30 L30,70' stroke='%23333' stroke-width='2' opacity='0.05' fill='none'/%3E%3C/svg%3E`
};
</script>

<template>
  <section id="about" class="relative py-24 overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
    <div class="absolute top-0 left-0 w-64 h-64 opacity-5 dark:opacity-10">
      <div class="w-full h-full" :style="{ backgroundImage: `url('${patterns.pattern6}')` }"></div>
    </div>

    <div class="container relative mx-auto px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16">
          <div class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200 dark:border-blue-800 mb-6">
            <Sparkles class="w-4 h-4 text-blue-600 dark:text-blue-400 mr-2" />
            <span class="text-sm font-semibold text-blue-700 dark:text-blue-300">MCN Lab | Soonchunhyang University</span>
          </div>

          <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Mobile Computing<br>& Networking Lab
          </h2>

          <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Under the supervision of <span class="font-bold text-blue-700 dark:text-blue-300">Professor Kim Seokhoon, Ph.D.</span>,
            MCN Lab leads research candidates for master's, Ph.D., and postdoctoral degrees in
            <span class="font-semibold text-purple-600 dark:text-purple-400">next-generation networking</span> and
            <span class="font-semibold text-teal-600 dark:text-teal-400">AI-driven communication systems</span>.
          </p>
        </div>

        <!-- Overview Section -->
        <div class="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-10 mb-20">
          <div class="absolute -top-6 -left-6 w-24 h-24 rounded-full bg-blue-500/10 blur-xl"></div>
          <div class="absolute bottom-0 right-0 w-48 h-48 opacity-5" :style="{ backgroundImage: `url('${patterns.pattern2}')` }"></div>

          <div class="relative">
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
              <Target class="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
              Overview
            </h3>

            <div class="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
              <p>
                In the millimeter-wave and microwave length communications and artificial intelligence epochs,
                there has been motivated in virtualization and driven into softwarization networking to offer
                the best solution for resources management and orchestration with the extremely high
                quality-of-service (QoS).
              </p>

              <p>
                To achieve the aforementioned perspectives, MCN Lab has determined significant goals as listed below:
              </p>

              <ul class="space-y-3 mt-4">
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Research and development on integrated <span class="font-semibold text-blue-600 dark:text-blue-400">Artificial Intelligence (AI)</span> / <span class="font-semibold text-purple-600 dark:text-purple-400">Mobile Edge Computing (MEC)</span> / <span class="font-semibold text-teal-600 dark:text-teal-400">Network Function Virtualization (NFV)</span> / <span class="font-semibold text-amber-600 dark:text-amber-400">Software-Defined Networking (SDN)</span> / <span class="font-semibold text-pink-600 dark:text-pink-400">Software-Defined System (SDS)</span> / <span class="font-semibold text-indigo-600 dark:text-indigo-400">Network Slicing</span> for next-generation networking.</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Conduct the research based on scientific methods including theory, experimentation, originality research result, analysis, and conclusion.</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>To lead the research students in taking inventiveness, supervise the individual and group research, development work, and contribute the originality research outcomes.</span>
                </li>
                <li class="flex items-start">
                  <span class="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></span>
                  <span>Set up the research in both local and international research groups, and focus on both industrial and academy to modernize the research level.</span>
                </li>
              </ul>

              <div class="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p class="text-blue-800 dark:text-blue-200 font-medium">
                  <UserPlus class="inline w-5 h-5 mr-2" />
                  MCN Lab always offers opportunities to intelligent and high passionate students who are willing to pursue higher education in master's, Ph.D., and postdoctoral degrees to be a part of a research team in our lab.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Research Domain Section -->
        <div class="mb-20">
          <div class="text-center mb-12">
            <div class="inline-flex items-center justify-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 mb-4">
              <BookOpen class="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span class="text-sm font-semibold text-purple-700 dark:text-purple-300">Research Domains</span>
            </div>
            <h3 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">Our Research Focus</h3>
            <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              In the next-generation communications (5G/6G) era, we address critical challenges in
              resource management, traffic handling, and service orchestration.
            </p>
          </div>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="domain in researchDomains"
              :key="domain.title"
              class="group relative rounded-2xl border-2 p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer overflow-hidden bg-white dark:bg-gray-900"
              :class="[domain.color]"
            >
              <div
                class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                :style="{ backgroundImage: `url('${patterns.pattern6}')` }"
              ></div>

              <div class="relative">
                <div class="w-14 h-14 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center mb-4">
                  <component :is="domain.icon" class="w-7 h-7 text-gray-700 dark:text-gray-300" />
                </div>
                <h4 class="font-bold text-gray-800 dark:text-white text-lg mb-2">{{ domain.title }}</h4>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">{{ domain.description }}</p>
                <ul class="space-y-1 text-xs text-gray-500 dark:text-gray-400">
                  <li v-for="item in domain.items" :key="item" class="flex items-center">
                    <span class="w-1 h-1 rounded-full bg-current mr-2"></span>
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 border border-gray-200 dark:border-gray-700 text-center">
            <p class="text-sm text-gray-700 dark:text-gray-300">
              <span class="font-semibold">Note:</span> Software-Defined Mobile Edge Computing (SDMEC), SDRAN, mobile cloud computing, IoT networking,
              IoT/HetIoT traffic, quality-of-service and quality of user experience, 5G mobile core networks, traffic engineering,
              NFV/SDN/MEC, network slicing, and applied AI are under the umbrella of MCN Lab research domains.
            </p>
          </div>
        </div>


        <!-- Location & How to Join -->
        <div class="grid md:grid-cols-2 gap-8 mb-20">
          <!-- Location -->
          <div class="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-8">
            <div class="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-green-500/10 blur-xl"></div>
            <div class="relative">
              <div class="inline-flex items-center mb-4">
                <MapPin class="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">Location</h3>
              </div>

              <div class="space-y-1.5 text-gray-700 dark:text-gray-300 mb-4 text-sm">
                <p class="font-semibold">MCN Lab</p>
                <p>M514, Multimedia Hall (22), Soonchunhyang University</p>
                <p>Soonchunhyang-ro, Sinchang-myeon, Asan-si</p>
                <p>Chungcheongnam-do, Republic of Korea (31538)</p>
              </div>

              <!-- Map Links - Click to open -->
              <div class="flex gap-2 flex-wrap">
                <a
                  :href="directionsLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-all duration-200 text-xs font-medium"
                >
                  <span>📍</span>
                  Google Maps
                </a>
                <a
                  :href="naverMapLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/50 transition-all duration-200 text-xs font-medium"
                >
                  <span>🗺️</span>
                  Naver Map
                </a>
                <a
                  :href="kakaoMapLink"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 hover:bg-yellow-100 dark:hover:bg-yellow-900/50 transition-all duration-200 text-xs font-medium"
                >
                  <span>🗺️</span>
                  Kakao Map
                </a>
              </div>

              <div class="mt-3 p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <p class="text-xs text-blue-800 dark:text-blue-200 flex items-center gap-1.5">
                  <MapPin class="w-3.5 h-3.5 flex-shrink-0" />
                  <span><span class="font-semibold">Address:</span> 22 Multimedia hall M514, Soonchunhyang-ro, Sinchang-myeon, Asan-si, Chungcheongnam-do, Republic of Korea (31538)</span>
                </p>
              </div>
            </div>
          </div>

          <!-- How to Join -->
          <div class="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 p-8">
            <div class="absolute -bottom-6 -left-6 w-24 h-24 rounded-full bg-purple-500/10 blur-xl"></div>
            <div class="relative">
              <div class="inline-flex items-center mb-4">
                <UserPlus class="w-5 h-5 text-purple-600 dark:text-purple-400 mr-2" />
                <h3 class="text-xl font-bold text-gray-800 dark:text-white">How to Join</h3>
              </div>

              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                MCN Lab always provides the opportunity to intelligent and high passionate students from both domestic
                and foreign countries who are willing to pursue higher education including master's, Ph.D., and postdoctoral degrees.
              </p>

              <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
                If you are interested to work under the umbrella of MCN Lab research fields, you are welcome to
                send your resume and portfolio by the given contact information below.
              </p>

              <div class="mt-3 p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
                <h4 class="font-semibold text-purple-800 dark:text-purple-200 mb-1.5 text-sm">Qualifications</h4>
                <ul class="space-y-0.5 text-xs text-purple-700 dark:text-purple-300">
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Graduated in Computer Science, IT, Telecommunications, Electronic Engineering, or related fields</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Familiar with C++, Python, OOP programming</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Good contribution and communication skills</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Willing to learn new innovative things and dynamic personality</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Honest, strong commitment, and high responsibility</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Fluent in writing, listening, speaking English</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Willing to learn the Korean Language</span>
                  </li>
                  <li class="flex items-start">
                    <span class="mr-1.5">•</span>
                    <span>Be a good team player</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <!-- Call to Action -->
        <div class="text-center">
          <p class="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Join us in shaping the future of mobile computing and networking research at Soonchunhyang University.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button class="px-8 py-3 rounded-full bg-blue-500 text-white font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <Mail class="w-5 h-5" />
              Contact Lab
            </button>
            <button class="px-8 py-3 rounded-full border-2 border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white font-semibold hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 flex items-center gap-2">
              <GraduationCap class="w-5 h-5" />
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom decorative element -->
    <div class="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
      <div class="w-full h-full opacity-20 dark:opacity-10" :style="{ backgroundImage: `url('${patterns.pattern5}')` }"></div>
    </div>
  </section>
</template>

<style scoped>
/* Custom carousel slide transitions */
:deep(.el-carousel__item) {
  transition: transform 0.5s ease-in-out;
}

:deep(.el-carousel__mask) {
  border-radius: 24px;
}

:deep(.el-carousel__item) {
  border-radius: 24px;
}

/* Gradient text animations */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
}

/* Hover effects */
.group:hover .group-hover\:bg-gradient-animate {
  background-size: 200% 200%;
  animation: gradient-shift 2s ease infinite;
}

/* Smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .text-5xl {
    font-size: 2.5rem;
  }

  :deep(.el-carousel) {
    height: 300px !important;
  }

  .p-12 {
    padding: 2rem;
  }
}

@media (max-width: 640px) {
  .text-5xl {
    font-size: 2rem;
  }

  .grid-cols-2 {
    grid-template-columns: 1fr;
  }

  .p-10 {
    padding: 1.5rem;
  }
}
</style>
