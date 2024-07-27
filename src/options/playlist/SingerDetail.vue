<script setup>
import { onMessage, sendMessage } from 'webext-bridge/options'
import { useInfiniteScroll } from '@vueuse/core'
import { useBlblStore } from '../blbl/store.js'
import SongItem from '../components/SongItem.vue'
import { defaultSingers, usePlaylistStore } from './store'
import Loading from '~/components/loading/index.vue'

const PLstore = usePlaylistStore()
const store = useBlblStore()

const info = computed(() => {
  return PLstore.singerCardCache[PLstore.currentSinger]
})

const songListByPage = ref({})
const renderList = computed(() => {
  return Object.values(songListByPage.value).flat()
})

const loading = ref(false)
const keyword = ref('')
const page = ref({
  pn: 1,
  ps: 25,
  count: 0,
})
const scrollRef = ref(null)

// 滚动加载
useInfiniteScroll(
  scrollRef,
  async () => {
    if (page.value.pn * page.value.ps >= page.value.count)
      return
    getSongs({ mid: PLstore.currentSinger, pn: page.value.pn + 1 })
  },
  { distance: 50 },
)

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

    songListByPage.value[c_page.pn] = videoList
  }
  catch (e) {
    // console.log(e)
    return e
  }
  finally {
    loading.value = false
  }
})

function getSongs(params) {
  loading.value = true
  sendMessage(
    'wbiApi',
    { api: 'getUserArc', params },
    'background',
  )
}

watch(() => PLstore.currentSinger, (mid) => {
  songListByPage.value = {}
  getSongs({ mid })
})
function handlePlayUser() {
  store.playList = renderList.value
  store.play = renderList.value[0]
}
</script>

<template>
  <section class="h-screen singer-detail">
    <!-- 信息界面 -->
    <div class="w-full bg-yellow bg-opacity-95 px-20 py-10 flex gap-6 relative">
      <div
        class="i-mingcute:square-arrow-left-line absolute top-5 left-5 text-4xl cursor-pointer"
        @click.stop="store.mode = 'singerList'"
      />
      <img :src="info?.face" class="h-[100%] object-contain rounded-full border-2 border-gray-200 cursor-pointer">
      <div class="flex flex-col-reverse">
        <div class="text-lg font-bold">
          {{ info?.nameplate?.name }}
        </div>
        <div class="text-sm">
          {{ info?.nameplate?.condition }}
        </div>
        <div class="text-2xl font-bold flex items-center gap-3">
          {{ info?.name }}
          <a :href="`https://space.bilibili.com/${PLstore.currentSinger}`" target="_blank">
            <div class="i-mingcute:link-line w-1em h-1em cursor-pointer" />
          </a>
          <!-- <div class="i-mingcute:share-3-line w-1em h-1em cursor-pointer" /> -->
        </div>
      </div>
    </div>
    <!-- 歌单界面 -->
    <div class="w-full px-20 py-2 flex gap-6 items-center">
      <div class="text-lg font-bold">
        投稿作品
      </div>
      <div class="text-[16px] font-bold bg-yellow px-2 py-1 cursor-pointer" @click="handlePlayUser">
        播放全部
      </div>
      <div class="flex items-center gap-3">
        <div class="text-lg font-bold">
          {{ page.count }}
        </div>
        <span class="text-[10px]">
          首歌曲
        </span>
      </div>
      <!-- 搜索 -->
      <div class="flex gap-3">
        <input
          v-model="keyword"
          placeholder="搜索歌曲"
          bg="$eno-content focus:$eno-content-hover"
          type="text"
          class="w-40 h-10 px-3 border-2 border-gray-200 rounded-2 bg-opacity-0 outline-none border-none"
          @keyup.enter="getSongs({ mid: PLstore.currentSinger, keyword })"
        >
      </div>
    </div>
    <!-- 歌曲滚动区域 -->
    <div ref="scrollRef" class="h-full overflow-auto px-20">
      <div class="pb-30 flex flex-col gap-3">
        <SongItem v-for="song in renderList" :key="song.id" :song="song" />
      </div>
      <Loading v-if="loading && !renderList.length" />
    </div>
  </section>
</template>

<style>
.singer-detail {
  display: grid;
  grid-template-rows: 25vh 50px 1fr;
}
</style>
