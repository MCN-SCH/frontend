import { createI18n } from 'vue-i18n'
import en from '../locales/en'
import ko from '../locales/ko'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'en', // default locale
    fallbackLocale: 'en', // fallback locale
    messages: {
      en,
      ko
    }
  })
  vueApp.use(i18n)
})
