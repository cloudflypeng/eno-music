<script setup>
import { computed } from 'vue'

import { useBlblStore } from '../blbl/store'
import { usePlaylistStore } from './store'

const store = useBlblStore()
const PLStore = usePlaylistStore()
const list = PLStore.list
const noPlaylist = computed(() => list?.length === 0)
const createActive = ref(false)
const playlistName = ref('')

function createPlaylist() {
  PLStore.createPlaylist(playlistName)
}
function handleDelPL({ id }) {
  PLStore.removePlaylist(id)
}
function renderSong({ songs }) {
  return songs.filter(song => song)
}
function handleReplacePlaylist(playlist) {
  store.play = playlist.songs[0]
  store.playList = playlist.songs
}
</script>

<template>
  <div class="p-10">
    <div v-if="noPlaylist">
      暂无歌单,请创建
    </div>
    <div class="flex gap-3 mb-5">
      <button text-lg @click.stop="createActive = true">
        创建歌单
      </button>
      <div v-if="createActive" class="flex gap-3">
        <input
          v-model="playlistName" bg-gray-800
          focus:bg-gray-700
          class="w-full px-4 py-2 rounded-lg
          focus:outline-none focus:shadow-outline"
          @keyup.enter="createPlaylist"
        >
      </div>
      <br>
    </div>
    <div class="flex flex-col text-left gap-5">
      <section
        v-for="playlist in list" :key="playlist.name"
        class="w-full px-5 py-1 cursor-pointer"
        border
        border-dark
        rounded-lg
      >
        <div class="flex justify-between items-center w-full">
          <h2 class="w-40 text-[30px] truncate">
            {{ playlist.name }}
          </h2>
          <div class="flex gap-3">
            <div class="i-mingcute:play-circle-line" text-3xl @click.stop="handleReplacePlaylist(playlist)" />
            <div class="i-mingcute:delete-2-line" text-3xl @click.stop="handleDelPL(playlist)" />
          </div>
        </div>
        <div>
          <div v-for="song in renderSong(playlist)" :key="song?.id || song?.bvid">
            <span v-html="song.title" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
