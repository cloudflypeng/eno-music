<script setup>
import { onMounted } from 'vue'
import { useBlblStore } from './store'
import RankItem from './rank-item.vue'

const store = useBlblStore()

onMounted(() => {
  store.getrankList()
})
</script>

<template>
  <section>
    <div v-for="rank in store.rankList" :key="rank.name">
      <h2 text-2xl>
        {{ rank.name }}
      </h2>
      <div
        flex
        flex-wrap
        gap-8
        w-full
        h-full
      >
        <RankItem v-for="item in rank.list" :id="item.ID" :key="item.ID" />
      </div>
    </div>
  </section>
</template>
