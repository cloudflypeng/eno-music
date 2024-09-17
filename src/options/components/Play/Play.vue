<script setup>
import { useFullscreen, useLocalStorage } from '@vueuse/core'
import { Howl } from 'howler'
import cn from 'classnames'
import SongItem from '../SongItem.vue'
import { useBlblStore } from '../../blbl/store'
import { usePlaylistStore } from '../../playlist/store.ts'
import LoopSwitch from './LoopSwitch.vue'
import useControl from './keys'
import { useApiClient } from '~/composables/api'
import Dialog from '~/components/dialog/index.vue'
import Drawer from '~/components/drawer/index.vue'
import { download } from '~/options/utils.ts'

const PLstore = usePlaylistStore()

const api = useApiClient()

function getUpUrl(obj) {
  const url1 = obj.baseUrl || ''
  const url2 = obj.backup_url?.[0] || ''
  const url3 = obj.backup_url?.[1] || ''

  // 找到第一个不是https://xy 开头的url
  const urlList = [url1, url2, url3].filter(url => !url.startsWith('https://xy'))
  return urlList[0] || url1
}

const store = useBlblStore()
const isPlaying = ref(false)
const showList = ref(false)
const historyList = ref([])
const progress = reactive({
  percent: 0,
  current: 0,
  total: 0,
})
const voice = useLocalStorage('voice', 1)
const isCloseVoice = ref(false)
const progressTimer = ref(null)
const isDragging = ref(false)

useControl({
  play: () => playControl(),
  forward: () => changeSeek(10),
  back: () => changeSeek(-10),
})

function changeSeek(number) {
  if (!store.play?.id)
    return
  store.howl.pause()

  progress.current = (progress.current + number + progress.total) % progress.total
  store.howl.seek(progress.current)

  store.howl.play()
}

function updateProgess() {
  if (!isDragging.value) {
    progress.current = store.howl.seek()
    progress.percent = progress.current / progress.total
  }
  if (store.howl.playing())
    requestAnimationFrame(updateProgess)
}

function initMusic() {
  const url = store.play.url
  // 重置进度
  progress.percent = 0
  progress.current = 0

  if (store.howl) {
    store.howl.stop()
    store.howl.unload()
  }

  // 判断当前歌曲是否在播放列表中，如果不在就插入，用于点击歌曲播放时防止 history 无法记录
  const index = store.playList.findIndex(({ id }) => id === store.play.id)
  if (index !== historyList.value.at(-1)) {
    historyList.value.push(index)
  }

  store.howl = new Howl({
    src: [url],
    html5: true,
    volume: 1,
    mute: false,
    onplay: () => {
      isPlaying.value = true
      progress.total = store.howl.duration()
      requestAnimationFrame(updateProgess)
    },
    onpause: () => {
      isPlaying.value = false
      clearInterval(progressTimer.value)
    },
    onend: () => {
      if (store.loopMode === 'single')
        initMusic()
      else change('next')
    },
  })
  store.howl.play()
  store.howl.volume(voice.value)
  isCloseVoice.value = store.howl.volume() === 0
}
async function getBvidUrl(item) {
  const { cid } = await api.blbl.getVideoInfo({
    bvid: item.bvid,
  }).then(res => res.data)

  const dash = await api.blbl.getAudioOfVideo({
    cid,
    bvid: item.bvid,
  }).then(res => res.data.dash)

  const url = getUpUrl(dash.audio[0])
  const video = getUpUrl(dash.video[0])

  return {
    ...item,
    url,
    video,
    dash,
  }
}
async function getCidUrl(item) {
  const dash = await api.blbl.getAudioOfVideo({
    cid: item.cid,
    bvid: item.bvid,
  }).then(res => res.data.dash)

  const url = getUpUrl(dash.audio[0])
  const video = getUpUrl(dash.video[0])

  return {
    ...item,
    url,
    video,
    dash,
  }
}
async function getSidUrl(item) {
  const url = await api.blbl.getSong({
    sid: item.id,
  }).then(res => res.data.cdns[0])

  return {
    ...item,
    url,
  }
}

// 监听歌曲切换
watch(() => store.play?.id, async () => {
  const currentSong = store.play
  const play = currentSong.eno_song_type === 'bvid'
    ? await getBvidUrl(currentSong)
    : currentSong.eno_song_type === 'cid'
      ? await getCidUrl(currentSong)
      : await getSidUrl(currentSong)
  store.play = play
  initMusic()
})
// 顺序切换
function change(type) {
  let index = historyList.value.at(-1) || 0
  const { playList, loopMode } = store

  if (loopMode === 'random') {
    if (type === 'next') {
      index = Math.floor(Math.random() * playList.length)
    }
    else if (type === 'prev') {
      // 移除最后两个，并播放上一个
      const remove = historyList.value.splice(-2)
      index = remove[0] || 0
    }
  }
  else {
    const currentLength = playList.length

    if (type === 'next')
      index = (index + 1) % currentLength
    else if (type === 'prev')
      index = (index - 1 + currentLength) % currentLength
  }

  historyList.value.push(index)
  store.play = playList[index]
}
function changeProgress(e) {
  // 如果当前没有歌曲,就返回
  if (!store.play?.id)
    return
  store.howl.seek(progress.total * e.target.value)
  isDragging.value = false
}

