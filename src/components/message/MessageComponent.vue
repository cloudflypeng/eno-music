<script lang="ts" setup>
const props = defineProps<{
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
}>()
const { type, message } = props
</script>

<template>
  <div class="message" :class="type">
    {{ message }}
  </div>
</template>

<style scoped>
.message {
  position: fixed;
  top: 20px;
  left: 50%;
  /* transform: translateX(-50%); */
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 16px;
  z-index: 9999;
}

.info {
  background-color: #e6f7ff;
  border: 1px solid #91d5ff;
  color: #1890ff;
}

.success {
  background-color: #f6ffed;
  border: 1px solid #b7eb8f;
  color: #52c41a;
}

.warning {
  background-color: #fffbe6;
  border: 1px solid #ffe58f;
  color: #faad14;
}

.error {
  background-color: #fff2f0;
  border: 1px solid #ffccc7;
  color: #ff4d4f;
}
</style>
