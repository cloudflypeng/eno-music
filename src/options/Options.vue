<!-- eslint-disable no-console -->
<script setup>
import { provide, ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'

import Play from './blbl/Play.vue'
import Header from './blbl/Header.vue'
import Sider from './components/Sider.vue'
import Playlist from './playlist/index.vue'
import ListenLater from './playlist/ListenLater.vue'
import AddSong from './playlist/AddSong.vue'
import About from './components/About.vue'

import Search from './blbl/Search.vue'
import SingerList from './playlist/SingerList.vue'
import SingerDetail from './playlist/SingerDetail.vue'

// import Rank from './blbl/rank.vue'
// import RankDetail from './blbl/RankDetail.vue'
import Home from './blbl/Home.vue'
import hitDetail from './blbl/HitDetail.vue'

import { useBlblStore } from './blbl/store.js'

const store = useBlblStore()
const CST = useLocalStorage('cookieSetTime', 0)

function getCookie() {
  const domain = 'https://api.bilibili.com'
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
}

onMounted(() => {
  // 每天获取一次cookie就可以
  if (Date.now() - CST.value > 24 * 60 * 60 * 1000) {
    CST.value = Date.now()
    getCookie()
  }
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
    <div class="grow-1 shrink-10 fadeInWrapper">
      <Home v-show="store.mode === 'home'" />
      <hitDetail v-show="store.mode === 'hitDetail'" />
      <Search v-show="store.mode === 'search'" />
      <Playlist v-show="store.mode === 'playlist'" />
      <ListenLater v-show="store.mode === 'listenLater'" />
      <SingerList v-show="store.mode === 'singerList'" />
      <SingerDetail v-show="store.mode === 'singerDetail'" />
      <About v-show="store.mode === 'about'" />
    </div>
    <Play />
  </main>
</template>

<style>
html{
  background: #000;
}
*::-webkit-scrollbar {
  display: none;
}
img {
  position: relative;

  &::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background-image: url("/assets/broken-image.png");
    background-size: 25px;
    background-position: center;
    background-repeat: no-repeat;
  }
}
.fadeInWrapper > * {
  animation: fadeIn 0.5s;
}
.fadeItem {
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
