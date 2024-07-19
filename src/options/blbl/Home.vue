<!-- eslint-disable no-console -->
<script setup>
import { onMounted } from 'vue'
import SongItem from '../components/SongItem.vue'
import { useBlblStore } from './store'
import Rank from './rank.vue'
import { useApiClient } from '~/composables/api'

// const api = useApiClient()

const store = useBlblStore()
const scrollRef = ref(null)

onMounted(() => {
  store.initHomePage()
})
function scroll(direction) {
  const scrollLeft = scrollRef.value.scrollLeft

  const scrollDistance = scrollRef.value.clientWidth
  if (direction === 'left')
    scrollRef.value.scrollLeft = scrollLeft - scrollDistance
  else
    scrollRef.value.scrollLeft = scrollLeft + scrollDistance
}
</script>

<template>
  <section w-full h-screen overflow-auto>
    <!-- bilibili音乐榜 -->
    <h5 text="2xl $eno-text-1" fw-600 py-5 text-left px-10>
      bilibili音乐榜
      <span text="sm $eno-text-2" class="ml-2">
        (每周五18:00更新)
      </span>
    </h5>
    <div class="flex gap-3 h-[50vh]">
      <!-- swiper -->
      <div class="relative h-[50vh] ml-20">
        <!-- 左右切换箭头 -->
        <div
          class="w-15 h-15 left-3 flex items-center justify-center text-4xl bg-black bg-opacity-80 absolute top-[40%] rounded-full z-2 cursor-pointer"
        >
          <div class="i-mingcute:large-arrow-left-line w-1em h-1em" @click.stop="scroll('left')" />
        </div>
        <div
          class="w-15 h-15 right-3 flex items-center justify-center text-4xl bg-black bg-opacity-80 absolute top-[40%] right-0 rounded-full z-2 cursor-pointer"
        >
          <div class="i-mingcute:large-arrow-right-line w-1em h-1em" @click.stop="scroll('right')" />
        </div>
        <div ref="scrollRef" class="w-[40vw] z--1 flex overflow-auto rounded-3 gap-3 snap-x scroll-smooth">
          <div
            v-for="bannerSong in store.musicRankList" :key="bannerSong.id" class="w-[90%] shrink-0 snap-start"
            @click.stop="store.startPlay(bannerSong)"
          >
            <img class="w-full aspect-video rounded-xl cursor-pointer object-fill" :src="bannerSong.cover">
            <div class="$eno-text-2 opacity-50 px-5">
              {{ bannerSong.title }}
            </div>
          </div>
        </div>
      </div>
      <!-- 列表 -->
      <div class="overflow-auto h-[calc(100%-32px)] wrapper-scroll pb-10 flex-1">
        <div v-for="song in store.musicRankList" :key="song.id">
          <SongItem :song="song" size="mini" />
        </div>
      </div>
    </div>
    <!-- <section pos="relative" class="w-[calc(100vw-20rem)] mx-auto py-10">
      <div ref="scrollRef" class="w-[calc(100vw-20rem)] wrapper-scroll z--1" flex overflow-auto gap-10 snap-x p="x-15">
        <div
          v-for="music in store.hitList" :key="music.menuid" w-50 shrink-0 h-60 snap-center
          @click="handleDetail(music)"
        >
          <img w-50 h-50 rounded-xl cursor-pointer :src="music.cover">
          <div text="$eno-text-2">
            {{ music.title }}
          </div>
        </div>
      </div>
      <div z-1>
        <div
          class="bg-[rgba(0,0,0,0.5)] translate-y--1/2" pos="absolute left-0 top-[40%]"
          p-1 flex items-center cursor-pointer
          rounded-full @click.stop="scroll('left')"
        >
          <div text-5xl class="i-tabler:arrow-badge-left-filled w-1em h-1em" />
        </div>
        <div
          class="bg-[rgba(0,0,0,0.5)] translate-y--1/2" pos="absolute right-0 top-[40%]"
          p-1 flex items-center cursor-pointer
          rounded-full @click.stop="scroll('right')"
        >
          <div text-5xl class="i-tabler:arrow-badge-right-filled w-1em h-1em" />
        </div>
      </div>
    </section> -->
    <h5 text="2xl $eno-text-1" fw-600 px-10 text-left>
      精选榜单
    </h5>
    <Rank />
  </section>
</template>

<style>
.wrapper-scroll {
  mask-image: linear-gradient(to bottom,
      transparent,
      #000 0% 80%,
      transparent);
}
</style>
