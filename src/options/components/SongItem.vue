<script setup>
import { computed, defineEmits, defineProps, ref } from 'vue'
import { useBlblStore } from '../blbl/store.js'
import { usePlaylistStore } from '../playlist/store.ts'

const props = defineProps({
  song: {
    type: Object,
    default: null,
  },
  size: {
    // default, mini
    type: String,
    default: 'default',
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

const styleBySize = computed(() => {
  if (props.size === 'mini') {
    return {
      wrapper: `song-item grid-cols-[4.5rem_1fr_90px]  text-lg cursor-pointer h-15 hover:bg-$eno-fill-2 rounded-4 px-2`,
      title: 'text-[12px] font-bold w-full truncate',
      author: 'text-xs opacity-50',
      img: 'w-15 rounded-2 object-cover',
    }
  }
  else {
    return {
      wrapper: `song-item grid-cols-[5.5rem_1fr_90px] text-lg cursor-pointer h-15 hover:bg-$eno-fill-2 rounded-4 px-2`,
      title: 'text-[16px] font-bold truncate ',
      author: 'text-xs opacity-50',
      img: 'w-[5rem] rounded-2 object-cover',
    }
  }
})
</script>

<template>
  <div :class="styleBySize.wrapper" @click="store.startPlay(song)">
    <img
      :src="cover" :class="styleBySize.img"
    >
    <div class="w-full overflow-auto" :title="title">
      <div class="h-15 pt-1">
        <div :class="styleBySize.title" v-html="title" />
        <div :class="styleBySize.author">
          {{ author }}
        </div>
      </div>
    </div>
    <!-- 操作, 收藏到播放列表, 删除 -->
    <div class="flex gap-3 text-lg justify-end">
      <div v-if="del" class="i-mingcute:delete-3-fill w-1em h-1em" @click.stop="emit('delete-song', props.song)" />
      <div v-if="later" class="i-mingcute:time-fill w-1em h-1em" @click.stop="PLstore.addToListenLater(props.song)" />
      <div v-if="star" class="i-mingcute:star-fill w-1em h-1em" @click.stop="PLstore.startAddSong(props.song)" />
    </div>
  </div>
</template>

<style scoped>
.song-item {
  display: grid;
  /* 左右固定, 中间展开 */
  /* grid-template-columns: 100px 1fr 60px; */
  overflow: hidden;
  /* 子元素上下居中 */
  align-items: center;
}
</style>
