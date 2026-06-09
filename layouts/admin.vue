<template>
  <div class="app-container">
    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="loading-content">
        <img
          class="loading-gif"
          src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExczlodmc1azdsMWoxN29xOTBtY3pqampvMTlhYWk0NjlhbmwwNmljMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZLSlxoLbVvdrSFz599/giphy.gif"
          alt="Loading..."
        />
        <p class="loading-text">Loading...</p>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="app-layout">
      <div class="sidebar-fixed">
        <SideBarAdmin />
      </div>

      <main class="main-content">
        <div class="content-wrapper">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: ['authenticated'],
})

const loading = ref(true)
const { value: user } = useCookie('user')

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style scoped>
/* Reset default margins and prevent body scroll */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Prevent double scrollbars on body */
html, body {
  overflow: hidden;
  height: 100%;
}

.app-container {
  height: 100vh;
  overflow: hidden;
}

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.95);
  z-index: 9999;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-gif {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.loading-text {
  font-size: 1.2rem;
  color: #333;
  font-weight: 500;
}

/* Main Layout - Fixed Sidebar + Scrollable Main Content */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* Fixed Sidebar - DOES NOT SCROLL */
.sidebar-fixed {
  position: relative;
  flex-shrink: 0;
  width: 260px;
  height: 100vh;
  overflow-y: auto; /* Sidebar can scroll internally if its content is too long */
  overflow-x: hidden;
  background-color: #fff;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
  z-index: 100;
}

/* Scrollable Main Content - ONLY THIS SCROLLS */
.main-content {
  flex: 1;
  height: 100vh;
  overflow-y: auto;
  overflow-x: auto;
  background-color: #f5f7fa;
}

/* Content Wrapper */
.content-wrapper {
  padding: 2rem;
  min-height: 100%;
}

/* Optional: Custom scrollbar for main content */
.main-content::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.main-content::-webkit-scrollbar-track {
  background: #e4e4e4;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.main-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Optional: Custom scrollbar for sidebar if needed */
.sidebar-fixed::-webkit-scrollbar {
  width: 6px;
}

.sidebar-fixed::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.sidebar-fixed::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 3px;
}

.sidebar-fixed::-webkit-scrollbar-thumb:hover {
  background: #ccc;
}

/* Responsive Design */
@media (max-width: 768px) {
  .sidebar-fixed {
    width: 220px;
  }
}

@media (max-width: 640px) {
  .sidebar-fixed {
    position: fixed;
    left: 0;
    top: 0;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
  }

  .sidebar-fixed.mobile-open {
    transform: translateX(0);
  }

  .main-content {
    width: 100%;
  }

  .content-wrapper {
    padding: 1rem;
  }
}
</style>
