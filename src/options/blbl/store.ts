import { defineStore } from 'pinia'
import { cloneDeep } from 'lodash'
import { useStorage } from '@vueuse/core'
import type { RemovableRef } from '@vueuse/core'
import { useApiClient } from '~/composables/api'

const api = useApiClient()

export const VIDEO_MODE = {
  FLOATING: 'floating',
  DRAWER: 'drawer',
  HIDDEN: 'hidden',
}
type VideoMode = typeof VIDEO_MODE[keyof typeof VIDEO_MODE]
interface MusicRankItem {
  creation_bvid: string
  mv_cover: string
  album: string
  description: string
  singer: string
  duration: number
}

interface State {
  howl: any
  eqService: any
  play: object
  playList: RemovableRef<object[]>
  count: number
  loopMode: RemovableRef<string>
  videoMode: RemovableRef<VideoMode>
  mode: string
  timestampRefreshMap: Record<string, number>
  ranksId: any[]
  rankList: any[]
  currentRank: object
  rankDetailList: any[]
  hitList: RemovableRef<any[]>
  currentHit: {
    list: any[]
    [key: string]: any
  }
  hit_ps: number
  hit_pn: number
  musicRankList: RemovableRef<any[]>
}

export const useBlblStore = defineStore({
  id: 'blbl',
  state: (): State => ({
    howl: null,
    eqService: null,
    play: useStorage('playInfo', {}), // 当前播放的歌曲信息
    playList: useStorage('playList', []), // 播放列表
    count: 0,
    loopMode: useStorage('loopMode', 'list'),
    videoMode: useStorage('videoMode', VIDEO_MODE.FLOATING),
    mode: 'home',
    timestampRefreshMap: {
      biliMusic: 0,
    },
    // 按年份的三个
    rankList: [],
    currentRank: {},
    rankDetailList: [],
    // 热度榜单
    hitList: useStorage('hitList', []),
    currentHit: {},
    hit_ps: 10,
    hit_pn: 1,
    // 音乐排行榜
    ranksId: [],
    musicRankList: useStorage('musicRankList', []),
  }),
  // 计算属性
  getters: {

  },
  actions: {
    // 初始化首页
    initHomePage() {
      this.initBiliMusic()
    },
    initBiliMusic() {
      // 获取排行榜的列表
      api.biliMusic.getMusicRankList().then((res) => {
        const rankObj = res.data.list
        let flatList: any[] = []
        // 按年份的借口,拍平
        Object.values(rankObj).forEach((i) => {
          flatList = flatList.concat(i)
        })
        // 排序
        this.ranksId = flatList.sort((a, b) => b.ID - a.ID)
        this.getRankById(this.ranksId[0]?.ID)
      })
    },
    // 全站音乐榜
    getRankById(id: number) {
      if (!id)
        return
      api.biliMusic.getMusicRank({
        list_id: id,
      }).then((res) => {
        const { data: { list } } = res as { data: { list: MusicRankItem[] } }
        if (Array.isArray(list) && list.length > 0) {
          this.musicRankList = res.data.list.map((item: MusicRankItem) => {
            return {
              id: item.creation_bvid,
              eno_song_type: 'bvid',
              cover: item.mv_cover,
              title: item.album,
              description: item.description || '',
              author: item.singer,
              duration: item.duration || 0,
              bvid: item.creation_bvid,
            }
          })
        }
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
    startPlay(item: any) {
      const song = cloneDeep(item)
      this.play = song
      const isInList = this.playList.some(item => item?.id === song.id)
      if (!isInList)
        this.playList.push(song)
    },
    getHitDetailList(sid: number) {
      api.blbl.getHitSongList({
        sid,
      }).then((res) => {
        this.currentHit.list = res.data.data
      })
    },
    toRankDetail(item: any) {
      this.mode = 'rankDetail'
      this.currentRank = { ...item }
    },
  },
})

export type BlblStore = ReturnType<typeof useBlblStore>
