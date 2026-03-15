<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const techCanvas = ref(null)

/* ---------------- PARTICLE TEXTURE ---------------- */

const createKoreanTechTexture = () => {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size

  const ctx = canvas.getContext('2d')

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2
  )

  gradient.addColorStop(0, 'rgba(120,170,255,1)')
  gradient.addColorStop(0.4, 'rgba(63,123,189,0.8)')
  gradient.addColorStop(0.7, 'rgba(63,123,189,0.4)')
  gradient.addColorStop(1, 'rgba(63,123,189,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  return new THREE.CanvasTexture(canvas)
}

/* ---------------- NETWORK BACKGROUND ---------------- */

const initNetworkBackground = () => {

  if (!techCanvas.value) return

  const scene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )

  camera.position.z = 140

  const renderer = new THREE.WebGLRenderer({
    canvas: techCanvas.value,
    alpha: true,
    antialias: true
  })

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  /* ---------- PARTICLES ---------- */

  const PARTICLE_COUNT = 220
  const AREA = 160

  const geometry = new THREE.BufferGeometry()

  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const velocities = []

  for (let i = 0; i < PARTICLE_COUNT; i++) {

    positions[i * 3] = (Math.random() - 0.5) * AREA
    positions[i * 3 + 1] = (Math.random() - 0.5) * AREA
    positions[i * 3 + 2] = (Math.random() - 0.5) * AREA

    velocities.push({
      x: (Math.random() - 0.5) * 0.08,
      y: (Math.random() - 0.5) * 0.08,
      z: (Math.random() - 0.5) * 0.08
    })
  }

  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )

  const particleTexture = createKoreanTechTexture()

  const material = new THREE.PointsMaterial({
    size: 6,
    map: particleTexture,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  })

  const particles = new THREE.Points(geometry, material)
  scene.add(particles)

  /* ---------- NETWORK LINES ---------- */

  const MAX_DISTANCE = 28

  const linePositions = new Float32Array(PARTICLE_COUNT * PARTICLE_COUNT * 3)

  const lineGeometry = new THREE.BufferGeometry()

  lineGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
  )

  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x6ba6ff,
    transparent: true,
    opacity: 0.2
  })

  const lines = new THREE.LineSegments(lineGeometry, lineMaterial)
  scene.add(lines)

  /* ---------- ANIMATION ---------- */

  const animate = () => {

    requestAnimationFrame(animate)

    const pos = geometry.attributes.position.array
    const linePos = lines.geometry.attributes.position.array

    let vertex = 0
    let connections = 0

    /* move particles */

    for (let i = 0; i < PARTICLE_COUNT; i++) {

      pos[i * 3] += velocities[i].x
      pos[i * 3 + 1] += velocities[i].y
      pos[i * 3 + 2] += velocities[i].z

      if (pos[i * 3] > AREA / 2 || pos[i * 3] < -AREA / 2) velocities[i].x *= -1
      if (pos[i * 3 + 1] > AREA / 2 || pos[i * 3 + 1] < -AREA / 2) velocities[i].y *= -1
      if (pos[i * 3 + 2] > AREA / 2 || pos[i * 3 + 2] < -AREA / 2) velocities[i].z *= -1
    }

    /* network connections */

    for (let i = 0; i < PARTICLE_COUNT; i++) {

      for (let j = i + 1; j < PARTICLE_COUNT; j++) {

        const dx = pos[i * 3] - pos[j * 3]
        const dy = pos[i * 3 + 1] - pos[j * 3 + 1]
        const dz = pos[i * 3 + 2] - pos[j * 3 + 2]

        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz)

        if (dist < MAX_DISTANCE) {

          linePos[vertex++] = pos[i * 3]
          linePos[vertex++] = pos[i * 3 + 1]
          linePos[vertex++] = pos[i * 3 + 2]

          linePos[vertex++] = pos[j * 3]
          linePos[vertex++] = pos[j * 3 + 1]
          linePos[vertex++] = pos[j * 3 + 2]

          connections++
        }
      }
    }

    lines.geometry.setDrawRange(0, connections * 2)

    geometry.attributes.position.needsUpdate = true
    lines.geometry.attributes.position.needsUpdate = true

    renderer.render(scene, camera)
  }

  animate()

  /* ---------- RESPONSIVE ---------- */

  window.addEventListener('resize', () => {

    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

  })
}

