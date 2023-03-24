<script setup lang="ts">
import { RecaptchaVerifier } from '@firebase/auth'
import { ref, toRefs } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { NButton, useMessage } from 'naive-ui'
import { t } from '@/locales'

const props = defineProps<{
  onSuccess: (verifer: RecaptchaVerifier) => Promise<void>
  disabled: boolean
} >()

const RECAPTCHA_BUTTON_ID = 'recaptcha-button'

const ms = useMessage()

const { onSuccess, disabled } = toRefs(props)

const loading = ref(false)
const appVerifier = ref<RecaptchaVerifier>()
const auth = useFirebaseAuth()

async function handleCodeSending() {
  loading.value = true
  if (!auth)
    throw new Error(t('auth.pleaseTryAgainLater'))

  try {
    if (!appVerifier.value) {
      appVerifier.value = new RecaptchaVerifier(RECAPTCHA_BUTTON_ID, {
        size: 'invisible',
      }, auth)
    }

    await onSuccess.value(appVerifier.value)
  }
  catch (e) {
    ms.error(t('auth.pleaseTryAgainLater'))
  }
  finally {
    loading.value = false
    appVerifier.value?.render().then((widgetId) => {
      grecaptcha.reset(widgetId)
    })
  }
}
</script>

<template>
  <NButton :id="RECAPTCHA_BUTTON_ID" type="primary" :loading="loading" :disabled="disabled" @click="handleCodeSending">
    {{ $t("auth.sendCode") }}
  </NButton>
</template>
