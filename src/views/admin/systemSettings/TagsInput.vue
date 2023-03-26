<script lang="ts" setup>
import { NSelect } from 'naive-ui'
import { t } from '@/locales'
</script>

<template>
  <NSelect
    class="max-w-2xl w-full"
    :show="false"
    tag
    filterable
    :placeholder="t('admin.tagsInputPlaceholder')"
    multiple
    :show-arrow="false"
  />
</template>
