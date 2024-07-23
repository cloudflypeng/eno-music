<script setup>
import { computed, onMounted, ref } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import cn from 'classnames'
import { useBlblStore } from '../blbl/store.js'
import { usePlaylistStore } from '../playlist/store.ts'
import { useApiClient } from '~/composables/api'

const scrollRef = ref(null)
const pageNum = ref(1)

const store = useBlblStore()
const PLStore = usePlaylistStore()

const api = useApiClient()
const keyword = ref('')
const result = ref([])
const isLoading = ref(false)

// 滚动加载
useInfiniteScroll(
  scrollRef,
  async () => {
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
  pageNum.value = 0
  result.value = []
  const newList = await getMoreData()
  result.value = newList
}
</script>

<template>
  <section
    w-full h-screen overflow-auto flex flex-col
    justify-center items-center relative
  >
    <div w-100 relative color="$eno-text-1" my-10>
      <input
        id="search"
        v-model="keyword"
        type="text"
        bg="$eno-content focus:$eno-content-hover"
        focus:outline-none focus:shadow-outline
        :class="cn('w-full px-4 py-2 rounded-lg', { 'animated-gradient': isLoading })"
        placeholder="bilibili music search"
        @keyup.enter="handleSearch"
      >
      <div
        absolute right-2 text-xl class="i-tabler:search w-1em h-1em top-[50%] translate-y--1/2"
        @click="handleSearch"
      />
    </div>
    <!-- 搜索结果 -->
    <div
      v-if="result.length"
      ref="scrollRef"
      grow-1
      class="h-[calc(100%-30rem)]"
      w-full overflow-auto flex flex-wrap gap-8 justify-between
      mt-4 px-20 pb-30
    >
      <!-- 背景图 -->
      <div
        v-for="item in result"
        :key="item.bvid"
        class="flex flex-col w-40 h-50 p-2 relative group"
        hover:bg="$eno-fill-2"
        rounded-lg
        @click="store.startPlay(item)"
      >
        <div
          absolute top-0 left-0 text-lg cursor-pointer
          rounded-tl-lg p-1
          opacity-0
          z-2
          transition="all duration-200 ease-in-out"
          class="bg-[rgba(0,0,0,0.5)]"
          group-hover:opacity-100
          @click.stop="PLStore.startAddSong(item)"
        >
          <div
            class="i-mingcute:add-fill"
          />
        </div>
        <div
          rounded-lg cursor-pointer
          overflow-hidden
          relative
        >
          <img
            w-full aspect-ratio-1 object-cover
            opacity-80
            group-hover:opacity-70
            :src="item.cover"
          >
          <div
            absolute
            z-10
            opacity-0
            group-hover:opacity-100
            transition="all duration-200 ease-in-out"
            class="i-mingcute:play-circle-line
            top-[50%]
            left-[50%]
            transform-translate-x-[-50%]
            transform-translate-y-[-50%] text-15"
          />
        </div>
        <div
          text-xs line-clamp-2 truncate text-left
          w-full text-wrap opacity-90
          class="text-sm mt-2 cursor-pointer"
          v-html="item.title"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.animated-gradient {
    color: black;
    background: linear-gradient(90deg, #ffffffaa, #000);
    background-size: 200% 200%;
    animation: 1s linear 1s infinite alternate gradient-animation;
}

@keyframes gradient-animation {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%;}
}
</style>
