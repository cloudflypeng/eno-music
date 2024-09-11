<script setup>
import { usePlaylistStore } from '../playlist/store'
import SingerCard from '../components/SingerCard.vue'

const PLstore = usePlaylistStore()
</script>

<template>
  <div mt-10>
    <h5 text="3xl $eno-text-1 fw-600" class="py-5 text-left px-10 flex items-end gap-3">
      关注歌手
    </h5>
    <div overflow-auto class="w-full h-55 relative">
      <div class="absolute w-full h-full flex gap-5 px-10">
        <div v-for="singer in PLstore.singers" :key="singer.mid" class="cursor-pointer w-40 flex-shrink-0">
          <SingerCard :singer-mid="singer" shape="square" :border="false" />
        </div>
      </div>
    </div>
  </div>
</template>
