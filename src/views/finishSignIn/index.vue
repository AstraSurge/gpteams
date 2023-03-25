<script lang="ts" setup>
import { isSignInWithEmailLink, signInWithEmailLink } from '@firebase/auth'
import { NButton, NInput, NSpin, NText, useMessage } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useFirebaseAuth } from 'vuefire'
import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import { t } from '@/locales'
import { router } from '@/router'
import { validateEmail } from '@/utils/functions'

const ms = useMessage()

const authStore = useAuthStore()
const email = ref(localStorage.getItem('emailForSignIn') || '')

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

  const result = await signInWithEmailLink(auth, email.value, window.location.href)

  const token = await result.user.getIdToken()

  try {
    await fetchVerify(token)
    authStore.setToken(token)
  }
  catch {
    ms.error(t('auth.invalidEmailLinkOrExpired'))
  }
  finally {
    router.replace('/')
    window.localStorage.removeItem('emailForSignIn')
  }
}

onMounted(handleLogin)

const appName = import.meta.env.VITE_APP_NAME
</script>

<template>
  <main class="w-screen h-screen flex items-center justify-center gap-8 dark:bg-slate-900">
    <div class="h-screen flex-1 flex flex-col items-center gap-4 py-12 px-4 ">
      <NText type="primary" class="text-3xl md:text-4xl font-extrabold">
        {{ appName }}
      </NText>
      <div class="flex flex-col justify-center items-center flex-1 gap-6 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-slate-700 dark:text-slate-100">
          {{ t("auth.welcomeBack") }}
        </h1>
        <NSpin v-if="isLogin" :size="120" class="p-8" />
        <div v-else class="flex-col justify-center items-center text-xl w-11/12 max-w-xl flex gap-4">
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
    </div>
    <div class="hidden  lg:block h-screen flex-1 bg-sign-in-background dark:bg-sign-in-background-dark" />
  </main>
</template>
