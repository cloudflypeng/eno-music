<script setup>
import { useLocalStorage } from '@vueuse/core'
import cn from 'classnames'
import Dialog from '../../components/dialog/index.vue'
import { useBlblStore } from '../blbl/store.js'
import { usePlaylistStore } from '../playlist/store'
import TabItem from './TabItem.vue'

const tabs = [
  { icon: 'i-tabler:smart-home', title: '首页', mode: 'home' },
  { icon: 'i-tabler:music-search', title: '搜索', mode: 'search' },
  { icon: 'i-mingcute:version-line', title: '媒体库', mode: 'playlist' },
]

const PLStore = usePlaylistStore()

// 新建歌单相关代码
const createDialogVis = ref(false)
const playlistName = ref('')
function createPlaylist() {
  const list = PLStore.list
  // 重名校验, 空校验
  if (list.some(pl => pl.name === playlistName.value) || !playlistName.value)
    return

  PLStore.createPlaylist(playlistName.value)
  createDialogVis.value = false
}
// 侧边栏展开相关代码
const open = useLocalStorage('sider-open', false)
const asideClass = computed(() => {
  return cn('w-20 h-full flex flex-col flex-shrink-0 flex-grow-0 gap-3 text-lg p-3 px-2 border-r border-r-$eno-fill-2 ', {
    'w-60': open.value,
  })
})
const tabClass = computed(() => {
  return cn('tab-item flex w-full gap-3 text-2xl items-center h-10 cursor-pointer px-4 hover:bg-$eno-fill-2 rounded-4', {
    'justify-center': !open.value,
  })
})
</script>

<template>
  <!-- 增加动画持续时间 -->
  <aside :class="asideClass" transition-all duration-300>
    <!-- logo and close -->
    <div
      :class="cn('flex items-center h-10 gap-3 px-4 tab-item ', { 'justify-center': !open })" cursor-pointer
      @click="open = !open"
    >
      <div v-if="open" class="i-mingcute:indent-decrease-fill w-1em h-1em" />
      <div v-else class="i-mingcute:indent-increase-fill w-1em h-1em" />
      <span v-if="open" class="text-lg">ENO-M</span>
    </div>
    <!-- tab区 -->
    <TabItem v-for="tab in tabs" :key="tab.mode" :tab="tab" :open="open" />
    <!-- 分割线 -->
    <div class="h-0.5 bg-$eno-fill-2" />
    <div :class="`${tabClass} bg-$eno-fill-2`" text-lg @click.stop="createDialogVis = true">
      <div class="i-mingcute:plus-fill w-1em h-1em" />
      <span v-if="open">新建播放列表</span>
    </div>
    <Dialog :open="createDialogVis" title="新建播放列表" @visible-change="createDialogVis = $event">
      <div class="flex flex-col gap-3 w-full h-full justify-between">
        <input
          v-model="playlistName" type="text"
          class="border-none outline-none bg-$eno-content-hover h-10 px-3 autofocus rounded-4" placeholder="请输入播放列表名称"
        >
        <div class="opt flex flex-row-reverse text-lg gap-3">
          <div class="bg-$eno-fill-2 px-6 py-1 rounded-10 cursor-pointer" @click.stop="createPlaylist">
            新建
          </div>
          <div class="hover:bg-$eno-fill-2 px-6 py-1 rounded-10 cursor-pointer" @click.stop="createDialogVis = false">
            取消
          </div>
        </div>
      </div>
    </Dialog>
    <TabItem :tab="{ icon: 'i-mingcute:group-2-fill', title: '关注的音乐人', mode: 'singerList' }" :open="open" />
    <TabItem class="h-13" :tab="{ icon: 'i-mingcute:time-fill', mode: 'listenLater' }" :open="open">
      <template #default>
        <div v-if="open" text-xs>
          <div>稍后播放</div>
          <div>自动播放列表</div>
        </div>
      </template>
    </TabItem>
    <!-- 关于 -->
    <TabItem :tab="{ icon: 'i-mingcute:information-fill', title: '关于', mode: 'about' }" :open="open" />
  </aside>
</template>

<style>
.tab-item>*:nth-child(2) {
  animation: fadeIn 2s;
}
</style>