function toggleList() {
  showList.value = !showList.value
}

function deleteSong(index) {
  store.playList.splice(index, 1)
}

const displayData = computed(() => {
  return {
    title: store.play.title || '暂无歌曲',
  }
})

function playControl() {
  // 当前未播放，点击加载音乐
  if (!store.howl)
    return initMusic()

  if (isPlaying.value)
    store.howl.pause()
  else
    store.howl.play()
}
const timeDisplay = computed(() => {
  return {
    current: new Date(progress.current * 1000).toISOString().substr(14, 5) || '00:00',
    total: new Date(progress.total * 1000).toISOString().substr(14, 5) || '00:00',
  }
})
const progressTrans = computed(() => {
  return {
    transform: `translateX(${(1 - progress.percent) * -100}%)`,
  }
})
function handleChangeVoice(e) {
  store.howl.volume(e.target.value)
  voice.value = e.target.value
}
// 设置打开声音和静音
function setVoice() {
  if (isCloseVoice.value) {
    store.howl.volume(voice.value)
    isCloseVoice.value = false
  }
  else {
    store.howl.volume(0)
    isCloseVoice.value = true
  }
}
const fullScreenStatus = ref(false)
function fullScreenTheBody() {
  // 切换全屏状态
  if (document.fullscreenElement)
    document.exitFullscreen()
  else
    document.body.requestFullscreen()

  fullScreenStatus.value = document.fullscreenElement
}
function openBlTab() {
  window.open(`https://www.bilibili.com/video/${store.play.bvid}`)
}
// 视频页面相关
const dialogVideo = ref(false)
const videoShowPlaylist = ref(false)
function openDialogVideo() {
  dialogVideo.value = true
  // 设置视频进度
  syncVideo()
}
function syncVideo() {
  const video = document.getElementById('video-eno')
  if (video)
    video.currentTime = store.howl.seek()
}
const timer = ref(null)
watch(() => dialogVideo.value, (value) => {
  if (value) {
    timer.value = setInterval(() => {
      syncVideo()
    }, 1000)
  }
  else {
    clearInterval(timer.value)
  }
})

const videoBox = ref(null)
const { isFullscreen, toggle } = useFullscreen(videoBox)
</script>

