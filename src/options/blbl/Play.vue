<!-- eslint-disable no-console -->
<script setup>
import { Howl, Howler } from 'howler'
import { watch } from 'vue'
import { useBlblStore } from './store'

const sound = ref(null)

const store = useBlblStore()
watch(() => store.play.url, (url) => {
  if (sound.value)
    sound.value.unload()
  console.log('111 :>> ', 111)
  fetch(url, {
    method: 'GET',
    headers: {
      'referrer': 'https://www.bilibili.com/',
      'Content-Type': 'audio',
    },
  })

  sound.value = new Howl({
    src: [url],
    html5: true,
    volume: 1,
    mute: false,
  })
  sound.value.play()
})
</script>

<template>
  <div>
    {{ store.mode }}
    {{ store.play }}
    <audio controls :src="store.play.url" crossorigin />
  </div>
</template>
