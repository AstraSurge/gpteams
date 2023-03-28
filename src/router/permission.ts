import type { Router } from 'vue-router'
import { useAuthStoreWithout } from '@/store'

export function setupPageGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStoreWithout()
    if (!to.meta.requiresAuth && !to.meta.requiresAdmin)
      return next()
    try {
      const token = authStore.token
      if (!token)
        return next({ name: 'SignIn' })

      if (to.meta.requiresAdmin && authStore.role !== 'admin')
        return next({ name: '403' })
      next()
    }
    catch (error) {
      next({ name: '500' })
    }
  })
}
