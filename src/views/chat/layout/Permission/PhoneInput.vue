<script lang="ts" setup>
import { onMounted, ref, toRefs, watch } from 'vue'
import { NInput, NInputGroup, NSelect } from 'naive-ui'
import { countryPhoneData, phone } from 'phone'
import guessCallingCode from 'guess-calling-code'
import { t } from '@/locales'

interface Props {
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const { value } = toRefs(props)

const phoneNumber = ref(phone(value.value).phoneNumber)
const callingCode = ref(phone(value.value).countryCode ? `+${phone(value.value).countryCode}` : undefined)

const callingCodes = [...new Set([`+${guessCallingCode()}`, ...countryPhoneData.map(i => `+${i.country_code}`)])]

const options = callingCodes.map(i => ({
  label: i,
  value: i,
}))

watch([phoneNumber, callingCode], () => {
  emit('update:value', `${callingCode.value}${phoneNumber.value}`)
}, { immediate: true, deep: true })

onMounted(() => {
  if (!callingCode.value)
    callingCode.value = `+${guessCallingCode()}`
})
</script>

<template>
  <NInputGroup>
    <NSelect v-model:value="callingCode" :style="{ width: '96px' }" :consistent-menu-width="false" placeholder="calling Code" filterable :options="options" />
    <NInput v-model:value="phoneNumber" :placeholder="t('auth.phoneNumber')" />
  </NInputGroup>
</template>
