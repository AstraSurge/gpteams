<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, useMessage } from 'naive-ui'
import { useFirebaseAuth } from 'vuefire'
import { sendSignInLinkToEmail } from '@firebase/auth'
import { t } from '@/locales'
import { validateEmail } from '@/utils/functions'
import { FINISH_SIGN_IN_ROUTE } from '@/constants/routes'

const ms = useMessage()

const email = ref('')

const submitLoading = ref(false)
const submitDisabled = computed(() => !validateEmail(email.value) || submitLoading.value)

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
    window.localStorage.setItem('emailForSignIn', email.value)
    ms.success(t('auth.loginLinkSent'))
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
</script>

<template>
  <div class="flex flex-col gap-2">
    <NInput v-model:value="email" :input-props="{ type: 'email' }" :placeholder="t('auth.email')" @keydown="handlePress" />
    <NButton
      type="primary"
      block
      :disabled="submitDisabled"
      :loading="submitLoading"
      @click="SendLoginEmail"
    >
      {{ t("auth.sendLoginLink") }}
    </NButton>
  </div>
</template>
