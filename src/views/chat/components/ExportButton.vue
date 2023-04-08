<script setup lang="ts">
import { useDialog, useMessage } from 'naive-ui'
import html2canvas from 'html2canvas'
import { HoverButton, SvgIcon } from '@/components/common'
import { t } from '@/locales'

const ms = useMessage()
const dialog = useDialog()
function handleExport() {
  const d = dialog.warning({
    title: t('chat.exportImage'),
    content: t('chat.exportImageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: async () => {
      try {
        d.loading = true
        const ele = document.getElementById('image-wrapper')
        if (!ele)
          throw new Error('no image-wrapper')
        const canvas = await html2canvas(ele as HTMLDivElement, {
          useCORS: true,
        })
        const imgUrl = canvas.toDataURL('image/png')
        const tempLink = document.createElement('a')
        tempLink.style.display = 'none'
        tempLink.href = imgUrl
        tempLink.setAttribute('download', 'chat-shot.png')
        if (typeof tempLink.download === 'undefined')
          tempLink.setAttribute('target', '_blank')

        document.body.appendChild(tempLink)
        tempLink.click()
        document.body.removeChild(tempLink)
        window.URL.revokeObjectURL(imgUrl)
        d.loading = false
        ms.success(t('chat.exportSuccess'))
        Promise.resolve()
      }
      catch (error: any) {
        ms.error(t('chat.exportFailed'))
      }
      finally {
        d.loading = false
      }
    },
  })
}
</script>

<template>
  <HoverButton :aria-label="t('chat.exportImage')" :tooltip="t('chat.exportImage')" @click="handleExport">
    <span class="text-xl text-[#4f555e] dark:text-white">
      <SvgIcon icon="ri:download-2-line" />
    </span>
  </HoverButton>
</template>
