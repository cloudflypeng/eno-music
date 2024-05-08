import { AHS } from '../utils'
import { BLBL } from '../msg.define'

const baseUrl = 'https://api.bilibili.com'

const api = {
  [BLBL.GET_RANK]: {
    url: `${baseUrl}/x/copyright-music-publicity/toplist/all_period`,
    _fetch: {
      method: 'get',
    },
    params: {
      list_type: 1, // 1: 热榜, 2: 原创榜
    },
    afterHandle: AHS.J,
  },
  [BLBL.GET_RANK_DETAIL]: {
    url: `${baseUrl}/x/copyright-music-publicity/toplist/detail`,
    _fetch: {
      method: 'get',
    },
    params: {
      list_id: 0, // 榜单id
    },
    afterHandle: AHS.J,
  },
  [BLBL.GET_RANK_DETAIL_LIST]: {
    url: `${baseUrl}/x/copyright-music-publicity/toplist/music_list`,
    _fetch: {
      method: 'get',
    },
    params: {
      list_id: 0, // 榜单id
    },
    afterHandle: AHS.J,
  },
  [BLBL.GET_SONG_DETAIL]: {
    url: `${baseUrl}/audio/music-service-c/web/song/info`,
    _fetch: {
      method: 'get',
    },
    params: {
      sid: 0, // 歌曲id
    },
    afterHandle: AHS.J,
  },
  [BLBL.GET_HIT_SONG]: {
    // https://www.bilibili.com/audio/music-service-c/web/menu/hit?ps=20&pn=1
    url: `${baseUrl}/audio/music-service-c/web/menu/hit`,
    _fetch: {
      method: 'get',
    },
    params: {
      ps: 20, // 每页数量
      pn: 1, // 页数
    },
    afterHandle: AHS.J,
  },
  /// audio/music-service-c/web/song/of-menu
  [BLBL.GET_HIT_SONG_LIST]: {
    url: `${baseUrl}/audio/music-service-c/web/song/of-menu`,
    _fetch: {
      method: 'get',
    },
    params: {
      sid: 0, // 歌单id
      ps: 100, // 每页数量
      pn: 1, // 页数
    },
    afterHandle: AHS.J,
  },
  // https://www.bilibili.com/audio/music-service-c/web/url?sid=276736
  [BLBL.GET_SONG]: {
    url: `${baseUrl}/audio/music-service-c/web/url`,
    _fetch: {
      method: 'get',
    },
    params: {
      sid: 0, // 歌曲id
    },
    afterHandle: AHS.J,
  },
  // https://www.bilibili.com/audio/music-service-c/web/menu/rank
  [BLBL.GET_MENU_RANK]: {
    url: `${baseUrl}/audio/music-service-c/web/menu/rank`,
    _fetch: {
      method: 'get',
    },
    params: {
      ps: 3, // 每页数量
      pn: 1, // 页数
    },
    afterHandle: AHS.J,
  },
}

export default api
