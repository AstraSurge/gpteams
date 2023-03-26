<script setup lang='ts'>
import { NButton, NLayout, NLayoutContent, NLayoutSider, NMenu, NText } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { h, ref } from 'vue'
import { useRouter } from 'vue-router'
import { SvgIcon } from '@/components/common'
import { t } from '@/locales'

const collapsed = ref(false)

const router = useRouter()

const menuOptions: MenuOption[] = [
  {
    label: t('admin.userManagement'),
    key: '/admin/user-management',
    icon: () => h(SvgIcon, { icon: 'ri:user-line' }),
  },
  {
    label: t('admin.systemSettings'),
    key: '/admin/system-settings',
    icon: () => h(SvgIcon, { icon: 'ri:settings-3-line' }),
  },
]

const appName = import.meta.env.VITE_APP_NAME as string
</script>

<template>
  <NLayout has-sider class="h-screen">
    <NLayoutSider
      collapse-mode="width"
      :collapsed-width="64"
      :width="240"
      show-trigger="arrow-circle"
      bordered
      :content-style="collapsed ? 'padding: 12px 0;' : 'padding: 12px;'"
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="h-40 flex items-center justify-center">
        <NText type="primary" class="text-3xl font-extrabold">
          {{ collapsed ? appName[0] : appName }}
        </NText>
      </div>
      <NMenu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="router.currentRoute.value.path"
        :on-update-value="value => router.push(value)"
      />
      <NButton
        block
        type="primary"
        class="absolute bottom-8 left-4 right-4"
        text
        @click="() => router.push('/')"
      >
        {{ t("common.goToHomepage") }}
      </NButton>
    </NLayoutSider>
    <NLayoutContent content-style="padding: 24px;" :native-scrollbar="false">
      <RouterView v-slot="{ Component, route }">
        <Component :is="Component" :key="route.fullPath" />
      </RouterView>
    </NLayoutContent>
  </NLayout>
</template>
