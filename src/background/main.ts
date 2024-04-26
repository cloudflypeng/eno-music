// import browser from 'webextension-polyfill'

import { apiListenerFactory } from './utils'

import API_BILIBILI from './api/bilibili'

// Merge all API objects into one
const FullAPI = Object.assign({}, API_BILIBILI)
// Create a message listener for each API
// const handleMessage = apiListenerFactory(FullAPI)
const apiProxy = apiListenerFactory(FullAPI)
export {
  apiProxy,
}
// function handleConnect() {
//   browser.runtime.onMessage.removeListener(handleMessage)
//   browser.runtime.onMessage.addListener(handleMessage)
// }

// (function startApi() {
//   browser.runtime.onConnect.removeListener(handleConnect)
//   browser.runtime.onConnect.addListener(handleConnect)
// })()

// browser.runtime.onInstalled.addListener((): void => {
//   // eslint-disable-next-line no-console
//   console.log('Extension installed')
// })
