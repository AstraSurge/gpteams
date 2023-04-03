<script setup lang="ts">
import { useFirebaseAuth } from 'vuefire'
import { useMessage } from 'naive-ui'
import { HoverButton, SvgIcon } from '@/components/common'
import { t } from '@/locales'
import { useAuthStore } from '@/store'
import { router } from '@/router'

const ms = useMessage()
const auth = useFirebaseAuth()
const authStore = useAuthStore()
async function handleLogout() {
  if (!auth)
    return ms.error(t('auth.pleaseTryAgainLater'))
  if (auth.currentUser) {
    await auth.signOut()
    authStore.removeToken()
  }
  router.replace('/sign-in')
}
</script>

<template>
  <HoverButton :tooltip="$t('auth.logout')" @click="handleLogout">
    <span class="text-xl text-[#4f555e] dark:text-white">
      <SvgIcon icon="ri:logout-circle-r-line" />
    </span>
  </HoverButton>
</template>
