<script setup>
// import { useBlblStore } from '../blbl/store.js'

// const store = useBlblStore()
</script>

<template>
  <section w-full h-full flex justify-center items-center>
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
  </section>
</template>
