<script setup lang="ts">
import { NButton, NH2, NInput, NP, NSpin, useMessage } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'
import TagsInput from './TagsInput.vue'
import { t } from '@/locales'
import { useAdminStore } from '@/store'

const localBlacklist = ref<string[]>([])
const localWhitelist = ref<string[]>([])
const openaiApiKey = ref('')

const ms = useMessage()

const { systemSettings, updateSystemSettings, loadSystemSettings } = useAdminStore()

async function handleSaveBlacklist() {
  try {
    await updateSystemSettings({
      blacklist: localBlacklist.value,
    })
  }
  catch (e) {
    ms.error(t('auth.pleaseTryAgainLater'))
  }
}

async function handleSaveWhitelist() {
  try {
    await updateSystemSettings({
      whitelist: localWhitelist.value,
    })
  }
  catch (e) {
    ms.error(t('auth.pleaseTryAgainLater'))
  }
}

async function handleSaveOpenaiApiKey() {
  try {
    await updateSystemSettings({
      openaiApiKeys: [openaiApiKey.value],
    })
    openaiApiKey.value = ''
  }
  catch (e) {
    ms.error(t('auth.pleaseTryAgainLater'))
  }
}

watch(systemSettings.data, () => {
  localBlacklist.value = systemSettings.data.blacklist || []
  localWhitelist.value = systemSettings.data.whitelist || []
})

onMounted(async () => {
  await loadSystemSettings()
  localBlacklist.value = systemSettings.data.blacklist || []
  localWhitelist.value = systemSettings.data.whitelist || []
})
</script>

<template>
  <div v-if="systemSettings.loading" class="flex justify-center items-center h-screen">
    <NSpin :size="120" />
  </div>
  <div v-else class="flex flex-col gap-12 p-12">
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700">
        {{ t("admin.configureBlacklist") }}
      </NH2>
      <NP>
        {{ t("admin.configureBlacklistTips") }}
      </NP>
      <div class="flex flex-nowrap gap-2">
        <TagsInput v-model:value="localBlacklist" />
        <NButton
          class="w-32"
          type="info"
          @click="handleSaveBlacklist"
        >
          {{ t("admin.update") }}
        </NButton>
      </div>
    </div>
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700">
        {{ t("admin.configureWhitelist") }}
      </NH2>
      <NP>
        {{ t("admin.configureWhitelistTips") }}
      </NP>
      <div class="flex flex-nowrap gap-2">
        <TagsInput v-model:value="localWhitelist" />
        <NButton
          class="w-32"
          type="info"
          @click="handleSaveWhitelist"
        >
          {{ t("admin.update") }}
        </NButton>
      </div>
    </div>
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700">
        {{ t("admin.configureOpenaiApiKey") }}
      </NH2>
      <NP>
        {{ t("admin.configureOpenaiApiKeyTips") }}
      </NP>
      <div class="flex flex-nowrap gap-2">
        <NInput
          v-model:value="openaiApiKey"
          type="password"
          class="max-w-2xl w-full"
        />
        <NButton
          class="w-32"
          type="error"
          @click="handleSaveOpenaiApiKey"
        >
          {{ t("admin.update") }}
        </NButton>
      </div>
    </div>
  </div>
</template>
