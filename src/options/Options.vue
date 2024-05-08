<!-- eslint-disable no-console -->
<script setup>
import { ref } from 'vue'
import Play from './blbl/Play.vue'
import Header from './blbl/Header.vue'
import Sider from './components/Sider.vue'

import Search from './blbl/Search.vue'

// import Rank from './blbl/rank.vue'
// import RankDetail from './blbl/RankDetail.vue'
import Home from './blbl/Home.vue'
import hitDetail from './blbl/HitDetail.vue'

import { useBlblStore } from './blbl/store.js'

const store = useBlblStore()
</script>

<template>
  <main
    class="text-center
    bg-black
    color-white"
    h-screen
    overflow="auto"
    flex
  >
    <!-- <Header /> -->
    <Sider />
    <div grow-1 shrink-10>
      <Home v-show="store.mode === 'home'" />
      <hitDetail v-show="store.mode === 'hitDetail'" />
      <Search v-show="store.mode === 'search'" />
    </div>
    <Play />
  </main>
</template>

<style>
*::-webkit-scrollbar {
  display: none;
}
</style>
