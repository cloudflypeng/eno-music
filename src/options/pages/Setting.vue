<script setup>
import Eq from '../components/Eq/Eq.vue'
import { useBlblStore } from '~/options/blbl/store'
import { usePlaylistStore } from '~/options/playlist/store'
import Message from '~/components/message'

const playlistStore = usePlaylistStore()

function exportData() {
  const { singers, list } = playlistStore
  // 导出成json 格式
  const data = {
    singers,
    list,
  }
  const json = JSON.stringify(data)
  const blob = new Blob([json], { type: 'application/json' })
  // 下载
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'blbl_data.json'
  a.click()
}

async function importData() {
  // 选择json文件
  try {
    const file = await window.showOpenFilePicker({
      types: [{
        description: 'JSON文件',
        accept: {
          'application/json': ['.json'],
        },
      }],
    })
    const fileHandle = file[0]
    const fileData = await fileHandle.getFile()
    const json = await fileData.text()
    const data = JSON.parse(json)
    // 验证数据
    if (!data.singers || !data.list) {
      Message.show({
        type: 'info',
        message: '数据格式不正确',
      })
    }
    playlistStore.singers = data.singers
    playlistStore.list = data.list
    Message.show({
      type: 'info',
      message: '导入成功',
    })
  }
  catch (error) {
    console.error(error)
    Message.show({
      type: 'info',
      message: '导入失败',
    })
  }
}
</script>

<template>
  <div class="w-full h-screen overflow-auto p-10 pb-30">
    <div class="flex items-center gap-2">
      <div class="flex items-center gap-2 text-lg cursor-pointer rounded-2 p-2 px-5 bg-$eno-fill-4 hover:bg-$eno-fill-2 duration-150" @click="exportData">
        <span class="i-tabler:download w-1em h-1em" />
        导出数据
      </div>
      <div class="flex items-center gap-2 text-lg cursor-pointer rounded-2 p-2 px-5 bg-$eno-fill-4 hover:bg-$eno-fill-2 duration-150" @click="importData">
        <span class="i-tabler:upload w-1em h-1em" />
        导入数据
      </div>
    </div>
    <div class="mt-4 text-sm text-$eno-text-2">
      <!-- desc -->
      <p>当前导出的数据包含：</p>
      <ul class="list-disc pl-5 mt-2">
        <li>歌手列表数据</li>
        <li>播放列表数据</li>
      </ul>
      <p class="mt-2">
        说明：
      </p>
      <ul class="list-disc pl-5 mt-2">
        <li>导出的数据将保存为 JSON 格式文件</li>
        <li>导入时请选择之前导出的 JSON 文件</li>
        <li>导入会覆盖当前的数据，请谨慎操作</li>
      </ul>
    </div>

    <!-- EQ 设置 -->
    <div class="mt-8">
      <h2 class="text-lg">
        均衡器设置
      </h2>
      <Eq />
    </div>
  </div>
</template>
