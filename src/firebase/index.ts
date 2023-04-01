import { initializeApp } from 'firebase/app'
import type { App } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import { getFirebaseConfig } from '@/api'
// ... other firebase imports

export const initialFirebaseApp = async () => {
  const data = await getFirebaseConfig()
  return initializeApp(data)
}

export const setupFirebase = async (app: App) => {
  const firebaseApp = await initialFirebaseApp()
  app.use(VueFire, {
    firebaseApp,
    modules: [
      // ... other modules
      VueFireAuth(),
    ],
  })
}
