<script setup lang='ts'>
import { computed, onMounted, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { useFirebaseAuth } from 'vuefire'
import { sendSignInLinkToEmail } from '@firebase/auth'
import { useLocalStorage } from '@vueuse/core'
import { t } from '@/locales'
import { validateEmail } from '@/utils/functions'
import { FINISH_SIGN_IN_ROUTE } from '@/constants/routes'
import { EMAIL_FOR_SIGN_IN, SEND_MAIL_WAIT_SECONDS } from '@/constants/storage'

const ms = useMessage()

const email = ref('')

const submitLoading = ref(false)
const submitDisabled = computed(() => !validateEmail(email.value) || submitLoading.value)

const sendMailWaitSeconds = useLocalStorage(SEND_MAIL_WAIT_SECONDS, 0)

async function startWaitToSendMail(time: number) {
  sendMailWaitSeconds.value = time
  while (sendMailWaitSeconds.value > 0) {
    await new Promise(resolve => setTimeout(resolve, 1000))
    sendMailWaitSeconds.value--
  }
}

const auth = useFirebaseAuth()

const actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be in the authorized domains list in the Firebase Console.
  url: `${`${location.protocol}//${location.host}`}${FINISH_SIGN_IN_ROUTE}`,
  // This must be true.
  handleCodeInApp: true,
}

async function SendLoginEmail() {
  if (!auth) {
    ms.error(t('auth.pleaseTryAgainLater'))
    return
  }

  try {
    submitLoading.value = true
    await sendSignInLinkToEmail(auth, email.value, actionCodeSettings)
    window.localStorage.setItem(EMAIL_FOR_SIGN_IN, email.value)
    ms.success(t('auth.loginLinkSent'))
    startWaitToSendMail(15)
  }
  catch (e) {
    ms.error(`${t('auth.pleaseTryAgainLater')}`)
  }
  finally {
    submitLoading.value = false
  }
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    SendLoginEmail()
  }
}

onMounted(() => {
  if (sendMailWaitSeconds.value > 0)
    startWaitToSendMail(sendMailWaitSeconds.value)
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <NInput v-model:value="email" :input-props="{ type: 'email' }" :placeholder="t('auth.email')" @keydown="handlePress" />
    <NButton
      type="primary"
      block
      :disabled="submitDisabled || sendMailWaitSeconds > 0"
      :loading="submitLoading"
      @click="SendLoginEmail"
    >
      {{ sendMailWaitSeconds > 0 ? t("auth.waitSecondsToSendMail", { seconds: sendMailWaitSeconds }) : t("auth.sendLoginLink") }}
    </NButton>
  </div>
</template>
