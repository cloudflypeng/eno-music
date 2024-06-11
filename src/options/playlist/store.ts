import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { nanoid } from 'nanoid'

interface song {
  id: string | number
  [key: string]: any
}

interface playlist {
  id: string | number
  name: string
  songs: song[]
}

export const usePlaylistStore = defineStore({
  id: 'playlist',
  state: () => ({
    list: useLocalStorage('playlist', [] as playlist[]),
    // 待添加的song
    songToAdd: null as song | null,
    // 添加窗口是否打开
    addSongDialog: false,
  }),
  actions: {
    startAddSong(song: song) {
      this.songToAdd = song
      this.addSongDialog = true
    },
    addSong(playlistId: string | number) {
      const playlist = this.list.find(p => p.id === playlistId)
      if (!playlist)
        return
      playlist.songs.push(this.songToAdd!)
    },
    removeSong(playlistId: string | number, songId: string | number) {
      const playlist = this.list.find(p => p.id === playlistId)
      if (!playlist)
        return
      const index = playlist.songs.findIndex(s => s.id === songId)
      if (index === -1)
        return
      playlist.songs.splice(index, 1)
    },
    createPlaylist(name: string) {
      const id = nanoid()
      this.list.push({ id, name, songs: [] })
    },
    removePlaylist(playlistId: string | number) {
      const index = this.list.findIndex(p => p.id === playlistId)
      if (index === -1)
        return
      this.list.splice(index, 1)
    },
  },

})
