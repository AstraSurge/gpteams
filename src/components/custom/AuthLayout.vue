<script lang="ts" setup>
import { NText } from 'naive-ui'

const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <main class="w-screen h-screen flex items-center justify-center gap-8 dark:bg-slate-900">
    <div class="h-screen flex-1 flex flex-col items-center py-16 px-4">
      <NText type="primary" class="text-3xl md:text-4xl font-extrabold">
        {{ appName }}
      </NText>
      <div class="flex flex-col flex-1 w-full justify-center items-center">
        <slot />
      </div>
    </div>
    <div class="hidden  lg:block h-screen flex-1 bg-sign-in-background dark:bg-sign-in-background-dark" />
  </main>
</template>
