<script setup lang="ts">
import { NButton, NText, useMessage } from 'naive-ui'
import { ref, toRefs } from 'vue'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useFirebaseAuth } from 'vuefire'
import { SvgIcon } from '@/components/common'
import { t } from '@/locales'

const props = defineProps<{
  onSuccess: (token: string) => Promise<void>
}>()

const ms = useMessage()

const provider = new GoogleAuthProvider()

const auth = useFirebaseAuth()
const loading = ref(false)

const { onSuccess } = toRefs(props)

async function handleClick() {
  loading.value = true
  try {
    if (!auth)
      throw new Error(t('auth.pleaseTryAgainLater'))
    const result = await signInWithPopup(auth, provider)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    const token = credential?.accessToken
    if (token) {
      const idToken = await auth.currentUser?.getIdToken()
      if (idToken)
        await onSuccess.value(idToken)
    }
  }
  catch (e) {
    ms.error(e as string || t('auth.pleaseTryAgainLater'))
  }
  finally {
    loading.value = false
  }
}
</script>

<template>
  <NButton block :loading="loading" class="h-[40px] dark:bg-white " @click="handleClick">
    <SvgIcon icon="logos:google-icon" class="w-[18px] h-[18px] mr-2" />
    <NText class="font-roboto text-sm dark:text-black">
      {{ $t("auth.signInWithGoogle") }}
    </NText>
  </NButton>
</template>
