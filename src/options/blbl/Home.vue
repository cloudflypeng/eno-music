<!-- eslint-disable no-console -->
<script setup>
import { onMounted } from 'vue'
import { useBlblStore } from './store'
import Rank from './rank.vue'

const store = useBlblStore()
const scrollRef = ref(null)

onMounted(() => {
  store.getHitList()
})
function handleDetail(music) {
  store.currentHit = music
  store.getHitDetailList(music.menuId)
  store.mode = 'hitDetail'
}
function scroll(type) {
  const el = scrollRef.value
  if (type === 'left') {
    el.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }
  else if (type === 'right') {
    el.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }
}
</script>

<template>
  <section w-full>
    <!-- 歌单部分 -->
    <h5 text-2xl py-5 text-left>
      热门歌单
    </h5>
    <section
      pos="relative"
      w-full
    >
      <div z-1>
        <div
          class="bg-[rgba(0,0,0,0.5)] translate-y--1/2"
          pos="absolute left-0 top-[40%]"
          p-1 flex items-center rounded-full
          @click.stop="scroll('left')"
        >
          <div text-5xl class="i-tabler:arrow-badge-left-filled w-1em h-1em" />
        </div>
        <div
          class="bg-[rgba(0,0,0,0.5)] translate-y--1/2"
          pos="absolute right-0 top-[40%]"
          p-1 flex items-center rounded-full
          @click.stop="scroll('right')"
        >
          <div text-5xl class="i-tabler:arrow-badge-right-filled w-1em h-1em" />
        </div>
      </div>
      <div
        ref="scrollRef"
        class="w-[calc(100vw-15rem)]"
        flex
        overflow-auto
        gap-10
        snap-x
        p="x-15"
      >
        <div
          v-for="music in store.hitList"
          :key="music.menuid"
          w-50
          shrink-0
          h-60
          snap-center
          @click="handleDetail(music)"
        >
          <img
            w-50 h-50
            rounded-xl
            cursor-pointer
            :src="music.cover"
          >
          <div opacity-70>
            {{ music.title }}
          </div>
        </div>
      </div>
    </section>
    <h5 text-2xl py-5 text-left>
      精选榜单
    </h5>
    <!-- <Rank /> -->
  </section>
</template>
