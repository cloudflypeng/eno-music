import { ID3Writer } from 'browser-id3-writer'
// @ts-expect-error - No types available for file-saver
import { saveAs } from 'file-saver'
import { FFmpeg } from '@ffmpeg/ffmpeg'

import { fetchFile, toBlobURL } from '@ffmpeg/util'
import type { FileData } from '@ffmpeg/ffmpeg/dist/esm/types'
import { efetch } from '@meanc/webext-fetch'

const ffmpegRef = new FFmpeg()

export async function load() {
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'
  // const baseURL = browser.runtime.getURL('./assets')
  // 这里你可以加载或者执行相关的JS代码
  // const baseURL = '../../assets'
  const ffmpeg = ffmpegRef
  // const response = await fetch(browser.runtime.getURL(`${baseURL}/ffmpeg-core.wasm`))
  // const wasmBinary = await response.blob().toString()

  // toBlobURL is used to bypass CORS issue, urls with the same
  // domain can be used directly.
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  })
}

// load()

interface DownloadSong {
  url: string
  title: string
  cover: string
  author: string
}

async function download(song: DownloadSong) {
  const { url: songUrl, title, cover: coverUrl, author } = song

  // 转换 M4A 到 MP3
  const mp3File = await convertM4AToMP3(songUrl)

  const coverResponse = await fetch(coverUrl)
  const coverArrayBuffer = await coverResponse.arrayBuffer()

  let audioBuffer = null

  if (typeof mp3File === 'string') {
    const encoder = new TextEncoder()
    return encoder.encode(mp3File).buffer
  }
  else {
    audioBuffer = mp3File.buffer
  }

  const writer = new ID3Writer(audioBuffer)
  writer
    .setFrame('TIT2', title)
    .setFrame('TPE1', [author])
    .setFrame('TALB', title)
    .setFrame('APIC', {
      type: 3,
      data: coverArrayBuffer,
      description: 'Cover',
    })
  writer.addTag()

  const downloadUrl = writer.getURL()

  // Use file-saver to trigger the download
  saveAs(downloadUrl, `${title}.mp3`)
  URL.revokeObjectURL(downloadUrl)
}

async function convertM4AToMP3(url: string): Promise<FileData> {
  const ffmpeg = ffmpegRef
  await ffmpeg.writeFile('input.m4a', await fetchFile(url))
  await ffmpeg.exec(['-i', 'input.m4a', 'output.mp3'])
  const data = await ffmpeg.readFile('output.mp3')

  return data
}

export { download }
