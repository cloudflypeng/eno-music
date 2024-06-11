// 点击打开options页面
browser.browserAction?.onClicked.addListener(() => {
  browser.runtime.openOptionsPage()
})
