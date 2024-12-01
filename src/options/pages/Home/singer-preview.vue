<script setup>
import { onMounted, ref } from 'vue'
import { usePlaylistStore } from '../../playlist/store'
import { getUserArc } from '../../api'
import { useBlblStore } from '../../blbl/store'
import ScrollButton from './scroll-button.vue'

const props = defineProps({
  mid: {
    type: String,
    required: true,
  },
})

const PLstore = usePlaylistStore()
const store = useBlblStore()

const singer = computed(() => {
  return PLstore.singerCardCache[props.mid] || {}
})

const loading = ref(false)
const songList = ref([])
const scrollRef = ref(null)
onMounted(() => {
  loading.value = true
  getUserArc({ mid: props.mid }).then((res) => {
    const content = res.data
    const { list } = content
    const videoList = list.vlist.map(item => ({
      id: item.bvid,
      eno_song_type: 'bvid',
      cover: `${item.pic}`,
      title: item.title,
      description: item.description,
      author: item.author,
      duration: item.duration || 0, // 暂无
      bvid: item.bvid,
    }))
    songList.value = videoList
  })
})
function handleClick(song) {
  store.startPlay(song)
}

function handleScroll(offset) {
  scrollRef.value.scrollTo({
    left: scrollRef.value.scrollLeft + offset,
    behavior: 'smooth',
  })
}
</script>

<template>
  <div v-if="songList.length" mt-5>
    <h5 text="3xl $eno-text-1 fw-600" class="py-5 text-left px-10 flex items-end justify-between gap-3">
      {{ singer.name }}
      <ScrollButton :step="600" :handle-scroll="handleScroll" />
    </h5>
    <div :id="`singer-preview-${mid}`" ref="scrollRef" overflow-auto class="w-full h-48 relative">
      <div class="absolute w-full h-full flex gap-5 px-10">
        <div v-for="song in songList" :key="song.id" class="cursor-pointer h-45 flex-shrink-0 relative overflow-hidden scroll-group" @click="handleClick(song)">
          <img :src="song.cover" class="h-40 mb-5 object-cover">
          <div class="h-40 w-full flex flex justify-center items-center opacity-0 hover:opacity-100 bg-$eno-content bg-opacity-10 duration-300 transform" pos="absolute top-0 left-0">
            <div class="i-mingcute:play-circle-line w-4rem text-5xl" />
          </div>
          <div class="absolute top-41 truncate w-full scroll-text">
            {{ song.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scroll-text {
  white-space: nowrap;          /* 不换行 */
  overflow: hidden;             /* 隐藏超出部分 */
  text-overflow: ellipsis;      /* 使用省略号表示溢出文本 */
  transition: all 0.3s;         /* 平滑过渡效果 */
}

.scrollAnim {
  animation: scroll 5s linear infinite; /* 添加滚动动画 */
}

.scroll-group:hover .scroll-text {
  white-space: nowrap;
  overflow: visible;
  animation: scroll 5s linear infinite; /* 添加滚动动画 */
}

@keyframes scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
</style>
