<script setup lang='ts'>
import { defineAsyncComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import LogoutButton from './LogoutButton.vue'
import { HoverButton, SvgIcon, UserAvatar } from '@/components/common'
import { t } from '@/locales'
import { useAuthStore } from '@/store'
import { ADMIN_ROUTE } from '@/constants/routes'

const { role } = useAuthStore()
const router = useRouter()

const UserCenter = defineAsyncComponent(() => import('@/components/common/UserCenter/index.vue'))

const show = ref(false)
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t dark:border-neutral-800">
    <div class="flex-1 flex-shrink-0 overflow-hidden">
      <UserAvatar />
    </div>
    <div class="flex">
      <HoverButton v-if="role === 'admin'" :tooltip="t('setting.adminCenter')" @click="router.push(ADMIN_ROUTE)">
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:settings-4-line" />
        </span>
      </HoverButton>
      <HoverButton :tooltip="t('setting.userCenter')" @click="show = true">
        <span class="text-xl text-[#4f555e] dark:text-white">
          <SvgIcon icon="ri:user-line" />
        </span>
      </HoverButton>
      <LogoutButton />
    </div>

    <UserCenter v-if="show" v-model:visible="show" />
  </footer>
</template>
