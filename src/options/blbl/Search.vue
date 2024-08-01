<script setup>
import { computed, onMounted, ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import cn from 'classnames'
import SongItem from '../components/SongItem.vue'
import { useApiClient } from '~/composables/api'
import Loading from '~/components/loading/index.vue'

const scrollRef = ref(null)
const pageNum = ref(1)

const api = useApiClient()
const keyword = ref('')
const result = ref([])
const isLoading = ref(false)
// 单个搜索结果过少时不触发滚动加载
const enableScrollGetMore = ref(true)

function isUrl(url) {
  return /bilibili.com/.test(url)
}
// 滚动加载
useInfiniteScroll(
  scrollRef,
  async () => {
    if (!enableScrollGetMore.value)
      return
    const moreData = await getMoreData()
    result.value = result.value.concat(moreData)
  },
  { distance: 10 },
)
// 加载函数
async function getMoreData() {
  isLoading.value = true
  pageNum.value++
  const res = await api.blbl.search({
    keyword: keyword.value,
    page: pageNum.value,
  })
  isLoading.value = false

  return res.data.result.map((item) => {
    return {
      id: item.id,
      enu_song_type: 'bvid',
      cover: `http:${item.pic}`,
      title: item.title,
      description: item.description,
      author: item.author,
      duration: item.duration,
      bvid: item.bvid,
    }
  })
}
// 搜索
async function handleSearch() {
  enableScrollGetMore.value = true
  if (isUrl(keyword.value)) {
    const bvid = keyword.value.match(/BV([a-zA-Z0-9]+)/)[0]
    // 获取对应的歌曲
    const data = await api.blbl.getVideoInfo({
      bvid,
    }).then(res => res.data)

    const searchSong = {
      id: data.id,
      enu_song_type: 'bvid',
      cover: data.pic,
      title: data.title,
      description: data.description,
    }

    result.value = [searchSong]
    enableScrollGetMore.value = false
  }
  else {
    pageNum.value = 0
    result.value = []
    const newList = await getMoreData()
    result.value = newList
  }
}
</script>

<template>
  <section
    w-full h-screen overflow-auto flex flex-col
    justify-center items-center relative
  >
    <div w-100 relative flex gap-3 color="$eno-text-1">
      <input
        id="search"
        v-model="keyword"
        type="text"
        bg="$eno-content focus:$eno-content-hover"
        focus:outline-none focus:shadow-outline
        :class="cn('w-full px-4 py-2 rounded-lg')"
        placeholder="关键字 或 原视频链接"
        @keyup.enter="handleSearch"
      >
      <!-- <div
        absolute right-2 text-xl class="i-tabler:search w-1em h-1em top-[50%] translate-y--1/2"
        @click="handleSearch"
      /> -->
      <Loading v-if="isLoading" />
    </div>
    <!-- 搜索结果 -->
    <div
      v-if="result.length"
      ref="scrollRef"
      class="h-[calc(100vh-10rem)]"
      w-full overflow-auto
      mt-4 px-20 pb-30
    >
      <SongItem v-for="item in result" :key="item.bvid" :song="item" />
    </div>
  </section>
</template>
