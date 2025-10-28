import { createI18n } from 'vue-i18n'

const i18n = createI18n({
  locale: 'id', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: {
    id: {
      // add your id translations here
    },
    en: {
      // add your en translations here
    }
  }
})

export default i18n
