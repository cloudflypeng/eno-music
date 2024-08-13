<script setup>
import { onMounted } from 'vue'
import { useBlblStore } from './store'
import { formatTime } from '~/utils/index.js'

const store = useBlblStore()

onMounted(() => {
  store.getrankList()
})
</script>

<template>
  <h5 text="2xl $eno-text-1" fw-600 px-10 text-left>
    精选榜单
  </h5>
  <section grid w-full class="grid-cols-1 md:grid-cols-3 gap-8 p-10">
    <div v-for="rank in store.rankList" :key="rank.statistic.sid" flex flex-col text-left>
      <h5 text="lg $eno-text-2" pb-3>
        {{ rank.title }}
      </h5>
      <!-- <img :src="rank.cover" alt="cover" w-30> -->
      <div v-for="audio in rank.audios" :key="audio.id" pt-3 @click.stop="store.play = audio">
        <div truncate text="sm $eno-text-1">
          {{ audio.title }}
        </div>
        <span text-xs pl-3 text="$eno-text-3">{{ formatTime(audio.duration) }}</span>
      </div>
    </div>
  </section>
</template>
