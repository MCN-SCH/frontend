<template>
  <div class="lang-switch">
    <img
      :src="currentFlag"
      alt="Language Flag"
      width="20"
      height="15"
      class="me-2"
    />

    <el-switch
      v-model="isKorean"
      active-text="한국"
      inactive-text="EN"
      inline-prompt
      @change="changeLocale"
    />
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCookies } from 'vue3-cookies'

// flags
import usFlag from '@/assets/image/lang/us.svg'
import krFlag from '@/assets/image/lang/kr.svg'

const { locale } = useI18n()
const { cookies } = useCookies()

const isKorean = ref(false)

// init locale
onMounted(() => {
  const storedLocale = cookies.get('locale') || 'ko'
  locale.value = storedLocale
  isKorean.value = storedLocale === 'ko'
})

// switch handler
const changeLocale = (value) => {
  const lang = value ? 'ko' : 'en'
  locale.value = lang
  cookies.set('locale', lang, { path: '/', expires: '7d' })
}

// UI helpers
const currentFlag = computed(() =>
  isKorean.value ? krFlag : usFlag
)
</script>

<style scoped>
.lang-switch {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
