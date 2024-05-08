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
      backdrop-blur
      grid
      p-10
      style="grid-template-rows: 50px 1fr;"
      class="bg-[rgba(0,0,0,0.7)]"
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
        bg-black
        color="white"
        @click.stop="palyAll"
      >
        <div w-10 mr-3 class="i-tabler:playlist-add w-1em h-1em" />
        <span>播放全部</span>
      </div>
      <!-- 歌单部分 -->
      <section
        flex
        flex-col
        flex-nowrap
        gap-3
        pb-30
        overflow-auto
      >
        <div
          v-for="music in store.currentHit.list"
          :key="music.id"
          style="grid-template-columns: 50px 1fr 1fr;"
          grid
          text-left
          gap-3
          @click.stop="play(music)"
        >
          <img
            w-12 h-12
            rounded-xl
            transition-all
            transition-duration-300
            hover:outline-2
            hover:outline-amber :src="music.cover"
          >
          <div>{{ music.title }}</div>
          <div>{{ music.author }}</div>
        </div>
      </section>
    </div>
  </section>
</template>
