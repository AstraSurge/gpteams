<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import { useCurrentUser } from 'vuefire'
import { isString } from '@/utils/is'
import { t } from '@/locales'

const user = useCurrentUser()
</script>

<template>
  <div class="flex items-center overflow-hidden">
    <div class="w-10 h-10 overflow-hidden rounded-full shrink-0">
      <template v-if="isString(user?.photoURL)">
        <NAvatar
          size="large"
          round
          :src="user?.photoURL"
          :img-props="{ alt: t('common.avatarAlt', { name: user?.displayName }) }"
        />
      </template>
      <template v-else>
        <NAvatar size="large" round :img-props="{ alt: t('common.avatarAlt', { name: user?.displayName }) }" />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ user?.displayName }}
      </h2>
    </div>
  </div>
</template>
