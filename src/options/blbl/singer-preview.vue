<script setup>
import { onMounted, ref, watch } from 'vue'
import { usePlaylistStore } from '../playlist/store'
import { getUserArc } from '../api'
import { useBlblStore } from './store'

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
</script>

<template>
  <div v-if="songList.length" mt-10>
    <h5 text="3xl $eno-text-1 fw-600" class="py-5 text-left px-10 flex items-end gap-3">
      {{ singer.name }}
    </h5>
    <div overflow-auto class="w-full h-55 relative">
      <div class="absolute w-full h-full flex gap-5 px-10">
        <div v-for="song in songList" :key="song.id" class="cursor-pointer flex-shrink-0" @click="handleClick(song)">
          <img :src="song.cover" class=" h-40 object-cover">
          <div>
            {{ song.title }}
          </div>
          <div>
            {{ song.author }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
