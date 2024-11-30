<script lang="ts" setup>
import type { song } from '~/options/playlist/store'
import { useApiClient } from '~/composables/api'
import SongItem from '~/options/components/SongItem.vue'

import { useBlblStore } from '~/options/blbl/store'

const props = defineProps<{
  fav: fav
}>()

const store = useBlblStore()
const api = useApiClient()
const pn = ref(1)
const mediaSong = ref<song[]>([])
const status = reactive({
  loading: false,
  error: false,
  open: false,
})

interface fav {
  attr: number
  fav_state: number
  fid: number
  id: number
  mid: number
  title: string
}
async function handleClick() {
  if (status.open) {
    status.open = false
    return
  }
  if (mediaSong.value.length > 0) {
    status.open = !status.open
    return
  }
  status.loading = true
  status.open = true
  getFavDataLoop()
}

async function getFavDataLoop() {
  const res = await api.blbl.getFavInfo({
    media_id: props.fav.id,
    pn: pn.value,
  })

  const { info, medias } = res.data

  if (!Array.isArray(medias)) {
    return
  }

  medias.forEach((element) => {
    mediaSong.value.push({
      title: element.title,
      description: element.intro,
      eno_song_type: 'bvid',
      cover: element.cover,
      author: element.upper.name,
      duration: element.duration,
      id: element.bvid || element.bv_id,
      bvid: element.bvid || element.bv_id,
    })
  })

  if (mediaSong.value.length < info.media_count) {
    pn.value++
    getFavDataLoop()
  }
}
function handleReplacePlaylist() {
  store.play = mediaSong.value[0]
  store.playList = mediaSong.value
}
</script>

<template>
  <div
    class="mb-5 has-border"
    rounded-lg
    transition-200
    bg="$eno-content hover:$eno-content-hover"
  >
    <div
      class="w-full flex justify-between"
      p="x-4 y-3"
      @click="handleClick"
    >
      <div class="flex items-center gap-3 text-[22px]">
        <div :class="`w-1em h-1em ${status.open ? 'i-mingcute:folder-open-2-fill' : 'i-mingcute:folder-fill'}`" />
        <h2 class="max-w-[50vw] truncate" text-lg v-html="props.fav.title" />
      </div>
      <div class="flex gap-3" all:transition-200>
        <div
          class="i-mingcute:play-circle-line" text-xl cursor-pointer
          color="gray hover:gray-50"
          @click.stop="handleReplacePlaylist"
        />
      </div>
    </div>
    <div v-if="mediaSong.length > 0 && status.open" class="flex flex-col gap-2 max-h-[500px] overflow-auto" p="x-4 y-3">
      <SongItem v-for="song in mediaSong" :key="song.id" :song="song" />
    </div>
  </div>
</template>
