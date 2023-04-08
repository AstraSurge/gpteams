<script setup lang='ts'>
import { computed } from 'vue'
import type { PopoverPlacement } from 'naive-ui'
import { NTooltip } from 'naive-ui'
import Button from './Button.vue'
const props = withDefaults(defineProps<Props>(), {
  tooltip: '',
  placement: 'bottom',
})
const emit = defineEmits<Emit>()
interface Props {
  tooltip?: string
  placement?: PopoverPlacement
}

interface Emit {
  (e: 'click'): void
}

const showTooltip = computed(() => Boolean(props.tooltip))

function handleClick() {
  emit('click')
}
</script>

<script lang='ts'>
// 使用一个简单的 <script> to declare options
export default {
  inheritAttrs: false, // 关闭默认绑定行为。
}
</script>

<template>
  <div v-if="showTooltip">
    <NTooltip :placement="placement" trigger="hover">
      <template #trigger>
        <Button :aria-label="tooltip" v-bind="$attrs" @click="handleClick">
          <slot />
        </Button>
      </template>
      {{ tooltip }}
    </NTooltip>
  </div>
  <div v-else>
    <Button v-bind="$attrs" @click="handleClick">
      <slot />
    </Button>
  </div>
</template>
