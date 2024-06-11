// 点击打开options页面
browser.action?.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})
// browser.browserAction?.onClicked.addListener(() => {
//   browser.runtime.openOptionsPage()
// })
