<script setup>
import { useBlblStore } from './store'
import { useApiClient } from '~/composables/api'

const api = useApiClient()

const store = useBlblStore()

function play(music) {
  store.currentHit = music
  api.blbl.getSong({
    sid: music.id,
  }).then((res) => {
    store.play = {
      ...music,
      url: res.data.cdns[0],
    }
  })
}
</script>

<template>
  <section>
    <!-- 歌单部分 -->
    <section
      flex
      flex-col
      flex-wrap
      gap-3
    >
      <div
        v-for="music in store.currentHit.list"
        :key="music.id"
        flex
        gap-3
        @click="play(music)"
      >
        <img
          w-12 h-12
          transition-all
          transition-duration-300
          hover:transform-translate-y--2 :src="music.cover"
        >
        <div>{{ music.title }}</div>
        <div>{{ music.author }}</div>
      </div>
    </section>
  </section>
</template>
