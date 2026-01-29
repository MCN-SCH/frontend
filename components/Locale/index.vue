<template>
  <el-dropdown @command="changeLocale">
    <span class="el-dropdown-link">
      <img
        :src="currentFlag"
        alt="Language Flag"
        width="20"
        height="15"
        class="me-1"
      />
      {{ currentLabel }}
      <el-icon class="ms-1">
        <arrow-down />
      </el-icon>
    </span>

    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="en">
          <img :src="usFlag" alt="US Flag" width="20" height="15" class="me-1" />
          English
        </el-dropdown-item>
        <el-dropdown-item command="ko">
          <img :src="krFlag" alt="Korean Flag" width="20" height="15" class="me-1" />
          Korean
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCookies } from 'vue3-cookies'
import { ArrowDown } from '@element-plus/icons-vue'

// ✅ import assets
import usFlag from '@/assets/image/lang/us.svg'
import krFlag from '@/assets/image/lang/kr.svg'

const { locale } = useI18n()
const { cookies } = useCookies()

locale.value = 'en'

onMounted(() => {
  const storedLocale = cookies.get('locale')
  if (storedLocale) {
    locale.value = storedLocale
  }
})

const changeLocale = (lang) => {
  locale.value = lang
  cookies.set('locale', lang, { path: '/', expires: '7d' })
}

// UI helpers
const currentLabel = computed(() =>
  locale.value === 'ko' ? 'Korean' : 'English'
)

const currentFlag = computed(() =>
  locale.value === 'ko' ? krFlag : usFlag
)
</script>


<style scoped>
.el-dropdown-link {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
}

/* Remove hover / focus border on dropdown trigger */
.el-dropdown-link {
  outline: none !important;
  box-shadow: none !important;
  border: none !important;
}

/* When Element Plus applies focus-visible */
.el-dropdown:focus,
.el-dropdown:focus-visible,
.el-dropdown-link:focus,
.el-dropdown-link:focus-visible {
  outline: none !important;
  box-shadow: none !important;
}

</style>
