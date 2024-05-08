<script setup>
import { onMounted } from 'vue'
import { useBlblStore } from './store'
import { formatTime } from '~/utils/index.js'

const store = useBlblStore()

onMounted(() => {
  store.getrankList()
})
function handleDetail(music) {
  store.currentHit = music
  store.getHitDetailList(music.menuId)
  store.mode = 'hitDetail'
}
</script>

<template>
  <section grid w-full class="grid-cols-1 md:grid-cols-3 gap-8 ">
    <div
      v-for="rank in store.rankList"
      :key="rank.statistic.sid"
      flex flex-col text-left
      cursor-pointer
      @click.stop="handleDetail(rank)"
    >
      <h5 text-lg pb-3>
        {{ rank.title }}
      </h5>
      <!-- <img :src="rank.cover" alt="cover" w-30> -->
      <div
        v-for="audio in rank.audios" :key="audio.id" pt-3
        @click.stop="store.play = audio"
      >
        <div truncate text-sm>
          {{ audio.title }}
        </div>
        <span text-xs pl-3>{{ formatTime(audio.duration) }}</span>
      </div>
    </div>
  </section>
</template>
