<script lang="ts" setup>
import { isSignInWithEmailLink, signInWithEmailLink } from '@firebase/auth'
import { NButton, NInput, NSpin, useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { useAuthStore } from '@/store'
import { t } from '@/locales'
import { router } from '@/router'
import { validateEmail } from '@/utils/functions'
import AuthLayout from '@/components/custom/AuthLayout.vue'
import { verifyIdToken } from '@/api'
import { EMAIL_FOR_SIGN_IN, SEND_MAIL_WAIT_SECONDS } from '@/constants/storage'

const ms = useMessage()

const authStore = useAuthStore()
const email = ref(localStorage.getItem(EMAIL_FOR_SIGN_IN) || '')

const submitDisabled = computed(() => !validateEmail(email.value))

const auth = useFirebaseAuth()

const isLogin = ref(false)

async function handleLogin() {
  if (!auth)
    return

  if (!isSignInWithEmailLink(auth, window.location.href))
    return router.replace('/')

  if (!email.value)
    return

  isLogin.value = true

  let token = ''
  try {
    const result = await signInWithEmailLink(auth, email.value, window.location.href)
    token = await result.user.getIdToken()
  }
  catch {
    return ms.error(t('auth.invalidEmailLinkOrExpired'))
  }

  try {
    const resp = await verifyIdToken(token)
    authStore.setAuthState({
      token,
      role: resp.data.role,
    })
  }
  catch {
    ms.error(t('auth.noPermissionToSignIn'), {
      duration: 5000,
      closable: true,
    })
  }
  finally {
    window.localStorage.removeItem(SEND_MAIL_WAIT_SECONDS)
    window.localStorage.removeItem(EMAIL_FOR_SIGN_IN)
    router.replace('/')
  }
}

onMounted(handleLogin)
</script>

<template>
  <AuthLayout>
    <div class="flex flex-col justify-center items-center gap-6 text-center w-full max-w-lg">
      <h1 class="text-4xl md:text-5xl font-bold text-slate-600 dark:text-slate-100">
        {{ t("auth.welcomeBack") }}
      </h1>
      <NSpin v-if="isLogin" :size="120" class="p-8" />
      <div v-else class="flex-col justify-center items-center text-xl flex gap-4">
        <p class="text-slate-500 dark:text-slate-200 font-light">
          {{ t("auth.finishSignInRequiredEmailTips") }}
        </p>
        <NInput v-model:value="email" size="large" :placeholder="t('auth.email')" />
        <NButton
          size="large"
          :disabled="submitDisabled"
          type="primary"
          block
          @click="handleLogin"
        >
          {{ t("auth.signIn") }}
        </NButton>
        <NButton
          size="large"
          type="primary"
          text
          @click="router.replace('/')"
        >
          {{ t("auth.returnToSignInPage") }}
        </NButton>
      </div>
    </div>
  </AuthLayout>
</template>
