<script setup>
import { computed } from 'vue'
import SongItem from '../components/SongItem.vue'

import { useBlblStore } from '../blbl/store'
import { usePlaylistStore } from './store'

const store = useBlblStore()
const PLStore = usePlaylistStore()
const list = PLStore.list
const noPlaylist = computed(() => list?.length === 0)

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
function delSong(playlist, song) {
  PLStore.removeSong(playlist.id, song.id)
}
</script>

<template>
  <div class="p-10">
    <div v-if="noPlaylist" text-2xl>
      暂无播放列表, 点击左侧新建
    </div>
    <!-- 创建歌单部分 -->
    <div class="flex flex-col text-left gap-5">
      <!-- 循环歌单列表 -->
      <section
        v-for="playlist in list" :key="playlist.name" class="w-full px-5 py-1" border="1 $eno-border"
        bg="$eno-content" rounded-lg
      >
        <div class="flex justify-between items-center w-full">
          <div class="flex items-center gap-3 text-[22px]">
            <div
              v-if="!isMyOpen(playlist)" class="i-mingcute:folder-fill w-1em h-1em" cursor-pointer
              @click.stop="currentOpen = playlist.id"
            />
            <div
              v-else class="i-mingcute:folder-open-2-fill w-1em h-1em" cursor-pointer
              @click.stop="currentOpen = null"
            />
            <h2 class="w-40 truncate">
              {{ playlist.name }}
              <span class="mx-2 text-lg">({{ playlist.songs.length }})</span>
            </h2>
          </div>
          <div class="flex gap-3">
            <div
              class="i-mingcute:play-circle-line" text-xl cursor-pointer
              @click.stop="handleReplacePlaylist(playlist)"
            />
            <div class="i-mingcute:delete-2-line" text-xl cursor-pointer @click.stop="handleDelPL(playlist)" />
          </div>
        </div>
        <!-- 歌曲列表 -->
        <div
          v-if="isMyOpen(playlist)"
          class="flex gap-3 flex-col w-full py-3 wrapper-transition fadeItem text-[16px]"
        >
          <SongItem
            v-for="song in renderSong(playlist)" :key="song?.id || song?.bvid" :song="song"
            :del="true"
            @delete-song="delSong(playlist, song)"
          />
          <!-- 没有歌曲时 -->
          <div v-if="!playlist.songs.length" class="px-10 py-3 text-3xl">
            暂无歌单, 可以前往搜索页面添加
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.wrapper-transition {
  transform: all 0.5s;
}

.song-item:hover>div {
  opacity: 1;
}
</style>
