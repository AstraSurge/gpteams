<script setup lang='ts'>
import { computed, ref, toRefs } from 'vue'
import { NButton, NInput, NInputGroup, useMessage } from 'naive-ui'
import { useFirebaseAuth } from 'vuefire'
import type { RecaptchaVerifier } from '@firebase/auth'
import { signInWithPhoneNumber } from '@firebase/auth'
import { phone } from 'phone'
import PhoneInput from './PhoneInput.vue'
import RecaptchaButton from './RecaptchaButton.vue'
import { useAppStore } from '@/store'
import { t } from '@/locales'

const props = defineProps<{
  onSuccess: (token: string) => Promise<void>
}>()

const { onSuccess } = toRefs(props)

const { language } = useAppStore()

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
    await onSuccess.value(token)
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
  <div class="flex flex-col gap-2">
    <PhoneInput v-model:value="phoneNumber" />
    <NInputGroup>
      <NInput v-model:value="verificationCode" maxlength="6" :placeholder="t('auth.verificationCode')" @keydown="handlePress" />
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
  </div>
</template>
