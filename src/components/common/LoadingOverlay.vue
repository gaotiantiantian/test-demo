<script setup>
import { toRef } from 'vue'
import { useFrameAnimation } from '@/composables/useFrameAnimation'

const props = defineProps({
  visible: { type: Boolean, default: false },
  label: { type: String, default: '正在提交反馈…' },
})

const { currentFrame } = useFrameAnimation(toRef(props, 'visible'))
</script>

<template>
  <Teleport to="body">
    <div v-if="visible" class="loading-overlay" role="status" aria-live="polite">
      <div class="loading-popup">
        <img class="loading-illustration" :src="currentFrame" alt="" aria-hidden="true" />
        <span>{{ label }}</span>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(0 0 0 / 35%);
}

.loading-popup {
  display: flex;
  width: 152px;
  padding: 16px 14px 15px;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border-radius: 12px;
  color: #555;
  background: #fff;
  box-shadow: 0 8px 28px rgb(0 0 0 / 12%);
  font-size: 13px;
}

.loading-illustration {
  width: 82px;
  height: 82px;
  object-fit: contain;
}
</style>
