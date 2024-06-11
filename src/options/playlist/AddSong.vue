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
    v-if="PLStore.addSongDialog" class="fixed inset-0 z-100
    bg-black bg-opacity-50 flex justify-center items-center"
    @click.stop="PLStore.addSongDialog = false"
  >
    <div class="bg-black">
      <h2>添加到</h2>
      <div class="flex flex-col text-left gap-5 p-5">
        <section
          v-for="playlist in PLStore.list" :key="playlist.name"
          class="w-full px-5 py-1 cursor-pointer flex justify-between items-center"
          border
          border-dark
          rounded-lg
          @click.stop="handleAddSong(playlist)"
        >
          <h2 class="w-40 text-xl truncate">
            {{ playlist.name }}
          </h2>
        </section>
      </div>
    </div>
  </section>
</template>
