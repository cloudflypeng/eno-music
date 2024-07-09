<script setup>
import { Howl, Howler } from 'howler'
import cn from 'classnames'
import { useBlblStore } from './store'
import { useApiClient } from '~/composables/api'
import Dialog from '~/components/dialog/index.vue'

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
      }, 1000)
    },
    onpause: () => {
      isPlaying.value = false
      clearInterval(progressTimer.value)
    },
    onend: () => {
      change('next')
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
  const url = await api.blbl.getAudioOfVideo({
    cid,
    bvid: item.bvid,
  }).then(res => res.data.dash.audio[0].baseUrl)

  return {
    ...item,
    url,
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

watch(() => store.play?.id, async () => {
  // TODO: 这里只兼容了sid也就是普通歌单, 其他歌曲获取逻辑不在这导致歌单内歌曲的url重新获取失败
  const currentSong = store.play
  const play = currentSong.enu_song_type === 'bvid'
    ? await getBvidUrl(currentSong)
    : await getSidUrl(currentSong)
  store.play = play

  playMusic()
})

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
</script>

<template>
  <section
    class="bg-$eno-elevated w-screen h-20 px-6 flex" style="backdrop-filter: var(--eno-filter-glass-light-1)"
    flex="row items-center justify-between"
    pos="fixed bottom-0 left-0" color-white gap-6 transform-gpu
  >
    <!-- 音乐进度 -->
    <div class="w-screen top-0 left-0 absolute h-[2px] bg-yellow" :style="progressTrans" />
    <!-- 音乐滑块 -->
    <input
      v-model="progress.percent" type="range" min="0" max="1" step="0.01"
      color="red"
      class="w-full absolute top-0 left-0 h-1 bg-$eno-fill-2 rounded-1 cursor-pointer play-progress"
      @change="changeProgress"
    >

    <!-- 音乐控制 -->
    <div flex flex-row items-center text-2xl gap-10 w-100>
      <div cursor-pointer class="i-tabler:player-track-prev-filled w-1em h-1em hover:opacity-50" @click.stop="change('prev')" />
      <div
        v-if="isPlaying"
        cursor-pointer text-3xl
        class="i-tabler:player-pause-filled w-1em h-1em hover:opacity-50"
        @click.stop="playControl"
      />
      <div
        v-else
        cursor-pointer text-3xl
        class="i-tabler:player-play-filled w-1em h-1em hover:opacity-50"
        @click.stop="playControl"
      />
      <div cursor-pointer class="i-tabler:player-track-next-filled w-1em h-1em hover:opacity-50" @click.stop="change('next')" />
      <div text-xs>
        {{ timeDisplay.current }}/{{ timeDisplay.total }}
      </div>
    </div>
    <!-- 播放信息 -->
    <div
      flex flex-row items-center gap-4
      text-left truncate rounded-2 backdrop-blur
      px-3 py-1
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
      <!-- <div flex gap-2 text-sm px-2>
        <div class="i-tdesign:card w-1em h-1em" />
        <div class="i-mingcute:more-1-fill w-1em h-1em" />
      </div> -->
    </div>
    <!-- 其他 -->
    <div flex flex-row-reverse text-lg gap-5 w-100>
      <div cursor-pointer class="i-tabler:playlist w-1em h-1em" @click="toggleList" />
      <Dialog :open="showList" title="播放列表" @visible-change="vis => showList = vis">
        <div
          v-for="item, index in store.playList" :key="item.id" w-full max-w-full text-sm text-left cursor-pointer
          px-2 py-1 rounded-lg transition delay-50 truncate class="hover:opacity-100 opacity-75"
          @click.stop="change(index)"
        >
          <div class="flex gap-3">
            <img w-10 h-10 rounded-2 :src="item.cover">
            <div class="truncate" v-html="item.title" />
          </div>
        </div>
      </Dialog>
      <div
        v-if="isCloseVoice"
        class="i-mingcute:volume-mute-line w-1em h-1em"
        @click.stop="setVoice"
      />
      <div
        v-else
        class="i-mingcute:volume-line w-1em h-1em"
        @click.stop="setVoice"
      />
      <input
        v-if="!isCloseVoice"
        id="voice-progress" v-model="voice" type="range"
        class="w-20" min="0" max="1" step="0.01"
        @change="handleChangeVoice"
      >
    </div>
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
  margin-top: -6px;   /* Thumb の位置を調整 */
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

.playlist-dialog {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}
</style>
