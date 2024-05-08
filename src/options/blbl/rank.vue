<script setup>
import { onMounted } from 'vue'
import { useBlblStore } from './store'
import RankItem from './rank-item.vue'

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
  <section flex w-full>
    <div
      v-for="rank in store.rankList"
      :key="rank.statistic.sid"
      w-50 flex flex-col text-left
    >
      <h5>{{ rank.title }}</h5>
      <img :src="rank.cover" alt="cover" w-30 @click="() => { handleDetail(rank) }">
      <div v-for="audio in rank.audios" :key="audio.id">
        <span>{{ audio.title }}</span>
      </div>
    </div>
  </section>
</template>
