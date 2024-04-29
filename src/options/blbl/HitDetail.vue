<script setup>
import { useBlblStore } from './store'

const store = useBlblStore()

function play(music) {
  store.play = music
}
function palyAll() {
  store.playList = store.currentHit.list
  store.play = store.playList[0]
}
</script>

<template>
  <section>
    <!-- 操作 -->
    <span
      p-2
      text-lg
      bg-blue-500
      color="white"
      @click="store.mode = 'hit'"
    >
      home
    </span>
    <span
      p-2
      text-lg
      bg-blue-500
      color="white"
      @click.stop="palyAll"
    >
      播放全部
    </span>
    <!-- 歌单部分 -->
    <section
      flex
      flex-col
      flex-wrap
      gap-3
    >
      <div
        v-for="music in store.currentHit.list"
        :key="music.id"
        flex
        gap-3
        @click.stop="play(music)"
      >
        <img
          w-12 h-12
          transition-all
          transition-duration-300
          hover:transform-translate-y--2 :src="music.cover"
        >
        <div>{{ music.title }}</div>
        <div>{{ music.author }}</div>
      </div>
    </section>
  </section>
</template>
