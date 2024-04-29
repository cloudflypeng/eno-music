<!-- eslint-disable no-console -->
<script setup>
import { onMounted } from 'vue'
import { useBlblStore } from './store'

const store = useBlblStore()

onMounted(() => {
  store.getHitList()
})
function handleDetail(music) {
  console.log('music :>> ', music)
  store.currentHit = music
  store.getHitDetailList(music.menuId)
  store.mode = 'hitDetail'
}
</script>

<template>
  <section>
    <!-- 歌单部分 -->
    <section
      flex
      flex-wrap
      gap-3
    >
      <div
        v-for="music in store.hitList"
        :key="music.menuid"
        w-30
        h-40
        @click="handleDetail(music)"
      >
        <img
          w-30 h-30
          transition-all
          transition-duration-300
          hover:transform-translate-y--2 :src="music.cover"
        >
        <div>{{ music.title }}</div>
      </div>
    </section>
  </section>
</template>
