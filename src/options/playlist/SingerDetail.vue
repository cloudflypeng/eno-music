<script setup>
import { defaultSingers, usePlaylistStore } from './store'

// import { getUserArc } from '~/background/api/wbiApi.js'

const PLstore = usePlaylistStore()

const info = computed(() => {
  return PLstore.singerCardCache[PLstore.currentSinger]
})
const songList = ref([])

// watch(() => PLstore.currentSinger, (mid) => {
//   getUserArc({ mid }).then((res) => {
//     songList.value = res.data.list
//   })
// })
function clickMessage() {

}
</script>

<template>
  <section>
    <!-- 信息界面 -->
    <div class="w-full bg-yellow px-20 py-10 flex gap-6">
      <img :src="info?.face" class="w-40 h-40 rounded-full border-2 border-gray-200 cursor-pointer">
      <div class="flex flex-col-reverse">
        <div class="text-lg font-bold">
          {{ info?.nameplate?.name }}
        </div>
        <div class="text-sm">
          {{ info?.nameplate?.condition }}
        </div>
        <div class="text-2xl font-bold">
          {{ info?.name }}
        </div>
      </div>
    </div>
    <!-- 歌单界面 -->
    <div class="w-full px-20 py-10 flex gap-6">
      <div class="text-lg font-bold">
        投稿作品
      </div>
      <div class="text-[16px] font-bold bg-yellow px-3 py-2" @click="clickMessage">
        播放全部
      </div>
      <div>
        <div v-for="song in songList" :key="song.id" class="text-lg">
          {{ song.name }}
        </div>
      </div>
    </div>
  </section>
</template>
