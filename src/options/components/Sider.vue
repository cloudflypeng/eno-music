<script setup>
import { useBlblStore } from '../blbl/store.js'

const store = useBlblStore()
</script>

<template>
  <aside w-20 h-full flex flex-col gap-8 items-center py-30 text-3xl>
    <div
      class="i-tabler:smart-home w-1em h-1em"
      title="返回" @click.stop="store.mode = 'home'"
    />
    <div
      class="i-tabler:music-search w-1em h-1em"
      @click.stop="store.mode = 'search'"
    />
  </aside>
</template>
