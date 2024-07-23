import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { useLocalStorage } from '@vueuse/core/index.cjs'
import { useApiClient } from '~/composables/api'

const api = useApiClient()

function getNextFridayTimestamp() {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysUntilFriday = (5 - dayOfWeek + 7) % 7
  const nextFriday = new Date(today)
  nextFriday.setDate(today.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday))
  nextFriday.setHours(18, 0, 0, 0) // Set to 18:00 of that day
  return Math.floor(nextFriday.getTime() / 1000)
}

export const useBlblStore = defineStore({
  id: 'blbl',
  state: () => ({
    howl: null,
    play: {}, // 当前播放的歌曲信息
    playList: [], // 播放列表
    count: 0,
    mode: 'home',
    timestampRefreshMap: {
      biliMusic: 0,
    },
    // 按年份的三个
    rankList: [],
    currentRank: {},
    rankDetailList: [],
    // 热度榜单
    hitList: useLocalStorage('hitList', []),
    currentHit: {},
    hit_ps: 10,
    hit_pn: 1,
    // 音乐排行榜
    musicRankList: useLocalStorage('musicRankList', []),
  }),
  // 计算属性
  getters: {

  },
  actions: {
    // 初始化首页
    initHomePage() {
      this.getHitList()
      this.initBiliMusic()
    },
    // 按时间决定时候要初始化 bilibili音乐榜单
    initBiliMusic() {
      api.biliMusic.getMusicRank().then((res) => {
        const { data: { list } } = res
        if (Array.isArray(list) && list.length > 0) {
          this.musicRankList = res.data.list.map((item) => {
            return {
              id: item.creation_bvid,
              enu_song_type: 'bvid',
              cover: item.creation_cover,
              title: item.creation_title,
              description: item.description || '',
              author: item.album,
              duration: item.duration || 0,
              bvid: item.creation_bvid,
            }
          })
        }

        const nextFriday = getNextFridayTimestamp()
        this.timestampRefreshMap.biliMusic = nextFriday
      })
    },
    getrankList() {
      api.blbl.getMenuRank({
        ps: 3,
      }).then((res) => {
        this.rankList = res.data.data || []
      })
    },
    getHitList() {
      api.blbl.getHitSong({
        ps: this.hit_ps,
        pn: this.hit_pn,
      }).then((res) => {
        this.hitList = res.data.data
      })
    },
    startPlay(item) {
      const song = cloneDeep(item)
      this.play = song
      const isInList = this.playList.some(item => item?.id === song.id)
      if (!isInList)
        this.playList.push(song)
    },
    getHitDetailList(sid) {
      api.blbl.getHitSongList({
        sid,
      }).then((res) => {
        this.currentHit.list = res.data.data
      })
    },
    toRankDetail(item) {
      this.mode = 'rankDetail'
      this.currentRank = { ...item }
    },
  },
})
