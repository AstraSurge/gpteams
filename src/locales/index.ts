import type { App } from 'vue'
import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import zhTW from './zh-TW'
import en from './en'
import type { Language } from '@/store/modules/app/helper'

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  allowComposition: true,
  messages: {
    'en': en,
    'zh-CN': zhCN,
    'zh-TW': zhTW,
  },
})

export const t = i18n.global.t

export function setLocale(locale: Language) {
  i18n.global.locale = locale
}

export function setupI18n(app: App) {
  app.use(i18n)
}

export default i18n
