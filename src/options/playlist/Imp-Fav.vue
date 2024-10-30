<script setup>
import { cloneDeep } from 'lodash'
import SongItem from '~/options/components/SongItem.vue'
import { usePlaylistStore } from '~/options/playlist/store'
import { getSeasonInfo } from '~/options/api/index'
import Dialog from '~/components/dialog/index.vue'
import { useApiClient } from '~/composables/api'

const api = useApiClient()
const PLStore = usePlaylistStore()

function getFid(url) {
  // https://space.bilibili.com/184327681/favlist?fid=1849509281&ftype=create
  return url.match(/fid=(\d+)/)[1]
}
function getSid(url) {
// https://space.bilibili.com/3493093607213343/channel/collectiondetail?sid=1657149
  return url.match(/sid=(\d+)/)[1]
}

const season = reactive({
  open: false,
  url: '',
  mediaInfo: {},
  mediaSong: [],
})

async function handleSearchSeason() {
  if (!season.url)
    return
  const season_id = getSid(season.url)
  const res = await getSeasonInfo({ season_id, page_size: 100 })
  const { meta, archives } = res.data

  season.mediaInfo = {
    title: meta.name,
  }
  season.mediaSong = archives.map((element) => {
    return {
      title: element.title,
      description: element.desc,
      eno_song_type: 'bvid',
      cover: element.pic,
      duration: element.duration,
      id: element.bvid || element.bv_id,
      bvid: element.bvid || element.bv_id,
    }
  })
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
watch(() => season.open, () => {
  if (!season.open) {
    season.url = ''
    // reset
    season.mediaSong = []
    season.mediaInfo = {}
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
      eno_song_type: 'bvid',
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
function addNewSeasonPlayList() {
  if (!season.mediaSong.length)
    return
  PLStore.createPlaylist(season.mediaInfo.title, cloneDeep(season.mediaSong))
  season.open = false
}
</script>

<template>
  <div class="flex gap-3">
    <button class="bg-yellow px-3 py-1 mb-5 text-xl text-black font-bold" @click.stop="open = true">
      导入收藏夹
    </button>
    <button class="bg-yellow px-3 py-1 mb-5 text-xl text-black font-bold" @click.stop="season.open = true">
      导入合集
    </button>
    <Dialog :open="open" title="解析公共收藏夹" @visible-change="v => open = v">
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <input
            v-model="url" type="text" bg="$eno-fill-dark-1 focus:$eno-content-hover"
            class="w-full px-4 py-2 rounded-4" focus:outline-none focus:shadow-outline placeholder="收藏夹链接"
            @keyup.enter="handleSearch"
          >
          <button class="btn-primary w-20" @click="handleSearch">
            解析
          </button>
        </div>
        <!-- 歌曲列表 -->
        <div class="flex-1 overflow-auto">
          <SongItem
            v-for="song in mediaSong" :key="song.id" :song="song" del size="mini" :later="false" :star="false"
            @delete-song="mediaSong = mediaSong.filter(s => s.id !== song.id)"
          />
        </div>
      </div>
      <template #footer>
        <button class="w-full btn-primary" @click="addNewPlayList">
          添加为歌单
        </button>
      </template>
    </Dialog>
    <Dialog :open="season.open" title="解析合集列表" @visible-change="v => season.open = v">
      <div class="flex flex-col gap-3">
        <div class="flex gap-3">
          <input
            v-model="season.url" type="text" bg="$eno-fill-dark-1 focus:$eno-content-hover"
            class="w-full px-4 py-2 rounded-4" focus:outline-none focus:shadow-outline placeholder="合集链接"
            @keyup.enter="handleSearchSeason"
          >
          <button class="btn-primary w-20" @click="handleSearchSeason">
            解析
          </button>
        </div>
        <!-- 歌曲列表 -->
        <div class="flex-1 overflow-auto">
          <SongItem
            v-for="song in season.mediaSong" :key="song.id" :song="song" del size="mini" :later="false" :star="false"
            @delete-song="season.mediaSong = season.mediaSong.filter(s => s.id !== song.id)"
          />
        </div>
      </div>
      <template #footer>
        <button class="w-full btn-primary" @click="addNewSeasonPlayList">
          添加为歌单
        </button>
      </template>
    </Dialog>
  </div>
</template>
