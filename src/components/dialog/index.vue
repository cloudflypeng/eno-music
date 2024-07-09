<script setup>
// open 用v-model绑定
const props = defineProps({
  open: Boolean,
  title: String,
})
const emit = defineEmits(['visibleChange'])
const dialogRef = ref(null)

watch(() => props.open, (open) => {
  if (open)
    dialogRef.value.showModal()
  else
    dialogRef.value.close()
})
onMounted(() => {
  dialogRef.value.addEventListener('close', () => {
    emit('visibleChange', false)
  })
})
function close() {
  emit('visibleChange', false)
}
function clickDialog(e) {
  const { clientX, clientY } = e
  const { left, top, right, bottom } = dialogRef.value.getBoundingClientRect()
  if (clientX < left || clientX > right || clientY < top || clientY > bottom)
    close()
}
</script>

<template>
  <Teleport to="body">
    <dialog
      v-show="open" ref="dialogRef"
      class="bg-$eno-elevated backdrop-blur p-3 rounded-lg h-[50vh] min-w-1/3 max-w-1/2
        text-white
      "
      @click="clickDialog"
    >
      <div
        text-3xl mb-2
        class="flex justify-between"
      >
        <div>{{ props.title }}</div>
        <div
          class="i-mingcute:close-fill w-1em h-1em items-center transition-all
          transition-delay-300 hover:transform-rotate-90 cursor-pointer"
          @click.stop="close"
        />
      </div>
      <div class="max-h-[calc(100%-3rem)] max-w-[50vw] overflow-auto">
        <slot />
      </div>
    </dialog>
  </Teleport>
</template>
