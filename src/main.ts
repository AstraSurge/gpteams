import { createApp } from 'vue'
import { VueFire, VueFireAuth } from 'vuefire'
import App from './App.vue'
import { setupI18n } from './locales'
import { setupAssets } from './plugins'
import { setupStore } from './store'
import { setupRouter } from './router'
import { firebaseApp } from './firebase'

async function bootstrap() {
  const app = createApp(App)
  setupAssets()

  setupStore(app)

  setupI18n(app)

  await setupRouter(app)

  app.use(VueFire, {
    firebaseApp,
    modules: [
      // ... other modules
      VueFireAuth(),
    ],
  })

  app.mount('#app')
}

bootstrap()
