<script setup>
import cn from 'classnames'
import { useBlblStore } from '../blbl/store.js'

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
  return `${cn('tab-item flex w-full gap-3 text-2xl items-center h-10 cursor-pointer px-4 rounded-4', {
    'justify-center': !props.open,
    'bg-$eno-fill-4': store.mode === tab.mode,
    'hover:bg-$eno-fill-2 ': store.mode !== tab.mode,
  })} ${props.class}`
})
</script>

<template>
  <div :class="tabClass" @click.stop="store.mode = tab.mode">
    <div :class="tab.icon" class="text-[20px]" />
    <span v-if="open && tab.title" class="text-[14px]">{{ tab.title }}</span>
    <slot />
  </div>
</template>
