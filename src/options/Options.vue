<!-- eslint-disable no-console -->
<script setup>
import { ref } from 'vue'
import Play from './blbl/Play.vue'

// import Rank from './blbl/rank.vue'
// import RankDetail from './blbl/RankDetail.vue'
import Hit from './blbl/Hit.vue'
import hitDetail from './blbl/HitDetail.vue'

import { useBlblStore } from './blbl/store.js'

const store = useBlblStore()
</script>

<template>
  <main class="px-4 py-10 text-center text-gray-700 dark:text-gray-200">
    <Play />
    <!-- <Rank v-show="store.mode === 'rank'" />
    <RankDetail v-show="store.mode === 'rankDetail'" /> -->
    <Hit v-show="store.mode === 'hit'" />
    <hitDetail v-show="store.mode === 'hitDetail'" />
  </main>
</template>
