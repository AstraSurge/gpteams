<script setup lang="ts">
import { ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { useMessage } from 'naive-ui'
import { HoverButton, SvgIcon } from '@/components/common'
import { t } from '@/locales'
import { useAuthStore } from '@/store'

const ms = useMessage()
const auth = useFirebaseAuth()
const isLogin = ref(false)
const authStore = useAuthStore()
auth?.onAuthStateChanged((user) => {
  if (user)
    isLogin.value = true
  else
    isLogin.value = false
})
async function handleLogout() {
  if (!auth)
    return ms.error(t('auth.pleaseTryAgainLater'))
  if (auth.currentUser) {
    await auth.signOut()
    authStore.removeToken()
    window.location.reload()
  }
}
</script>

<template>
  <HoverButton v-show="isLogin" :tooltip="$t('auth.logout')" @click="handleLogout">
    <span class="text-xl text-[#4f555e] dark:text-white">
      <SvgIcon icon="ri:logout-box-line" />
    </span>
  </HoverButton>
</template>
