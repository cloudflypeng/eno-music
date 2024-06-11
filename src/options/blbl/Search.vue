<script setup>
import { useBlblStore } from '../blbl/store.js'
import { usePlaylistStore } from '../playlist/store.ts'
import { useApiClient } from '~/composables/api'

// import { compliteSong } from '~/utils/index'

const store = useBlblStore()
const PLStore = usePlaylistStore()

const api = useApiClient()
const keyword = ref('')
const result = ref([])

async function getUrl(item) {
  const { cid } = await api.blbl.getVideoInfo({
    bvid: item.bvid,
  }).then(res => res.data)
  const url = await api.blbl.getAudioOfVideo({
    cid,
    bvid: item.bvid,
  }).then(res => res.data.dash.audio[0].baseUrl)

  return {
    ...item,
    url,
  }
}

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
async function handlePlay(item) {
  const newPlay = await getUrl(item)

  store.play = newPlay
  store.playList.push(newPlay)
}
async function addSong(item) {
  const newPlay = await getUrl(item)
  PLStore.startAddSong(newPlay)
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
        class="flex flex-col w-40 h-40 grow-1 relative"
        @click="handlePlay(item)"
      >
        <div
          absolute top-0 left-0 text-lg cursor-pointer
          rounded-tl-lg p-1
          class="bg-[rgba(0,0,0,0.5)]"
          @click.stop="addSong(item)"
        >
          <div
            class="i-mingcute:add-fill"
          />
        </div>
        <img w-full h-25 object-cover :src="item.cover" rounded-2 cursor-pointer>
        <div text-xs line-clamp-2 class="text-center text-sm mt-2 cursor-pointer" v-html="item.title" />
      </div>
    </div>
  </section>
</template>
