<script setup>
import { computed } from 'vue'
import { usePlaylistStore } from './store'

const PLStore = usePlaylistStore()
function handleAddSong({ id }) {
  PLStore.addSong(id)
  PLStore.addSongDialog = false
}
</script>

<template>
  <section
    v-if="PLStore.addSongDialog"
    flex="justify-center items-center"
    class="w-full h-full fixed top-0 left-0 z-100"
    @click.stop="PLStore.addSongDialog = false"
  >
    <div
      class="
        fixed inset-0 p-3
        rounded-lg
        bg-$eno-elevated backdrop-blur
        top-[50%] left-[50%] translate-x--1/2 translate-y--1/2
        h-[50vh] w-1/3
    "
    >
      <div text-xl>
        添加到
      </div>
      <div class="flex flex-col text-left gap-1">
        <section
          v-for="playlist in PLStore.list" :key="playlist.name"
          class="w-full cursor-pointer flex justify-between items-center"
          rounded-lg
          @click.stop="handleAddSong(playlist)"
        >
          <h2 class="w-40 text-lg truncate">
            {{ playlist.name }}
          </h2>
        </section>
      </div>
    </div>
  </section>
</template>
