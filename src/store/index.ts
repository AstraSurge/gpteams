import type { App } from 'vue'
import { createPinia } from 'pinia'
import { useAuthStoreWithout } from './modules'

export const store = createPinia()

export async function setupStore(app: App) {
  const authStore = useAuthStoreWithout()
  await authStore.initializeAuthState()
  app.use(store)
}

export * from './modules'
