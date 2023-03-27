import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets, setupScrollbarStyle } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { firebaseApp } from './firebase'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupScrollbarStyle()

  setupStore(app)

  setupI18n(app)

  app.use(VueFire, {
    firebaseApp,
    modules: [
      // ... other modules
      VueFireAuth(),
    ],
  })

  await setupRouter(app)

  app.mount('#app')
}

bootstrap()
