<script setup>
import { Howl, Howler } from 'howler'
import cn from 'classnames'
import SongItem from '../SongItem.vue'
import { useBlblStore } from '../../blbl/store'
import LoopSwitch from './LoopSwitch.vue'
import { useApiClient } from '~/composables/api'
import Dialog from '~/components/dialog/index.vue'
import Drawer from '~/components/drawer/index.vue'

const api = useApiClient()

const store = useBlblStore()
const isPlaying = ref(false)
const showList = ref(false)
const currentIndex = ref(0)
const progress = reactive({
  percent: 0,
  current: 0,
  total: 0,
})
const voice = ref(1)
const isCloseVoice = ref(false)
const progressTimer = ref(null)

function playMusic() {
  const url = store.play.url
  // 重置进度
  progress.percent = 0
  progress.current = 0

  if (store.howl) {
    store.howl.stop()
    store.howl.unload()
  }

  currentIndex.value = store.playList.findIndex(item => item.id === store.play.id)

  store.howl = new Howl({
    src: [url],
    html5: true,
    volume: 1,
    mute: false,
    onplay: () => {
      isPlaying.value = true
      progressTimer.value = setInterval(() => {
        progress.current = store.howl.seek()
        progress.total = store.howl.duration()
        progress.percent = progress.current / progress.total
      }, 300)
    },
    onpause: () => {
      isPlaying.value = false
      clearInterval(progressTimer.value)
    },
    onend: () => {
      switch (store.loopMode) {
        case 'single':
          playMusic()
          break
        case 'list':
          change('next')
          break
        case 'random':
          currentIndex.value = Math.floor(Math.random() * store.playList.length)
          change(currentIndex.value)
          break
        default:
          change('next')
      }
    },
  })
  store.howl.play()
  voice.value = store.howl.volume()
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

  const url = dash.audio[0].baseUrl
  const video = dash.video[0].baseUrl

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
  const play = currentSong.enu_song_type === 'bvid'
    ? await getBvidUrl(currentSong)
    : await getSidUrl(currentSong)
  store.play = play
  playMusic()
})
// 顺序切换
function change(type) {
  if (type === 'next')
    currentIndex.value += 1 % store.playList.length
  else if (type === 'prev')
    currentIndex.value -= 1 % store.playList.length

  if (typeof type === 'number')
    currentIndex.value = type

  store.play = store.playList[currentIndex.value]
}
function changeProgress(e) {
  store.howl.seek(progress.total * e.target.value)
}

function toggleList() {
  showList.value = !showList.value
}

const displayData = computed(() => {
  return {
    title: store.play.title || '暂无歌曲',
  }
})
onMounted(() => {
  // 绑定空格切换播放暂停
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      if (isPlaying.value)
        store.howl.pause()
      else
        store.howl.play()
    }
  })
})
onUnmounted(() => {
  window.removeEventListener('keydown', () => { })
})
function playControl() {
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
function videoToFullScreen() {
  const video = document.getElementById('videcontent')
  if (video.requestFullscreen)
    video.requestFullscreen()

  else if (video.webkitRequestFullscreen)
    video.webkitRequestFullscreen()

  else if (video.mozRequestFullScreen)
    video.mozRequestFullScreen()

  else if (video.msRequestFullscreen)
    video.msRequestFullscreen()
}
</script>

<template>
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
      @change="changeProgress"
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
      <span v-if="store.play.cover" shrink-0>
        <img w-11 h-11 rounded-1 :src="store.play.cover">
      </span>
      <div truncate grow-1>
        <div v-html="displayData.title" />
        <span>{{ store.play.author }}{{ store.play.description }}</span>
      </div>
      <div flex gap-2 text-sm px-2>
        <div class="i-mingcute:share-forward-fill w-1em h-1em cursor-pointer" @click.stop="openBlTab" />
        <div class="i-mingcute:video-fill w-1em h-1em" @click.stop="openDialogVideo" />
        <!-- <div class="i-tdesign:card w-1em h-1em" />
        <div class="i-mingcute:more-1-fill w-1em h-1em" /> -->
      </div>
    </div>
    <!-- 其他 -->
    <div flex flex-row-reverse text-lg gap-5 w-100>
      <div v-if="fullScreenStatus" class="i-mingcute:fullscreen-fill w-1em h-1em" @click.stop="fullScreenTheBody" />
      <div v-else class="i-mingcute:fullscreen-exit-fill w-1em h-1em" @click.stop="fullScreenTheBody" />
      <div cursor-pointer class="i-tabler:playlist w-1em h-1em" @click="toggleList" />
      <Dialog :open="showList" title="播放列表" @visible-change="vis => showList = vis">
        <SongItem v-for="song in store.playList" :key="song.id" :song="song" size="mini" />
      </Dialog>
      <div v-if="isCloseVoice" class="i-mingcute:volume-mute-line w-1em h-1em" @click.stop="setVoice" />
      <div v-else class="i-mingcute:volume-line w-1em h-1em" @click.stop="setVoice" />
      <input
        v-if="!isCloseVoice" id="voice-progress" v-model="voice" type="range" class="w-20" min="0" max="1"
        step="0.01" @change="handleChangeVoice"
      >
    </div>
    <Drawer :open="dialogVideo" :title="store.play.title" @visible-change="vis => dialogVideo = vis">
      <section id="videcontent" class="flex justify-center h-full pt-6">
        <section :class="cn(videoShowPlaylist ? 'w-2/3' : 'w-[80vw]')">
          <video
            id="video-eno" autoplay class="w-full rounded-2xl overflow-auto h-fit transItem"
            :src="store.play.video"
          />
          <div class="text-3xl py-3 flex gap-3">
            <div class="i-mingcute:fullscreen-2-fill w-1em h-1em cursor-pointer" @click.stop="videoToFullScreen" />
            <div
              class="i-mingcute:columns-2-fill w-1em h-1em cursor-pointer"
              @click.stop="videoShowPlaylist = !videoShowPlaylist"
            />
            <div class="i-mingcute:cardano-ada-line w-1em h-1em" />
          </div>
        </section>
        <div v-if="videoShowPlaylist" class="overflow-auto h-[calc(100vh-200px)] wrapper-scroll pb-10 flex-1">
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

#voice-progress {
  background: #4cabe2;
  height: 2px;
  transform: translateY(8px);
}

.transItem {
  transition: all 0.3s;
}
</style>
