<script setup>
import { onMessage, sendMessage } from 'webext-bridge/options'
import { useBlblStore } from '../blbl/store.js'
import SongItem from '../components/SongItem.vue'
import { defaultSingers, usePlaylistStore } from './store'

const PLstore = usePlaylistStore()
const store = useBlblStore()

const info = computed(() => {
  return PLstore.singerCardCache[PLstore.currentSinger]
})

const songList = ref([])
const keyword = ref('')
const page = ref({
  pn: 1,
  ps: 25,
  count: 0,
})

onMessage('wbiApi', ({ data }) => {
  const { api } = data
  if (api !== 'getUserArc')
    return
  try {
    const content = data.res.data
    const { page: c_page, list } = content
    const videoList = list.vlist.map(item => ({
      id: item.bvid,
      enu_song_type: 'bvid',
      cover: `${item.pic}`,
      title: item.title,
      description: item.description,
      author: item.author,
      duration: item.duration || 0, // 暂无
      bvid: item.bvid,
    }))
    page.value = c_page
    songList.value = videoList
  }
  catch (e) {
    // console.log(e)
  }
})

function getSongs(params) {
  sendMessage(
    'wbiApi',
    { api: 'getUserArc', params },
    'background',
  )
}

watch(() => PLstore.currentSinger, (mid) => {
  getSongs({ mid })
})
function handlePlayUser() {
  store.playList = songList.value
  store.play = songList.value[0]
}
</script>

<template>
  <section class="h-screen singer-detail">
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
    <div class="w-full px-20 py-2 flex gap-6 items-center">
      <div class="text-lg font-bold">
        投稿作品
      </div>
      <div class="text-[16px] font-bold bg-yellow px-3 py-2" @click="handlePlayUser">
        播放全部
      </div>
      <div>
        <div class="text-lg font-bold">
          {{ page.count }}
        </div>
        <div class="text-sm">
          首歌曲
        </div>
      </div>
      <!-- 翻页 带图标 -->
      <div class="flex gap-3">
        <div
          class="text-lg cursor-pointer"
          @click="getSongs({ mid: PLstore.currentSinger, pn: page.pn - 1 })"
        >
          上一页
        </div>
        <div
          class="text-lg cursor-pointer"
          @click="getSongs({ mid: PLstore.currentSinger, pn: page.pn + 1 })"
        >
          下一页
        </div>
      </div>
      <!-- 搜索 -->
      <div class="flex gap-3">
        <input
          v-model="keyword"
          bg="$eno-content focus:$eno-content-hover"
          type="text" class="w-40 h-10 border-2 border-gray-200 rounded-2 bg-opacity-0"
        >
        <div class="text-lg cursor-pointer" @click="getSongs({ mid: PLstore.currentSinger, keyword })">
          搜索
        </div>
      </div>
    </div>
    <!-- 歌曲滚动区域 -->
    <div class="h-full overflow-auto px-20">
      <div class="pb-30 flex flex-col gap-3">
        <SongItem v-for="song in songList" :key="song.id" :song="song" />
      </div>
    </div>
  </section>
</template>

<style>
.singer-detail {
  display: grid;
  grid-template-rows: 25vh 50px 1fr;
}
</style>
