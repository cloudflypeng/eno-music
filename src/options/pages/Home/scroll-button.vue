<script setup lang="ts">
defineProps<{
  handleScroll: (offset: number) => void
  step: number
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div
      class="bg-$eno-fill-4 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:opacity-70"
      @click="handleScroll(-step)"
    >
      <div class="i-mingcute:arrow-left-fill w-4" />
    </div>
    <div
      class="bg-$eno-fill-4 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:opacity-70"
      @click="handleScroll(step)"
    >
      <div class="i-mingcute:arrow-right-fill w-4" />
    </div>
  </div>
</template>
