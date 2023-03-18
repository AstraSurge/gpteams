<script lang="ts" setup>
import { ref, toRefs, watch } from 'vue'
import { NInput, NInputGroup, NSelect } from 'naive-ui'
import { countryPhoneData, phone } from 'phone'
import { t } from '@/locales'

interface Props {
  value: string
}

const props = defineProps<Props>()
const emit = defineEmits(['update:value'])

const { value } = toRefs(props)

const phoneNumber = ref(phone(value.value).phoneNumber)
const callingCode = ref(`+${phone(value.value).countryCode || 1}`)

// TODO: pin some calling codes by user language
const callingCodes = ['+1', '+86', '+852', '+886', ...countryPhoneData.map(i => `+${i.country_code}`)]

const options = [...new Set(callingCodes)].map(i => ({
  label: i,
  value: i,
}))

watch([phoneNumber, callingCode], () => {
  emit('update:value', `${callingCode.value}${phoneNumber.value}`)
}, { immediate: true, deep: true })
</script>

<template>
  <NInputGroup>
    <NSelect v-model:value="callingCode" :style="{ width: '96px' }" :consistent-menu-width="false" placeholder="calling Code" filterable :options="options" />
    <NInput v-model:value="phoneNumber" :placeholder="t('auth.phoneNumber')" />
  </NInputGroup>
</template>
