import { defineStore } from 'pinia'
import type { SystemSettings, User } from '@/api'
import { deleteUser, disableUser, enableUser, fetchSystemSettings, fetchUsers, updateSystemSettings } from '@/api'

export const useAdminStore = defineStore('admin-store', {
  state: (): {
    users: {
      data: User[]
      loading: boolean
    }
    systemSettings: {
      data: SystemSettings
      loading: boolean
    }
  } => ({
    users: {
      data: [],
      loading: false,
    },
    systemSettings: {
      data: {},
      loading: false,
    },
  }),
  actions: {
    async loadUsers() {
      try {
        this.users.loading = true
        const { data } = await fetchUsers()
        this.users.data = data
      }
      catch (e) {
        console.error(e)
      }
      finally {
        this.users.loading = false
      }
    },

    async disableUser(uid: string) {
      try {
        this.users.loading = true
        await disableUser(uid)
        this.loadUsers()
      }
      catch (e) {
        console.error(e)
      }
      finally {
        this.users.loading = false
      }
    },
    async enableUser(uid: string) {
      try {
        this.users.loading = true
        await enableUser(uid)
        this.loadUsers()
      }
      catch (e) {
        console.error(e)
      }
      finally {
        this.users.loading = false
      }
    },
    async deleteUser(uid: string) {
      try {
        this.users.loading = true
        await deleteUser(uid)
        this.loadUsers()
      }
      catch (e) {
        console.error(e)
        throw e
      }
      finally {
        this.users.loading = false
      }
    },

    async loadSystemSettings() {
      try {
        this.systemSettings.loading = true
        const { data } = await fetchSystemSettings()
        this.systemSettings.data = data
      }
      catch (e) {
        console.error(e)
        throw e
      }
      finally {
        this.systemSettings.loading = false
      }
    },

    async updateSystemSettings(data: SystemSettings) {
      try {
        this.systemSettings.loading = true
        await updateSystemSettings(data)
        this.loadSystemSettings()
      }
      catch (e) {
        console.error(e)
        throw e
      }
      finally {
        this.systemSettings.loading = false
      }
    },

  },
},
)
