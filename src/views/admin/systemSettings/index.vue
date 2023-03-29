<script setup lang="ts">
import { NButton, NH2, NInput, NInputGroup, NP, NSelect, NSpin, useMessage } from 'naive-ui'
import { onMounted, ref, watch } from 'vue'
import TagsInput from './TagsInput.vue'
import { t } from '@/locales'
import { useAdminStore } from '@/store'

const localBlacklist = ref<string[]>([])
const localWhitelist = ref<string[]>([])
const openaiApiKey = ref('')
const chatgptModel = ref('')

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

async function handleSaveChatgptModel() {
  try {
    await updateSystemSettings({
      chatgptModel: [chatgptModel.value],
    })
  }
  catch (e) {
    ms.error(t('auth.pleaseTryAgainLater'))
  }
}

const chatgptModelOptions = [
  {
    label: 'GPT-3.5-turbo',
    value: 'gpt-3.5-turbo',
  },
  {
    label: 'GPT-4',
    value: 'gpt-4',
  },
]

watch(systemSettings.data, (data) => {
  localBlacklist.value = data.blacklist || []
  localWhitelist.value = data.whitelist || []
  chatgptModel.value = data.chatgptModel?.[0] || 'gpt-3.5-turbo'
})

onMounted(async () => {
  await loadSystemSettings()
  localBlacklist.value = systemSettings.data.blacklist || []
  localWhitelist.value = systemSettings.data.whitelist || []
  chatgptModel.value = systemSettings.data.chatgptModel?.[0] || 'gpt-3.5-turbo'
})
</script>

<template>
  <div v-if="systemSettings.loading" class="flex justify-center items-center h-screen">
    <NSpin :size="120" />
  </div>
  <div v-else class="flex flex-col gap-12 p-12">
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700 dark:text-slate-200">
        {{ t("admin.configureBlacklist") }}
      </NH2>
      <NP>
        {{ t("admin.configureBlacklistTips") }}
      </NP>
      <NInputGroup>
        <TagsInput v-model:value="localBlacklist" />
        <NButton
          class="w-32"
          type="primary"
          @click="handleSaveBlacklist"
        >
          {{ t("admin.update") }}
        </NButton>
      </NInputGroup>
    </div>
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700 dark:text-slate-200">
        {{ t("admin.configureWhitelist") }}
      </NH2>
      <NP>
        {{ t("admin.configureWhitelistTips") }}
      </NP>
      <NInputGroup>
        <TagsInput v-model:value="localWhitelist" />
        <NButton
          class="w-32"
          type="primary"
          @click="handleSaveWhitelist"
        >
          {{ t("admin.update") }}
        </NButton>
      </NInputGroup>
    </div>
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700 dark:text-slate-200">
        {{ t("admin.configureOpenaiApiKey") }}
      </NH2>
      <NP>
        {{ t("admin.configureOpenaiApiKeyTips") }}
      </NP>
      <NInputGroup>
        <NInput
          v-model:value="openaiApiKey"
          type="password"
          class="max-w-2xl"
        />
        <NButton
          class="w-32"
          type="error"
          @click="handleSaveOpenaiApiKey"
        >
          {{ t("admin.update") }}
        </NButton>
      </NInputGroup>
    </div>
    <div>
      <NH2 prefix="bar" class="text-2xl font-bold text-slate-700 dark:text-slate-200">
        {{ t("admin.configureChatgptModel") }}
      </NH2>
      <NInputGroup>
        <NSelect
          v-model:value="chatgptModel"
          :options="chatgptModelOptions"
          class="max-w-2xl"
        />
        <NButton
          type="primary"
          class="w-32"
          @click="handleSaveChatgptModel"
        >
          {{ t("admin.update") }}
        </NButton>
      </NInputGroup>
    </div>
  </div>
</template>
