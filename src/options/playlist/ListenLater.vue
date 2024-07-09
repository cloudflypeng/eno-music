<script setup>
import { cloneDeep } from 'lodash'
import { useBlblStore } from '../blbl/store'
import { usePlaylistStore } from './store'

const PLStore = usePlaylistStore()
const store = useBlblStore()

onMounted(() => {
  if (!PLStore.listenLater.length)
    PLStore.listenLater = []
})

// 单独播放一首歌
function handlePlaySong(song) {
  store.startPlay(song)
}
function handlePlayLater() {
  if (!PLStore.listenLater.length)
    return
  const playlist = cloneDeep(PLStore.listenLater)
  store.play = playlist[0]
  store.playList = playlist
}
function handleRemoveListenLater(song) {
  PLStore.listenLater = PLStore.listenLater.filter(item => item.id !== song.id)
}
</script>

<template>
  <div class="pb-30 px-20 flex flex-row gap-15 h-full">
    <div class="w-[300px] h-full pt-30 text-center flex flex-col">
      <div class="content flex flex-col gap-2">
        <div id="later-bg" class="w-[300px] h-[300px] mb-4">
          <div
            class="i-mingcute:bookmark-fill
            w-1em h-1em text-[200px] mt-[50px] ml-[50px]"
            absolute
          />
        </div>
        <div class="text-3xl flex justify-center items-center gap-3">
          稍后再听
          <div
            class="i-mingcute:play-circle-line w-1em h-1em"
            cursor-pointer
            @click.stop="handlePlayLater"
          />
        </div>
        <div opacity-75>
          总共{{ PLStore.listenLater?.length || 0 }}集
        </div>
        <div opacity-75>
          你已保存供日后观看的播客分集
        </div>
      </div>
    </div>
    <!-- 滚动区域 -->
    <div class="w-1/2 h-full overflow-auto pt-10">
      <div v-if="!PLStore.listenLater.length">
        暂无数据
      </div>
      <div class="content flex flex-col gap-3">
        <section
          v-for="item in PLStore.listenLater" :key="item.id"
          class="flex flex-row gap-4 px-3 py-2 hover:bg-$eno-fill-2
          rounded-4 cursor-pointer items-center max-w-[100%] song-later-item"
          @click.stop="handlePlaySong(item)"
        >
          <div class="w-[70px] flex-shrink-0">
            <img :src="item.cover" rounded-2 class="w-full h-full object-fit">
          </div>
          <div class="flex flex-col flex-1 gap-2 w-[calc(100%-150px)]">
            <div class="text-lg truncate" v-html="item.title" />
            <div class="text-xs opacity-75">
              {{ item.author }}
            </div>
          </div>
          <!-- 从列表中清除 -->
          <div
            class="i-mingcute:delete-2-line
             w-[30px] text-lg flex-shrink-0 hidden delicon"
            cursor-pointer

            @click.stop="handleRemoveListenLater(item)"
          />
        </section>
      </div>
    </div>
  </div>
</template>

<style>
/* 生成一个多点的淡紫色黄色的渐变 */
#later-bg{
  background-image: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}
.song-later-item:hover .delicon{
  display: block;
}
</style>
