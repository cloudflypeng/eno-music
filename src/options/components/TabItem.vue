<script setup>
import cn from 'classnames'
import { useBlblStore } from '../blbl/store.ts'

const props = defineProps({
  tab: {
    type: Object,
    required: true,
  },
  open: Boolean,
  class: String,
})
const store = useBlblStore()
const { tab } = props

const tabClass = computed(() => {
  const isCurrentMode = store.mode === tab.mode
  const baseClass = 'tab-item flex w-full gap-2 text-2xl items-center h-10 cursor-pointer rounded-2 pl-3 duration-150'
  return `${cn(baseClass, {
    // 'justify-center': !props.open,
    'bg-$eno-fill-4': isCurrentMode,
    'hover:bg-$eno-fill-2 ': !isCurrentMode,
  })} ${props.class}`
})
function handleClick() {
  store.mode = tab.mode
}
</script>

<template>
  <div :class="tabClass" @click.stop="handleClick">
    <div :class="tab.icon" class="text-[20px]" />
    <span v-if="open && tab.title" class="text-[14px]">{{ tab.title }}</span>
    <slot />
  </div>
</template>
