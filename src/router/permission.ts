import type { Router } from 'vue-router'
import { getCurrentUser } from 'vuefire'
import { useAuthStoreWithout } from '@/store'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    if (!to.meta.requiresAuth)
      return next()
    try {
      const currentUser = await getCurrentUser()
      if (!currentUser) {
        authStore.removeToken()
        return next({ name: 'SignIn' })
      }
      if (!authStore.token) {
        const token = await currentUser.getIdToken()
        authStore.setToken(token)
      }
      next()
    }
    catch (error) {
      next({ name: '500' })
    }
  })
}
