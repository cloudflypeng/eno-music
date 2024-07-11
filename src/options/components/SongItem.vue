<script setup>
import { useBlblStore } from '../blbl/store.js'
import { usePlaylistStore } from '../playlist/store.ts'

const props = defineProps({
  song: {
    type: Object,
    default: null,
  },
  star: {
    type: Boolean,
    default: true,
  },
  del: {
    type: Boolean,
    default: false,
  },
  later: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['delete-song'])
const store = useBlblStore()
const PLstore = usePlaylistStore()

const { later, del, star } = props
const { cover, title, author } = props.song
</script>

<template>
  <div
    class="text-lg cursor-pointer h-15 flex p-2 hover:bg-$eno-fill-2 rounded-4"
    @click="store.startPlay(song)"
  >
    <div class="flex flex-1 gap-6">
      <img :src="cover" class="w-20 rounded-2 object-cover">
      <div>
        <div class="text-lg font-bold w-full" v-html="title" />
        <div class="text-sm opacity-50">
          {{ author }}
        </div>
      </div>
    </div>
    <!-- 操作, 收藏到播放列表, 删除 -->
    <div class="flex-grow-0 flex flex-row-reverse gap-3 float-right h-full flex items-center">
      <div
        v-if="del" class="i-mingcute:delete-3-fill w-1em h-1em"
        @click.stop="emit('delete-song', props.song)"
      />
      <div
        v-if="later" class="i-mingcute:time-fill w-1em h-1em"
        @click.stop="PLstore.addToListenLater(props.song)"
      />
      <div
        v-if="star" class="i-mingcute:star-fill w-1em h-1em"
        @click.stop="PLstore.startAddSong(props.song)"
      />
    </div>
  </div>
</template>

<style scoped>

</style>
