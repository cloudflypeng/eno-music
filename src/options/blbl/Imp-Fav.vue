<script setup>
import { cloneDeep } from 'lodash'
import SongItem from '../components/SongItem.vue'
import { usePlaylistStore } from '../playlist/store'
import Dialog from '~/components/dialog/index.vue'
import { useApiClient } from '~/composables/api'

const api = useApiClient()
const PLStore = usePlaylistStore()

function getFid(url) {
  // https://space.bilibili.com/184327681/favlist?fid=1849509281&ftype=create
  return url.match(/fid=(\d+)/)[1]
}

const open = ref(false)
const url = ref('')
const mediaInfo = ref({})
const mediaSong = ref([])
const pn = ref(1)

function reset() {
  mediaSong.value = []
  pn.value = 1
}

watch(() => open.value, () => {
  reset()
  if (!open.value) {
    url.value = ''
  }
})

// 循环获取数据
async function getMoreData() {
  const res = await api.blbl.getFavInfo({
    media_id: getFid(url.value),
    pn: pn.value,
  })

  const { info, medias } = res.data

  if (!Array.isArray(medias)) {
    return
  }
  mediaInfo.value = info
  medias.forEach((element) => {
    mediaSong.value.push({
      title: element.title,
      description: element.intro,
      enu_song_type: 'bvid',
      cover: element.cover,
      author: element.upper.name,
      duration: element.duration,
      id: element.bvid || element.bv_id,
      bvid: element.bvid || element.bv_id,
    })
  })

  if (mediaSong.value.length < info.media_count) {
    pn.value++
    getMoreData()
  }
}

function handleSearch() {
  if (!url.value)
    return
  reset()

  getMoreData()
}
function addNewPlayList() {
  if (!mediaSong.value.length)
    return
  PLStore.createPlaylist(mediaInfo.value.title, cloneDeep(mediaSong.value))
  open.value = false
}
</script>

<template>
  <div class="flex">
    <button class="bg-yellow px-3 py-1 mb-5 text-xl text-black font-bold" @click.stop="open = true">
      导入公开收藏夹
    </button>
    <Dialog :open="open" title="解析公共收藏夹" @visible-change="v => open = v">
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <input
            v-model="url"
            type="text"
            bg="$eno-fill-dark-1 focus:$eno-content-hover"
            class="w-full px-4 py-2 rounded-4"
            focus:outline-none focus:shadow-outline
            placeholder="收藏夹链接"
            @keyup.enter="handleSearch"
          >
          <button class="w-20 h-10 bg-$eno-fill-2 text-white rounded-4 cursor-pointer" @click="handleSearch">
            解析
          </button>
        </div>

        <!-- 歌曲列表 -->
        <div class="flex-1 overflow-auto">
          <SongItem
            v-for="song in mediaSong"
            :key="song.id"
            :song="song"
            del
            size="mini"
            :later="false"
            :star="false"
            @delete-song="mediaSong = mediaSong.filter(s => s.id !== song.id)"
          />
        </div>
      </div>
      <template #footer>
        <button class="w-full h-10 bg-$eno-fill-2 text-white rounded-4" @click="addNewPlayList">
          添加为歌单
        </button>
      </template>
    </Dialog>
  </div>
</template>
