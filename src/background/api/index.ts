// import browser from 'webextension-polyfill'

import { apiListenerFactory } from '../utils'

import API_BILIBILI from './bilibili'

// Merge all API objects into one
const FullAPI = Object.assign({}, API_BILIBILI)
// Create a message listener for each API
// const handleMessage = apiListenerFactory(FullAPI)
const apiProxy = apiListenerFactory(FullAPI)
export {
  apiProxy,
}
