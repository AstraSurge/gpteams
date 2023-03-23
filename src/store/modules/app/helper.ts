import { ss } from '@/utils/storage'
import type { UnionToSet } from '@/utils/utilityType'

const LOCAL_NAME = 'appSetting'

export type Theme = 'light' | 'dark' | 'auto'

export type Language = 'zh-CN' | 'zh-TW' | 'en'

export interface AppState {
  siderCollapsed: boolean
  theme: Theme
  language: Language
}

export function defaultSetting(): AppState {
  const supportLanguages: UnionToSet<Language> = ['zh-CN', 'en', 'zh-TW']
  const defaultLanguage = supportLanguages.find(lang => navigator.language.startsWith(lang)) || 'en'
  return { siderCollapsed: false, theme: 'light', language: defaultLanguage }
}

export function getLocalSetting(): AppState {
  const localSetting: AppState | undefined = ss.get(LOCAL_NAME)
  return { ...defaultSetting(), ...localSetting }
}

export function setLocalSetting(setting: AppState): void {
  ss.set(LOCAL_NAME, setting)
}
