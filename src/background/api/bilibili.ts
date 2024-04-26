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
}

export default api
