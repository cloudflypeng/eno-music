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
  // 重名校验, 空校验
  if (list.some(pl => pl.name === playlistName.value) || !playlistName.value)
    return

  PLStore.createPlaylist(playlistName.value)
  handleCancel()
}
function handleCancel() {
  createActive.value = false
  playlistName.value = ''
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
// 增加歌单列表展开和关闭, 手风琴模式
const currentOpen = ref(null)
const isMyOpen = playlist => currentOpen.value === playlist.id
// 单独播放一首歌
function handlePlaySong(song) {
  store.startPlay(song)
}
</script>

<template>
  <div class="p-10">
    <div v-if="noPlaylist">
      暂无歌单,请创建
    </div>
    <!-- 创建歌单部分 -->
    <div class="flex gap-3 mb-5">
      <button text-lg border px-3 py-1 rounded-4 @click.stop="createActive = !createActive">
        创建歌单
      </button>
      <div v-if="createActive" class="flex gap-3 w-[50vw]">
        <input
          v-model="playlistName" bg="$eno-content focus:$eno-content-hover"
          class="flex-2 px-4 py-2 rounded-lg
          focus:outline-none focus:shadow-outline"
          @keyup.enter="createPlaylist"
        >
        <button text-lg border px-3 py-1 rounded-4 @click.stop="createPlaylist">
          创建
        </button>
        <button text-lg border px-3 py-1 rounded-4 @click.stop="handleCancel">
          取消
        </button>
      </div>
      <br>
    </div>
    <div class="flex flex-col text-left gap-5">
      <!-- 循环歌单列表 -->
      <section
        v-for="playlist in list" :key="playlist.name"
        class="w-full px-5 py-1"
        border="1 $eno-border" bg="$eno-content"
        rounded-lg
      >
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-3 text-[22px]">
            <div
              v-if="!isMyOpen(playlist)"
              class="i-mingcute:folder-fill w-1em h-1em"
              cursor-pointer
              @click.stop="currentOpen = playlist.id"
            />
            <div
              v-else
              class="i-mingcute:folder-open-2-fill w-1em h-1em"
              cursor-pointer
              @click.stop="currentOpen = null"
            />
            <h2 class="w-40 truncate">
              {{ playlist.name }}
              <span class="mx-2 text-lg">({{ playlist.songs.length }})</span>
            </h2>
          </div>
          <div class="flex gap-3">
            <div class="i-mingcute:play-circle-line" text-xl cursor-pointer @click.stop="handleReplacePlaylist(playlist)" />
            <div class="i-mingcute:delete-2-line" text-xl cursor-pointer @click.stop="handleDelPL(playlist)" />
          </div>
        </div>
        <!-- 歌曲列表 -->
        <div
          v-if="isMyOpen(playlist)"
          py-3
          class="flex gap-3 flex-col max-w-5xl wrapper-transition opacity-item text-[16px]"
        >
          <div
            v-for="song in renderSong(playlist)" :key="song?.id || song?.bvid"
            class="flex items-center opacity-75 hover:opacity-100 song-item"
            cursor-pointer
            @click.stop="handlePlaySong(song)"
          >
            <div class="flex flex-1 gap-3">
              <img :src="song.cover" class="w-10 h-10 rounded-2 overflow-hidden object-fill">
              <span v-html="song.title" />
            </div>

            <div class="i-mingcute:delete-2-line" opacity-0 cursor-pointer @click.stop="handleDelPL(playlist)" />
          </div>
          <div v-if="!playlist.songs.length" class="px-10 py-3 text-3xl">
            暂无歌单, 可以前往搜索页面添加
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.opacity-item {
  animation: fadeIn 0.5s;
}
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.wrapper-transition{
  transform: all 0.5s;
}
.song-item:hover > div {
  opacity: 1;
}
</style>
