<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NInputGroup, NModal, NSpace, NText, useMessage } from 'naive-ui'
import { useFirebaseAuth } from 'vuefire'
import { RecaptchaVerifier, signInWithPhoneNumber } from '@firebase/auth'
import { phone } from 'phone'
import PhoneInput from './PhoneInput.vue'
import { fetchVerify } from '@/api'
import { useAppStore, useAuthStore } from '@/store'

interface Props {
  visible: boolean
}

defineProps<Props>()

const RECAPTCHA_BUTTON_ID = 'recaptcha-button'

const appName = import.meta.env.VITE_APP_NAME

const { language } = useAppStore()

const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)

const verificationCode = ref('')
const phoneNumber = ref('')
const appVerifier = ref<RecaptchaVerifier>()
const confirmationResult = ref()
const submitDisabled = computed(() => !phoneNumber.value || !verificationCode.value.trim() || loading.value)
const sendCodeDisabled = computed(() => !phoneNumber.value || loading.value || !phone(phoneNumber.value).isValid)

const auth = useFirebaseAuth()
if (auth)
  auth.languageCode = language

async function sendVerifyCode() {
  try {
    if (!auth)
      throw new Error('Firebase auth not initialized')

    appVerifier.value = new RecaptchaVerifier(RECAPTCHA_BUTTON_ID, {
      size: 'invisible',
    }, auth)
    confirmationResult.value = await signInWithPhoneNumber(auth, phoneNumber.value, appVerifier.value)
  }
  catch (error) {
    appVerifier.value?.render().then((widgetId) => {
      grecaptcha.reset(widgetId)
    })
  }
}

async function handleLogin() {
  loading.value = true
  let token = ''
  try {
    const result = await confirmationResult.value?.confirm(verificationCode.value)
    token = await result.user.getIdToken()
  }
  catch {
    ms.error('Invalid verification code')
  }

  if (!token) {
    loading.value = false
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
    loading.value = false
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
          <NInput v-model:value="verificationCode" placeholder="Verification Code" @keypress="handlePress" />
          <NButton :id="RECAPTCHA_BUTTON_ID" :disabled="sendCodeDisabled" type="primary" @click="sendVerifyCode">
            {{ $t("auth.sendCode") }}
          </NButton>
        </NInputGroup>
        <NButton
          type="primary"
          block
          :disabled="submitDisabled"
          :loading="loading"
          @click="handleLogin"
        >
          {{ $t('auth.login') }}
        </NButton>
      </NSpace>
    </div>
  </NModal>
</template>
