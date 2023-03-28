<script lang="ts" setup>
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { t } from '@/locales'
import Icon403 from '@/icons/403.vue'

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div class="flex h-full">
    <div class="px-4 m-auto space-y-4 text-center max-[400px]">
      <h1 class="text-4xl font-extrabold text-slate-800 dark:text-neutral-200">
        {{ t("auth.error401Title") }}
      </h1>
      <p class="text-base text-slate-500 dark:text-neutral-400">
        {{ t("auth.error401Content") }}
      </p>
      <div class="flex items-center justify-center text-center">
        <div class="w-[300px]">
          <Icon403 />
        </div>
      </div>
      <NButton type="primary" @click="goHome">
        {{ t("common.goToHomepage") }}
      </NButton>
    </div>
  </div>
</template>
