<script setup>
import { useApiClient } from '~/composables/api'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})
const api = useApiClient()
const info = ref({})
watch(() => props.id, () => {
  api.blbl.getRankDetail({ list_id: props.id }).then((res) => {
    info.value = res.data
  })
}, {
  immediate: true,
})
</script>

<template>
  <div min-w-30>
    <img :src="info.cover_url" w-30 h-30>
  </div>
</template>
