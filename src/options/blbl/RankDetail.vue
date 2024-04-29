<!-- eslint-disable no-console -->
<script setup>
import { watch } from 'vue'
import { useBlblStore } from './store.js'
import { useApiClient } from '~/composables/api'

const store = useBlblStore()
const api = useApiClient()

watch(() =>
  store.currentRank.ID, (id) => {
  api.blbl.getRankDetailList({ list_id: id }).then((res) => {
    store.rankDetailList = res.data.list.filter(music => music.can_listen)
    store.rankDetailList.forEach((music) => {
      api.blbl.getSongDetail({ sid: music.creation_aid }).then((res) => {
        if (res.data.code === 0)
          console.log('success :>> ', music.creation_aid)
      })
    })
  })
})
</script>

<template>
  <div
    flex
    gap-1
    flex-col
  >
    <div pos-fixed top-10 text-2xl bg-blue @click="store.mode = 'rank'">
      返回
    </div>
    <div
      v-for="music in store.rankDetailList"
      :key="music.creation_aid"
      flex
      gap-2
    >
      <img w-20 h-20 :src="music.mv_cover">
      <!-- <img w-20 h-20 :src="music.creation_cover"> -->
      <span>
        <div>{{ music.music_title }}</div>
        <span>{{ music.singer }}</span>
      </span>

      <!-- <span>{{ music.creation_bvid }}</span> -->
    </div>
  </div>
</template>
