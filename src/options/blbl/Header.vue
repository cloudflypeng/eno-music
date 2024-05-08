<script setup>
import { useBlblStore } from './store.js'

const store = useBlblStore()
</script>

<template>
  <header
    pos="fixed top-0 left-0"
    flex
    w-full h-20 flex-row justify-between
    items-center z-1000 bg-black
  >
    <span
      px-20
      h-full
      flex
      items-center
    >
      <div
        text-3xl class="i-tabler:smart-home w-1em h-1em"
        title="返回" @click.stop="store.mode = 'home'"
      />
    </span>
    <div w-100 relative color-warmgray>
      <input
        type="text" bg-gray-800
        focus:bg-gray-700
        class="w-full px-4 py-2 rounded-lg
        focus:outline-none focus:shadow-outline"
        placeholder="bilibili music search"
      >
      <div absolute right-2 text-xl class="i-tabler:search w-1em h-1em top-[50%] translate-y--1/2" />
    </div>
    <span
      px-20
      h-full
      flex
      items-center
    >
      <div
        class="i-tabler:users w-1em h-1em"
        text-3xl
        title="返回" @click.stop="store.mode = 'home'"
      />
    </span>
  </header>
</template>
