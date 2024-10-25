<!-- eslint-disable no-console -->
<script setup>
import { onMounted } from 'vue'
import { cloneDeep } from 'lodash'
import SongItem from '../components/SongItem.vue'
import { usePlaylistStore } from '../playlist/store'
import { useBlblStore } from './store'
import RankOverview from './rankOverview.vue'
import HomeSinger from './home-singer.vue'
import SingerPreview from './singer-preview.vue'

const store = useBlblStore()
const PLstore = usePlaylistStore()
const rankScroll = ref(null)

onMounted(() => {
  store.initHomePage()
})
function handlePlayRank() {
  store.playList = cloneDeep(store.musicRankList)
  store.play = store.musicRankList[0] || {}
}
function handleScroll(offset) {
  rankScroll.value.scrollTo({
    left: rankScroll.value.scrollLeft + offset,
    behavior: 'smooth',
  })
}
</script>

<template>
  <section w-full h-screen overflow-auto pb-20>
    <!-- bilibili音乐榜 -->
    <h5 text="3xl $eno-text-1 fw-600" class="py-5 text-left px-10 flex items-end gap-3 inline-flex relative w-full">
      <div class="i-mingcute:play-circle-line w-1em h-1em cursor-pointer" @click="handlePlayRank" />
      bilibili音乐榜
      <span text="sm $eno-text-2" class="ml-2">
        (每周五18:00更新)
      </span>
      <RankOverview />
      <!-- 增加左右滚动点击 -->
      <div class="flex items-center gap-2 absolute right-10 top-1/2">
        <div class="bg-$eno-fill-4 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:opacity-70" @click="handleScroll(-600)">
          <div class="i-mingcute:arrow-left-fill w-4" />
        </div>
        <div class="bg-$eno-fill-4 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:opacity-70" @click="handleScroll(600)">
          <div class="i-mingcute:arrow-right-fill w-4" />
        </div>
      </div>
    </h5>
    <div ref="rankScroll" overflow-auto class="w-full h-55 relative">
      <div class="absolute w-full h-full flex gap-5 px-10">
        <div
          v-for="(bannerSong) in store.musicRankList" :key="bannerSong.id" class="cursor-pointer"
          @click.stop="store.startPlay(bannerSong)"
        >
          <img class="h-40 rounded-md" :src="bannerSong.cover">
          <div class="$eno-text-2 text-lg truncate w-40 mt-2">
            {{ bannerSong.title }}
          </div>
          <div class="$eno-text-2 text-xs opacity-70 truncate w-40">
            {{ bannerSong.author }}
          </div>
        </div>
      </div>
    </div>
    <HomeSinger />
    <SingerPreview v-for="mid in PLstore.singers.reverse()" :key="mid" :mid="mid" />
    <SingerPreview :mid="337312411" />
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
