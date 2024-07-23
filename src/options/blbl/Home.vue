<!-- eslint-disable no-console -->
<script setup>
import { onMounted } from 'vue'
import SongItem from '../components/SongItem.vue'
import { useBlblStore } from './store'
import Rank from './rank.vue'
import { useApiClient } from '~/composables/api'

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
    <h5 text="2xl $eno-text-1 fw-600" class="py-5 text-left px-10">
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
