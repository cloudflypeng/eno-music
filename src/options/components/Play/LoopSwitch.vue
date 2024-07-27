<script setup>
import { useBlblStore } from '../../blbl/store'

const store = useBlblStore()

function handleLoopChange() {
  const loopModes = ['random', 'single', 'list']
  const index = loopModes.indexOf(store.loopMode)
  store.loopMode = loopModes[(index + 1) % loopModes.length]
}
</script>

<template>
  <section class="cursor-pointer hover:opacity-50" @click="handleLoopChange">
    <div v-if="store.loopMode === 'random'" class="i-mingcute:shuffle-fill w-1em h-1em" />
    <div v-else-if="store.loopMode === 'single'" class="i-mingcute:repeat-one-fill w-1em h-1em" />
    <div v-else-if="store.loopMode === 'list'" class="i-mingcute:repeat-fill w-1em h-1em" />
  </section>
</template>
