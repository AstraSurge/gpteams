<script setup lang='ts'>
import { NButton, NCheckbox, NDivider, NModal, NSpace, NText, useMessage } from 'naive-ui'
import { useFirebaseAuth } from 'vuefire'
import { ref, watch } from 'vue'
import { browserLocalPersistence, browserSessionPersistence } from '@firebase/auth'
import PhoneSignIn from './PhoneSignIn/index.vue'
import GoogleSignInButton from './GoogleSignInButton.vue'
import EmailSignIn from './EmailSignIn.vue'
import { fetchVerify } from '@/api'
import { useAppStore, useAuthStore } from '@/store'
import { t } from '@/locales'

interface Props {
  visible: boolean
}

defineProps<Props>()

const isUsingEmail = ref(false)
const rememberMe = ref(false)

const appName = import.meta.env.VITE_APP_NAME

const { language } = useAppStore()

const authStore = useAuthStore()

const ms = useMessage()

const auth = useFirebaseAuth()
if (auth)
  auth.languageCode = language

watch(() => rememberMe.value, (newRememberMe) => {
  if (auth)
    auth.setPersistence(newRememberMe ? browserLocalPersistence : browserSessionPersistence)
})

async function verifyToken(token: string) {
  try {
    await fetchVerify(token)
    authStore.setToken(token)
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
  }
}
</script>

<template>
  <NModal :show="visible" class="w-11/12 max-w-xl">
    <div class="px-4 py-12 bg-white rounded dark:bg-slate-800">
      <header class="mb-8">
        <p class="text-2xl md:text-3xl text-center font-extrabold text-slate-700 dark:text-slate-100">
          {{ t('auth.signInTo') }}
          <NText type="primary">
            {{ appName }}
          </NText>
        </p>
      </header>
      <NSpace vertical size="large" class="m-auto max-w-md">
        <GoogleSignInButton :on-success="verifyToken" />
        <NDivider class="my-2">
          <span class="text-slate-600 dark:text-slate-200 font-semibold">
            {{ t("auth.or") }}
          </span>
        </NDivider>
        <PhoneSignIn v-if="!isUsingEmail" :on-success="verifyToken" />
        <EmailSignIn v-else />
        <div class="w-full flex justify-between">
          <NCheckbox :checked="rememberMe" @update:checked="rememberMe = $event">
            {{ t('auth.rememberMe') }}
          </NCheckbox>
          <NButton text type="primary" @click="isUsingEmail = !isUsingEmail">
            {{ isUsingEmail ? t('auth.signInWithPhone') : t('auth.signInWithEmail') }}
          </NButton>
        </div>
      </NSpace>
    </div>
  </NModal>
</template>
