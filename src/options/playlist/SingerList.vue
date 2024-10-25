<script setup>
import Dialog from '../../components/dialog/index.vue'
import SingerCard from '../components/SingerCard.vue'
import { defaultSingers, usePlaylistStore } from './store'
// https://space.bilibili.com/17819768?spm_id_from=333.1007.tianma.1-1-1.click
function getMidFromUrl(url) {
  // 如果url 是纯数字, 则直接返回
  if (/^\d+$/.test(url)) {
    return url
  }
  const match = url.match(/space\.bilibili\.com\/(\d+)/)
  if (match) {
    return match[1]
  }
  return ''
}

const PLstore = usePlaylistStore()
onMounted(() => {
  PLstore.fetchSingerInfoList()
})

// 添加歌手相关
const dialogVis = ref(false)
const singerMid = ref('')
function addSinger() {
  // 判断是否已经存在, 判断singerMid是否合法
  const mid = getMidFromUrl(singerMid.value)
  if (!mid)
    return
  if (defaultSingers.includes(mid) || PLstore.singers.includes(mid))
    return

  PLstore.addSinger(mid)
  dialogVis.value = false
}
</script>

<template>
  <section class="h-screen overflow-auto">
    <div class="text-3xl my-10 mx-20">
      推荐
    </div>
    <div class="flex gap-10 px-20 flex-wrap">
      <SingerCard v-for="serid in defaultSingers" :key="serid" :singer-mid="serid" />
    </div>
    <!-- 添加自定义歌手, 也用一个圆圈 -->
    <div class="text-3xl my-10 mx-20">
      自定义
    </div>
    <div class="flex gap-10 px-20 flex-wrap mb-30">
      <SingerCard v-for="serid in PLstore.singers" :key="serid" :singer-mid="serid" can-del />
      <div
        border="1 gray-200" class="flex flex-col flex-shrink-0 justify-center items-center cursor-pointer
        w-40 h-40 rounded-full border-2 cursor-pointer
      " @click.stop="dialogVis = true"
      >
        <div class="i-mingcute:plus-fill text-[40px]" />
        <Dialog :open="dialogVis" title="添加自定义歌手" @visible-change="dialogVis = $event">
          <div class="flex flex-col gap-3 w-full h-full justify-between">
            <input
              v-model="singerMid" placeholder="请输入歌手mid或up主主页链接" bg="$eno-content focus:$eno-content-hover"
              class="h-10 px-3 border border-gray-200 rounded-4"
            >
            <button class="w-full h-10 bg-$eno-fill-2 text-white rounded-4" @click="addSinger">
              添加
            </button>
          </div>
        </dialog>
      </div>
    </div>
  </section>
</template>
