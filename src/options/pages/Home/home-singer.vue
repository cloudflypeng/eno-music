<script setup>
import { usePlaylistStore } from '../../playlist/store'
import SingerCard from '../../components/SingerCard.vue'

const PLstore = usePlaylistStore()
const singerScroll = ref(null)

function handleScroll(offset) {
  singerScroll.value.scrollTo({
    left: singerScroll.value.scrollLeft + offset,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div mt-10>
    <div class="relative">
      <h5 text="3xl $eno-text-1 fw-600" class="py-5 text-left px-10 flex items-end gap-3 ">
        关注歌手
      </h5>
      <!-- 增加左右滚动点击 -->
      <div class="flex items-center gap-2 absolute right-10 top-1/2">
        <div class="bg-$eno-fill-4 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:opacity-70" @click="handleScroll(-600)">
          <div class="i-mingcute:arrow-left-fill w-4" />
        </div>
        <div class="bg-$eno-fill-4 rounded-full w-7 h-7 flex items-center justify-center cursor-pointer hover:opacity-70" @click="handleScroll(600)">
          <div class="i-mingcute:arrow-right-fill w-4" />
        </div>
      </div>
    </div>

    <div ref="singerScroll" overflow-auto class="w-full h-55 relative">
      <div class="absolute w-full h-full flex gap-5 px-10">
        <div v-for="singer in PLstore.singers" :key="singer.mid" class="cursor-pointer w-40 flex-shrink-0">
          <SingerCard :singer-mid="singer" shape="square" :border="false" />
        </div>
      </div>
    </div>
  </div>
</template>
