<!-- eslint-disable no-console -->
<script setup>
import { Howl, Howler } from 'howler'
import { useBlblStore } from './store'
import { useApiClient } from '~/composables/api'

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
const progressTimer = ref(null)

function playMusic() {
  const url = store.play.url
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
}

watch(() => store.play?.id, (id) => {
  if (!store.play.url) {
    api.blbl.getSong({
      sid: id,
    }).then((res) => {
      if (res.code !== 0)
        // eslint-disable-next-line no-alert
        alert('获取音乐失败')

      store.play.url = res.data.cdns[0]
      // 如果没有封面
      if (!store.play.cover) {
        api.blbl.getSongInfo({ sid: id }).then((res) => {
          Object.assign(store.play, res.data)
        })
      }
      store.playList.push({ ...store.play })

      playMusic()
    })
  }
  else {
    playMusic()
  }
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
  window.removeEventListener('keydown', () => {})
})
</script>

<template>
  <section
    class="bg-[rgba(255,255,255,0.5)]  translate-x--2/4  xs:w-40 md:w-150 "
    backdrop-blur
    pos="fixed bottom-10 left-[50%]"
    h-15
    px-10
    color-white
    rounded-full
    flex
    gap-6
    items-center
    transform-gpu
  >
    <div flex flex-row text-lg gap-5>
      <!-- 音乐控制 -->
      <div cursor-pointer class="i-tabler:player-track-prev-filled w-1em h-1em" @click.stop="change('prev')" />
      <div v-if="isPlaying" cursor-pointer class="i-tabler:player-pause-filled w-1em h-1em" @click.stop="store.howl.pause()" />
      <div v-else cursor-pointer class="i-tabler:player-play-filled w-1em h-1em" @click.stop="store.howl.play()" />
      <div cursor-pointer class="i-tabler:player-track-next-filled w-1em h-1em" @click.stop="change('next')" />
    </div>
    <div grow-1 text-left truncate flex flex-row items-center gap-2>
      <!-- 主要信息 -->
      <span v-if="store.play.cover" shrink-0>
        <img w-10 h-10 :src="store.play.cover">
      </span>
      <div truncate grow-1>
        <div>{{ displayData.title }}</div>
        <input
          v-model="progress.percent"
          type="range" min="0" max="1" step="0.01"
          class="w-full"
          @change="changeProgress"
        >
      </div>
    </div>
    <!-- 其他 -->
    <div flex flex-row text-lg gap-5>
      <div class="i-tabler:playlist w-1em h-1em" @click="toggleList" />
      <div
        v-show="showList"
        absolute
        h-100 w-40
        bottom-12
        rounded-lg
        right-0
        transition ease-in-out delay-150
        class="bg-[rgba(0,0,0,0.5)]"
        backdrop-blur
        overflow-hidden
      >
        <div
          v-for="item, index in store.playList"
          :key="item.id"
          w-full
          max-w-full
          text-sm
          text-left
          cursor-pointer
          px-2 py-1
          rounded-lg
          transition ease-in-out delay-150
          truncate
          @click.stop="change(index)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
  </section>
</template>
