import { defineStore } from 'pinia'
import { useApiClient } from '~/composables/api'

const api = useApiClient()

export const useBlblStore = defineStore({
  id: 'blbl',
  state: () => ({
    count: 0,
    // 按年份的三个
    rankList: [],
  }),
  // 计算属性
  getters: {

  },
  actions: {
    getrankList() {
      api.blbl.getRank({
        list_type: 1,
      }).then((res) => {
        this.rankList = Object.keys(res.data.list).map((name) => {
          return {
            name,
            list: res.data.list[name],
          }
        })
      })
    },
  },
})
