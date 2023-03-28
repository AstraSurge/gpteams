<script setup lang='ts'>
import { NAvatar } from 'naive-ui'
import { useCurrentUser } from 'vuefire'
import { isString } from '@/utils/is'

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
        />
      </template>
      <template v-else>
        <NAvatar size="large" round />
      </template>
    </div>
    <div class="flex-1 min-w-0 ml-2">
      <h2 class="overflow-hidden font-bold text-md text-ellipsis whitespace-nowrap">
        {{ user?.displayName }}
      </h2>
    </div>
  </div>
</template>