<template>
  <!-- 增加一个背景图 -->
  <img v-if="store.play" :src="store.play.cover" class="absolute w-screen h-20 bottom-0 object-cover">
  <section
    class="bg-$eno-elevated w-screen h-20 px-6 flex z-10"
    style="backdrop-filter: var(--eno-filter-glass-light-1)" flex="row items-center justify-between"
    pos="fixed bottom-0 left-0" color-white gap-6 transform-gpu
  >
    <!-- 音乐进度 -->
    <div class="w-screen top-0 left-0 absolute h-[2px] bg-yellow" :style="progressTrans" />
    <!-- 音乐滑块 -->
    <input
      v-model="progress.percent" type="range" min="0" max="1" step="0.001"
      class="w-full absolute top-0 left-0 h-1 bg-$eno-fill-2 rounded-1 cursor-pointer play-progress"
      @input="isDragging = true" @change="changeProgress"
    >
    <!-- 音乐控制 -->
    <div flex flex-row items-center text-2xl gap-10 w-100>
      <div
        cursor-pointer class="i-tabler:player-track-prev-filled w-1em h-1em hover:opacity-50"
        @click.stop="change('prev')"
      />
      <div
        v-if="isPlaying" cursor-pointer text-3xl class="i-tabler:player-pause-filled w-1em h-1em hover:opacity-50"
        @click.stop="playControl"
      />
      <div
        v-else cursor-pointer text-3xl class="i-tabler:player-play-filled w-1em h-1em hover:opacity-50"
        @click.stop="playControl"
      />
      <div
        cursor-pointer class="i-tabler:player-track-next-filled w-1em h-1em hover:opacity-50"
        @click.stop="change('next')"
      />
      <LoopSwitch />
      <div text-xs>
        {{ timeDisplay.current }}/{{ timeDisplay.total }}
      </div>
    </div>
    <!-- 播放信息 -->
    <div
      flex flex-row items-center gap-4 text-left truncate rounded-2 backdrop-blur px-3 py-1
      class="bg-$eno-fill-dark-1 w-1/3 min-w-120 h-[calc(100%-16px)]"
    >
      <!-- 主要信息 -->
      <span
        v-if="store.play.cover"
        relative shrink-0 cursor-pointer
        class="group"
        @click.stop="openDialogVideo"
      >
        <img h-11 rounded-1 :src="store.play.cover">

        <div
          w-full h-full
          absolute top-0 left-0
          bg="black/30"
          justify-center items-center
          hidden
          group-hover:flex
        >
          <i i-mingcute:arrows-up-fill text-2xl color-gray-300 />
        </div>
      </span>
      <div truncate grow-1>
        <div v-html="displayData.title" />
        <span>{{ store.play.author }}{{ store.play.description }}</span>
      </div>
      <div flex gap-2 text-sm px-2>
        <div hidden class="i-mingcute:download-3-fill w-1em h-1em cursor-pointer" @click.stop="download(store.play)" />
        <div class="i-mingcute:star-fill w-1em h-1em cursor-pointer" @click.stop="PLstore.startAddSong(store.play)" />
        <div class="i-mingcute:information-fill w-1em h-1em cursor-pointer" @click.stop="openBlTab" />
      </div>
    </div>
    <!-- 其他 -->
    <div flex flex-row-reverse text-lg gap-5 w-100>
      <div
        v-if="fullScreenStatus" cursor-pointer class="i-mingcute:fullscreen-fill w-1em h-1em"
        @click.stop="fullScreenTheBody"
      />
      <div v-else cursor-pointer class="i-mingcute:fullscreen-exit-fill w-1em h-1em" @click.stop="fullScreenTheBody" />
      <div cursor-pointer class="i-tabler:playlist w-1em h-1em" @click="toggleList" />
      <Dialog :open="showList" title="播放列表" @visible-change="vis => showList = vis">
        <SongItem v-for="(song, index) in store.playList" :key="song.id" show-active del :song="song" size="mini" @delete-song="deleteSong(index)" />
      </Dialog>
      <div v-if="isCloseVoice" cursor-pointer class="i-mingcute:volume-mute-line w-1em h-1em" @click.stop="setVoice" />
      <div v-else cursor-pointer class="i-mingcute:volume-line w-1em h-1em" @click.stop="setVoice" />
      <input
        v-if="!isCloseVoice" id="voice-progress" v-model="voice" type="range" class="w-20" min="0" max="1"
        step="0.01" @change="handleChangeVoice"
      >
    </div>
    <Drawer :open="dialogVideo" :title="store.play.title" @visible-change="vis => dialogVideo = vis">
      <section ref="videoBox" class="w-full h-full flex justify-center gap-2 pt-6">
        <section
          relative h-full
          flex="~ col" rd-2
          overflow-hidden
          :class="!videoShowPlaylist && !isFullscreen ? 'w-80vw' : 'flex-1'"
        >
          <video
            id="video-eno" autoplay
            w-full h-full object-fill rd-2xl overflow-auto
            class="transItem"
            :src="store.play.video"
          />

          <div
            absolute bottom-0 left-0
            w-full flex justify-end gap-3
            text-2xl p-3
            bg="black/40"
          >
            <div
              class="i-mingcute:list-check-fill w-1em h-1em cursor-pointer"
              @click.stop="videoShowPlaylist = !videoShowPlaylist"
            />
            <div class="i-mingcute:fullscreen-2-fill w-1em h-1em cursor-pointer" @click.stop="toggle" />
          </div>
        </section>

        <div v-if="videoShowPlaylist" w="1/3" class="overflow-auto h-[calc(100vh-200px)] wrapper-scroll pb-10">
          <div v-for="song in store.playList" :key="song.id">
            <SongItem :song="song" size="mini" />
          </div>
        </div>
      </section>
    </Drawer>
  </section>
</template>

<style>
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-runnable-track {
  height: 2px;
  border-radius: 1px;
  border: none;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  margin-top: -6px;
  /* Thumb の位置を調整 */
  background-color: #4cabe2;
  border-radius: 50%;
}

input[type="range"]::-moz-range-track {
  opacity: 0.5;
  background: yellow;
  height: 2px;
  border-radius: 1px;
  border: none;
  outline: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: yellow;
  cursor: pointer;
  border: none;
  outline: none;
  margin-top: -4px;
  position: relative;
}

input[type="range"]::-webkit-slider-thumb:hover {
  box-shadow: 0px 0px 0px 8px rgba(200, 200, 20, 0.16);
  transition: 0.3s ease-in-out;
}

#voice-progress {
  background: #4cabe2;
  height: 2px;
  transform: translateY(8px);
}

.transItem {
  transition: all 0.3s;
}
</style>
