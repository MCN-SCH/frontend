<script setup>
import {
  ref,
  watch,
  computed,
  onMounted,
  onUnmounted
} from 'vue'

import { useRoute } from 'vue-router'
import {
  Menu,
  House,
  Coin,
  Setting,
  ArrowRight,
  SwitchButton,
  Document,
  Wallet,
  User,
  Clock
} from '@element-plus/icons-vue'

const route = useRoute()

const activeSubmenu = ref(null)

const deviceCookie = useCookie('device_id')

const deviceId = deviceCookie.value

const isOpen = ref(true)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { icon: House, label: 'Dashboard', to: `/portal/${deviceId}/` },
  // {
  //   icon: Wallet,
  //   label: 'Data',
  //   children: [
  //     {
  //       label: 'Active',
  //       to: `/portal/${deviceId}/data/active`
  //     },
  //     {
  //       label: 'History',
  //       to: `/portal/${deviceId}/data/history`
  //     }
  //   ]
  // },
  {
    icon: Document,
    label: 'Publication',
    to: `/portal/${deviceId}/publication`
  },
  {
    icon: User,
    label: 'Member Management',
    to: `/portal/${deviceId}/member-management`
  },
  {
    icon: Setting,
    label: 'Settings',
    to: `/portal/${deviceId}/settings`
  },
  {
    icon: SwitchButton,
    label: 'Logout',
    to: `/portal/${deviceId}/logout`
  }
]

watch(isOpen, (value) => {
  if (!value) {
    activeSubmenu.value = null
  }
})

const toggleSubmenu = (label) => {
  activeSubmenu.value =
    activeSubmenu.value === label ? null : label
}

const isActive = (path) => route.path === path

const isParentActive = (item) => {
  return item.children?.some(
    (child) => route.path === child.to
  )
}

const now = ref(new Date())

const formattedDate = computed(() => {
  const year = now.value.getFullYear()
  const month = String(
    now.value.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
    now.value.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
})
let timer = null

onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>

  <aside
    class="fixed md:relative top-0 left-0 z-50 h-screen bg-white border-r border-slate-200 shadow-lg transition-all duration-300 flex flex-col"
    :class="[
    isOpen ? 'md:w-64' : 'md:w-20',

    isMobileMenuOpen
      ? 'translate-x-0 w-64'
      : '-translate-x-full md:translate-x-0'
  ]"
  >
    <!-- Header -->
    <div
      class="h-16 border-b border-slate-200 flex items-center"
      :class="isOpen ? 'justify-between px-4' : 'justify-center'"
    >
      <div
        v-if="isOpen"
        class="flex items-center gap-3"
      >
        <div
          class="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center font-bold"
        >
          <div>
            <img
              src="@/assets/image/logo/mcn.svg"
              alt="MCN Lab Logo"
              class="h-8 sm:h-10 md:h-12 w-auto"
            />
          </div>
        </div>

        <div>
          <h1 class="font-bold text-slate-800">
            MCN
          </h1>
          <p class="text-xs text-slate-500">
            Admin Panel
          </p>
        </div>
      </div>

      <el-button
        :icon="Menu"
        circle
        @click="isOpen = !isOpen"
        class="!border-0"
      />
    </div>

    <!-- Menu -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="space-y-2 px-2">
        <li
          v-for="item in menuItems"
          :key="item.label"
        >
          <el-tooltip
            :content="item.label"
            placement="right"
            :disabled="isOpen"
          >
            <div
              class="group flex items-center rounded-xl cursor-pointer transition-all duration-200"
              :class="[
                isOpen
                  ? 'px-3 py-3'
                  : 'justify-center py-3',

                isActive(item.to) || isParentActive(item)
                  ? 'bg-primary-500 text-blue-600 font-medium'
                  : 'hover:bg-primary-50 text-slate-700'
              ]"
              @click="item.children ? toggleSubmenu(item.label) : navigateTo(item.to)"
            >
              <el-icon
                :size="20"
                :class="[
                  isOpen ? 'mr-3' : '',
                  isActive(item.to) || isParentActive(item)
                    ? 'text-white'
                    : 'text-slate-500'
                ]"
              >
                <component :is="item.icon" />
              </el-icon>

              <span
                v-if="isOpen"
                class="flex-1 text-sm font-medium"
              >
                {{ item.label }}
              </span>

              <el-icon
                v-if="item.children && isOpen"
                class="transition-transform duration-200"
                :class="{
                  'rotate-90': activeSubmenu === item.label
                }"
              >
                <ArrowRight />
              </el-icon>
            </div>
          </el-tooltip>

          <!-- Submenu -->
          <transition name="submenu">
            <ul
              v-if="
                isOpen &&
                item.children &&
                activeSubmenu === item.label
              "
              class="ml-11 mt-2 space-y-1"
            >
              <li
                v-for="child in item.children"
                :key="child.label"
                @click="navigateTo(child.to)"
                class="px-3 py-2 rounded-lg text-sm cursor-pointer transition-all"
                :class="
                  route.path === child.to
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'text-slate-600 hover:bg-slate-100'
                "
              >
                {{ child.label }}
              </li>
            </ul>
          </transition>
        </li>
      </ul>
    </nav>

    <div
      class="border-t border-slate-200 p-4"
      :class="isOpen ? '' : 'flex justify-center'"
    >
      <template v-if="isOpen">
        <div class="space-y-3">
          <div class="text-center">
            <p class="text-xs text-slate-500">
              {{ formattedDate }}
            </p>

            <p
              class="text-lg font-semibold text-primary-600"
            >
              {{ now.toLocaleTimeString() }}
            </p>
          </div>
        </div>
      </template>

      <template v-else>
        <el-tooltip
          :content="`${formattedDate} ${now.toLocaleTimeString()}`"
          placement="right"
        >
          <el-icon
            :size="18"
            class="text-orange-500"
          >
            <Clock />
          </el-icon>
        </el-tooltip>
      </template>
    </div>
  </aside>

  <div
    v-if="isMobileMenuOpen"
    class="fixed inset-0 bg-black/40 z-40 md:hidden"
    @click="isMobileMenuOpen = false"
  />
  <el-button
    v-if="!isMobileMenuOpen"
    class="fixed top-4 left-4 z-100 md:hidden"
    :icon="Menu"
    circle
    @click="isMobileMenuOpen = true"
  />
</template>

<style scoped>
.submenu-enter-active,
.submenu-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.submenu-enter-from,
.submenu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.submenu-enter-to,
.submenu-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>
