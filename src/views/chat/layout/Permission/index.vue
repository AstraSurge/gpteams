<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NInputGroup, NModal, NSpace, NText, useMessage } from 'naive-ui'
import { useFirebaseAuth } from 'vuefire'
import type { RecaptchaVerifier } from '@firebase/auth'
import { signInWithPhoneNumber } from '@firebase/auth'
import { phone } from 'phone'
import PhoneInput from './PhoneInput.vue'
import RecaptchaButton from './RecaptchaButton.vue'
import { fetchVerify } from '@/api'
import { useAppStore, useAuthStore } from '@/store'
import { t } from '@/locales'

interface Props {
  visible: boolean
}

defineProps<Props>()

const appName = import.meta.env.VITE_APP_NAME

const { language } = useAppStore()

const authStore = useAuthStore()

const ms = useMessage()

const submitLoading = ref(false)

const verificationCode = ref('')
const phoneNumber = ref('')
const confirmationResult = ref()
const submitDisabled = computed(() => !phoneNumber.value || !verificationCode.value.trim() || submitLoading.value)
const sendCodeDisabled = computed(() => !phoneNumber.value || submitLoading.value || !phone(phoneNumber.value).isValid)

const auth = useFirebaseAuth()
if (auth)
  auth.languageCode = language

async function sendVerifyCode(verifier: RecaptchaVerifier) {
  if (!auth) {
    ms.error(t('auth.pleaseTryAgainLater'))
    return
  }
  confirmationResult.value = await signInWithPhoneNumber(auth, phoneNumber.value, verifier)
  ms.success(t('auth.verificationCodeSent'))
}

async function handleLogin() {
  submitLoading.value = true
  let token = ''
  try {
    const result = await confirmationResult.value?.confirm(verificationCode.value)
    token = await result.user.getIdToken()
  }
  catch {
    ms.error(t('auth.invalidVerificationCode'))
  }

  if (!token) {
    submitLoading.value = false
    return
  }

  try {
    await fetchVerify(token)
    authStore.setToken(token)
    window.location.reload()
  }
  catch (error: any) {
    ms.error(error.message ?? 'error')
    authStore.removeToken()
  }
  finally {
    submitLoading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleLogin()
  }
}
</script>

<template>
  <NModal :show="visible" class="w-11/12 max-w-xl">
    <div class="px-4 py-12 bg-white rounded dark:bg-slate-800">
      <header class="mb-8">
        <p class="text-2xl md:text-3xl text-center font-extrabold text-slate-700 dark:text-slate-100">
          {{ $t('auth.signInTo') }}
          <NText type="primary">
            {{ appName }}
          </NText>
        </p>
      </header>
      <NSpace vertical size="large" class="m-auto max-w-md">
        <PhoneInput v-model:value="phoneNumber" />
        <NInputGroup>
          <NInput v-model:value="verificationCode" :placeholder="t('auth.verificationCode')" @keypress="handlePress" />
          <RecaptchaButton
            :on-success="sendVerifyCode"
            :disabled="sendCodeDisabled"
          />
        </NInputGroup>
        <NButton
          type="primary"
          block
          :disabled="submitDisabled"
          :loading="submitLoading"
          @click="handleLogin"
        >
          {{ $t('auth.login') }}
        </NButton>
      </NSpace>
    </div>
  </NModal>
</template>
