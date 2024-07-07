<script setup>
import { Howl, Howler } from 'howler'
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
const progressTimer = ref(null)

function playMusic() {
  const url = store.play.url
  // restall
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
function playControl() {
  if (isPlaying.value)
    store.howl.pause()
  else
    store.howl.play()
}
</script>

<template>
  <section
    class="bg-$eno-elevated translate-x--2/4  xs:w-40 md:w-150 "
    style="backdrop-filter: var(--eno-filter-glass-light-1)"
    pos="fixed bottom-10 left-[50%]"
    h-15
    px-6
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
      <div v-if="isPlaying" cursor-pointer class="i-tabler:player-pause-filled w-1em h-1em" @click.stop="playControl" />
      <div v-else cursor-pointer class="i-tabler:player-play-filled w-1em h-1em" @click.stop="playControl" />
      <div cursor-pointer class="i-tabler:player-track-next-filled w-1em h-1em" @click.stop="change('next')" />
    </div>
    <div
      grow-1 text-left truncate flex flex-row items-center gap-2
      px-2 rounded-2 backdrop-blur
      class="bg-$eno-fill-dark-1 py-1"
    >
      <!-- 主要信息 -->
      <span v-if="store.play.cover" shrink-0>
        <img w-10 h-10 rounded-1 :src="store.play.cover">
      </span>
      <div truncate grow-1>
        <div v-html="displayData.title" />
        <input
          v-model="progress.percent"
          type="range" min="0" max="1" step="0.01"
          class="w-full"
          @change="changeProgress"
        >
      </div>
      <div flex gap-2 text-sm px-2>
        <div class="i-tdesign:card w-1em h-1em" />
        <div class="i-mingcute:more-1-fill w-1em h-1em" />
      </div>
    </div>
    <!-- 其他 -->
    <div flex flex-row text-lg gap-5>
      <div
        cursor-pointer
        class="i-tabler:playlist w-1em h-1em" @click="toggleList"
      />
      <Dialog
        :open="showList"
        title="播放列表"
        @visible-change="vis => showList = vis"
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
          transition delay-50
          truncate
          class="hover:opacity-100 opacity-75"
          @click.stop="change(index)"
        >
          <div class="flex gap-3">
            <img w-10 h-10 rounded-2 :src="item.cover">
            <div class="truncate">
              {{ item.title }}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  </section>
</template>

<style>
.playlist-dialog{
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
