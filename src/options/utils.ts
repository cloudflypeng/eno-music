import { ID3Writer } from 'browser-id3-writer'
// @ts-expect-error - No types available for file-saver
import { saveAs } from 'file-saver'

interface DownloadSong {
  url: string
  title: string
  cover: string
  author: string
}

async function download(song: DownloadSong) {
  const { url: songUrl, title, cover: coverUrl, author } = song
  // 获取音频文件和封面图片的 Blob 和 ArrayBuffer
  const response = await fetch(songUrl)
  const audioBlob = await response.arrayBuffer()

  const coverResponse = await fetch(coverUrl)
  const coverArrayBuffer = await coverResponse.arrayBuffer()

  const writer = new ID3Writer(audioBlob)
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

  const taggedSongBlob = writer.getBlob()
  const downloadUrl = URL.createObjectURL(taggedSongBlob)

  saveAs(downloadUrl, `${title}.mp3`)
  URL.revokeObjectURL(downloadUrl)
}

export { download }
