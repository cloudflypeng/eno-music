<script setup>
import { useBlblStore } from '../blbl/store.js'
import { useApiClient } from '~/composables/api'

const store = useBlblStore()

const api = useApiClient()
const keyword = ref('')
const result = ref([])

function handleSearch() {
  api.blbl.search({
    keyword: keyword.value,
  }).then((res) => {
    result.value = res.data.result.map((item) => {
      return {
        id: item.id,
        cover: `http:${item.pic}`,
        title: item.title,
        description: item.description,
        author: item.author,
        duration: item.duration,
        bvid: item.bvid,
      }
    })
  })
}
function handlePlay(item) {
  api.blbl.getVideoInfo({
    bvid: item.bvid,
  }).then((res) => {
    const cid = res.data.cid
    api.blbl.getAudioOfVideo({
      cid,
      bvid: item.bvid,
    }).then((urlObj) => {
      const url = urlObj.data.dash.audio[0].baseUrl
      store.play = {
        ...item,
        url,
      }
      store.playList.push({
        ...item,
        url,
      })
    })
  })
}
</script>

<template>
  <section w-full h-screen overflow-auto flex flex-col justify-center items-center>
    <div w-100 relative color-warmgray my-10>
      <input
        v-model="keyword"
        type="text" bg-gray-800
        focus:bg-gray-700
        class="w-full px-4 py-2 rounded-lg
        focus:outline-none focus:shadow-outline"
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
      grow-1
      class="h-[calc(100%-30rem)]"
      w-full overflow-auto flex flex-wrap gap-8 mt-4 px-20 pb-30
    >
      <div
        v-for="item in result"
        :key="item.bvid"
        grow-1
        w-40
        h-40 class="flex flex-col"
        @click="handlePlay(item)"
      >
        <img w-full h-25 object-cover :src="item.cover" rounded-2>
        <div text-xs line-clamp-2 class="text-center text-sm mt-2" v-html="item.title" />
      </div>
    </div>
  </section>
</template>
