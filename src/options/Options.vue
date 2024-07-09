<!-- eslint-disable no-console -->
<script setup>
import { ref } from 'vue'

import Play from './blbl/Play.vue'
import Header from './blbl/Header.vue'
import Sider from './components/Sider.vue'
import Playlist from './playlist/index.vue'
import ListenLater from './playlist/ListenLater.vue'
import AddSong from './playlist/AddSong.vue'

import Search from './blbl/Search.vue'

// import Rank from './blbl/rank.vue'
// import RankDetail from './blbl/RankDetail.vue'
import Home from './blbl/Home.vue'
import hitDetail from './blbl/HitDetail.vue'

import { useBlblStore } from './blbl/store.js'

const store = useBlblStore()
onMounted(() => {
  const domain = 'https://www.bilibili.com'

  fetch(domain, {
    method: 'GET',
    mode: 'no-cors',
    credentials: 'include',
  }).then((res) => {
    // get cookie from response
    const cookie = res.headers.get('set-cookie')

    chrome.cookies?.set({
      ...cookie,
    })
  })
})
</script>

<template>
  <main
    class="
    bg-$eno-bg
    color-$eno-text-1" h-screen w-screen overflow="auto" flex
  >
    <!-- <Header /> -->
    <AddSong />
    <Sider />
    <div grow-1 shrink-10>
      <Home v-show="store.mode === 'home'" />
      <hitDetail v-show="store.mode === 'hitDetail'" />
      <Search v-show="store.mode === 'search'" />
      <Playlist v-show="store.mode === 'playlist'" />
      <ListenLater v-show="store.mode === 'listenLater'" />
    </div>
    <Play />
  </main>
</template>

<style>
*::-webkit-scrollbar {
  display: none;
}
</style>
