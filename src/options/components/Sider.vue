<script setup>
import { useBlblStore } from '../blbl/store.js'

const store = useBlblStore()
</script>

<template>
  <aside w-20 h-full flex flex-col flex-shrink-0 gap-8 items-center py-30 text-3xl>
    <div
      class="i-tabler:smart-home w-1em h-1em"
      hover:scale-110
      title="返回" @click.stop="store.mode = 'home'"
    />
    <div
      hover:scale-110
      class="i-tabler:music-search w-1em h-1em"
      @click.stop="store.mode = 'search'"
    />
    <div
      hover:scale-110
      class="i-streamline:play-list-folder w-1em h-1em"
      @click.stop="store.mode = 'playlist'"
    />
  </aside>
</template>
