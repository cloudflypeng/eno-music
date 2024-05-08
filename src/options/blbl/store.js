import { defineStore } from 'pinia'
import { useApiClient } from '~/composables/api'

const api = useApiClient()

export const useBlblStore = defineStore({
  id: 'blbl',
  state: () => ({
    howl: null,
    play: {}, // 当前播放的歌曲信息
    playList: [], // 播放列表
    count: 0,
    mode: 'home',
    // 按年份的三个
    rankList: [],
    currentRank: {},
    rankDetailList: [],
    // 热度榜单
    hitList: [],
    currentHit: {},
    hit_ps: 10,
    hit_pn: 1,
  }),
  // 计算属性
  getters: {

  },
  actions: {
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
      this.play = item
    },
    toRankDetail(item) {
      this.mode = 'rankDetail'
      this.currentRank = { ...item }
    },
  },
})
