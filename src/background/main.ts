import { backgroundListener } from '@meanc/webext-fetch'

backgroundListener()
// 点击浏览器图标, 打开选项页
browser.action?.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})
