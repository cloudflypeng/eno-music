import { efetch } from '@meanc/webext-fetch'
import { encWbi, getWbiKeys } from './wbi'

async function getUserArc(params: object) {
  const defaultParams = {
    mid: 0,
    pn: 1,
    ps: 25,
    tid: 3,
    keyword: '',
    order: 'pubdate',
  }
  params = { ...defaultParams, ...params }
  const web_keys = await getWbiKeys()
  const img_key = web_keys.img_key
  const sub_key = web_keys.sub_key
  const query = encWbi(params, img_key, sub_key)
  const res = await fetch(`https://api.bilibili.com/x/space/wbi/arc/search?${query}`, {
    method: 'GET',
    headers: {
      Referer: 'https://message.bilibili.com/',
    },
  })

  return res.json()
}

async function getSeasonInfo(params: Record<string, any>) {
  const defaultParams = {
    mid: 1,
    season_id: 0,
  }
  params = { ...defaultParams, ...params }
  const url = `https://api.bilibili.com/x/polymer/web-space/seasons_archives_list?${new URLSearchParams(params).toString()}`
  const res = await efetch(url, {
    method: 'GET',

    headers: {
      Referer: 'https://www.bilibili.com/',
    },
  })

  return res
}

export { getUserArc, getSeasonInfo }
