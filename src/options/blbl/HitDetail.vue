<script setup>
import SongItem from '../components/SongItem.vue'
import { useBlblStore } from './store'

const store = useBlblStore()

function palyAll() {
  store.playList = store.currentHit.list
  store.play = store.playList[0]
}
</script>

<template>
  <section relative object-cover h-full overflow-auto>
    <!-- 背景图片 -->
    <img
      w-full h-full
      absolute
      :src="store.currentHit.cover"
      object-cover
    >
    <div
      absolute top-0 left-0
      w-full h-full
      grid
      p-10
      style="grid-template-rows: 50px 1fr; backdrop-filter: var(--eno-filter-glass-2);"
      class="bg-$eno-fill-dark-4"
    >
      <!-- 操作 -->
      <div
        cursor-pointer
        flex
        items-center
        p-2
        w-35
        my-2
        text-lg
        bg="$eno-fill-2"
        color="white"
        @click.stop="palyAll"
      >
        <div w-10 mr-3 class="i-tabler:playlist-add w-1em h-1em" />
        <span>播放全部</span>
      </div>
      <!-- 歌单部分 -->
      <section
        class="flex flex-col flex-nowrap
          gap-2 overflow-auto pb-20"
      >
        <SongItem
          v-for="music in store.currentHit.list" :key="music.id" :song="music"
        />
      </section>
    </div>
  </section>
</template>
