<script setup>
import { useBlblStore } from '../blbl/store'
import { defaultSingers, usePlaylistStore } from './store'

const store = useBlblStore()
const PLstore = usePlaylistStore()
onMounted(() => {
  PLstore.fetchSingerInfoList()
})
function avatar(id) {
  const info = PLstore.singerCardCache[id]
  if (!info)
    return ''
  return info?.face || ''
}
function name(id) {
  const info = PLstore.singerCardCache[id]
  if (!info)
    return ''
  return info?.name || ''
}
function desc(id) {
  const info = PLstore.singerCardCache[id]
  if (!info)
    return ''
  // condition,
  const { name } = info.nameplate
  return `${name}`
}
function handleSingerDetail(singerMid) {
  store.mode = 'singerDetail'
  PLstore.currentSinger = singerMid
}
</script>

<template>
  <section>
    <div class="text-3xl my-10 mx-20">
      推荐
    </div>
    <div class="flex gap-10 px-20">
      <div
        v-for="singerMid in defaultSingers"
        :key="singerMid"
        class="flex flex-col justify-center items-center"
        @click.stop="handleSingerDetail(singerMid)"
      >
        <img
          :src="avatar(singerMid)" alt="singerAvatar"
          class="w-40 h-40 rounded-full border-2 border-gray-200 cursor-pointer"
        >
        <div>{{ name(singerMid) }}</div>
        <div>{{ desc(singerMid) }}</div>
      </div>
    </div>
  </section>
</template>
