// 引用chrome

import { onMessage, sendMessage } from 'webext-bridge/background'
import { encWbi, getWbiKeys } from './wbi'

browser.action?.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})

onMessage('wbiApi', async ({ data }) => {
  const { api, params } = data as { api: string, params: any }

  if (api === 'getUserArc') {
    const res = await getUserArc(params)
    sendMessage('wbiApi', { api, res }, 'options')
    return res
  }
})

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