/* ---------------- MOUNT ---------------- */

onMounted(() => {

  gsap.registerPlugin(ScrollTrigger)

  initNetworkBackground()

})
</script>
<template>
  <div class="min-h-screen text-gray-900 overflow-x-hidden transition-colors duration-300 dark:bg-gray-900 dark:text-white">
    <div class="tech-background">
      <canvas ref="techCanvas"></canvas>
    </div>

    <!-- Navigation -->
    <NavBar
      :dark-mode="darkMode"
      :current-language="currentLanguage"
      @toggle-dark-mode="toggleDarkMode"
      @toggle-language="toggleLanguage"
      @scroll-to="scrollToSection"
      @toggle-menu="isMenuOpen = !isMenuOpen"
    >
      <template #mobileMenu>
        <button @click="scrollToSection('about')" class="block w-full text-left py-2 dark:text-gray-300">About</button>
        <button @click="scrollToSection('research')" class="block w-full text-left py-2 dark:text-gray-300">Research</button>
        <button @click="scrollToSection('people')" class="block w-full text-left py-2 dark:text-gray-300">People</button>
        <button @click="scrollToSection('publications')" class="block w-full text-left py-2 dark:text-gray-300">Publications</button>
        <button @click="scrollToSection('projects')" class="block w-full text-left py-2 dark:text-gray-300">Projects</button>
        <button @click="scrollToSection('facilities')" class="block w-full text-left py-2 dark:text-gray-300">Facilities</button>
        <button @click="scrollToSection('contact')" class="block w-full text-left py-2 dark:text-gray-300">Contact</button>
      </template>
    </NavBar>

    <!-- Hero Section -->
    <HomeSectionsHero @scroll-to="scrollToSection" />

    <!-- About Section -->
    <HomeSectionsAbout />

    <!-- Research Areas -->
    <HomeSectionsResearchAreas :research-areas="researchAreas" />

    <!-- Stats Section -->
    <HomeSectionsStats :achievements="achievements" />

    <!-- People Section -->
    <HomeSectionsPeople :lab-members="labMembers" />

    <!-- Publications -->
    <HomeSectionsPublications
      :publications="recentPublications"
      @open-bibtex="openBibtex"
    />

    <!-- Projects -->
    <HomeSectionsProjects :projects="currentProjects" />

    <!-- Facilities -->
    <HomeSectionsFacilities :facilities="facilities" />

    <!-- News & Events -->
    <HomeSectionsNewsEvents
      :news="newsUpdates"
      :events="upcomingEvents"
    />

    <!-- Contact -->
    <HomeSectionsContact />

    <!-- Footer -->
    <HomeLayoutFooter />

    <!-- Scroll to Top -->
    <!-- Scroll to Top Button -->
    <button @click="scrollToTop"
            :class="[
              'fixed right-6 bottom-6 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center',
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
            ]">
      <ChevronUp class="w-6 h-6" />
    </button>

    <!-- BibTeX Modal -->
    <div v-if="showBibtex" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6 backdrop-blur-sm">
      <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white">BibTeX Citation</h3>
            <p class="text-sm text-gray-600 dark:text-gray-300 mt-1">{{ activePub?.title }}</p>
          </div>
          <button @click="showBibtex = false" class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center">
            ✕
          </button>
        </div>
        <div class="p-6 overflow-auto">
          <pre class="bg-gray-900 text-gray-100 p-6 rounded-lg text-sm overflow-x-auto">{{ activePub?.bibtex || '@article{sample,\n  title={Sample Paper},\n  author={Author},\n  year=2024\n}' }}</pre>
          <div class="mt-4 flex justify-end">
            <button @click="navigator.clipboard.writeText(activePub?.bibtex || '')"
                    class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm">
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
section {
  scroll-margin-top: 80px;
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 5px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3F7BBD, #6B9BD2);
  border-radius: 5px;
  border: 2px solid #f1f1f1;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2C5A8A, #3F7BBD);
}

.dark ::-webkit-scrollbar-track {
  background: #2D3748;
}

.dark ::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, #3F7BBD, #6B9BD2);
  border: 2px solid #2D3748;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, #2C5A8A, #3F7BBD);
}

.tech-background {
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
}

.tech-background canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
