import { defineStore } from 'pinia'
import { getCurrentUser } from 'vuefire'
import { store } from '@/store'
import { verifyIdToken } from '@/api'
export interface AuthState {
  token?: string
  role?: string
}

export const useAuthStore = defineStore('auth-store', {
  state: (): AuthState => ({
    token: undefined,
    role: undefined,
  }),

  actions: {
    setToken(token: string) {
      this.token = token
    },

    async initializeAuthState() {
      try {
        const user = await getCurrentUser()
        if (!user)
          throw Error
        const token = await user.getIdToken()
        const resp = await verifyIdToken(token)
        this.token = token
        this.role = resp.data.role
      }
      catch {
        this.token = undefined
        this.role = undefined
      }
    },

    removeToken() {
      this.token = undefined
      this.role = undefined
    },

    setAuthState({ token, role }: AuthState) {
      this.token = token
      this.role = role
    },

  },
})

export function useAuthStoreWithout() {
  return useAuthStore(store)
}
