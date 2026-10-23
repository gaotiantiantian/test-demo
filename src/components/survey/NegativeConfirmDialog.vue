<script setup>
import { nextTick, ref, watch } from 'vue'

const props = defineProps({
  open: { type: Boolean, default: false },
  negativeLabel: { type: String, default: '' },
})

const emit = defineEmits(['close', 'positive', 'confirm'])
const dialog = ref(null)

watch(
  () => props.open,
  async (open) => {
    await nextTick()
    if (open && !dialog.value.open) dialog.value.showModal()
    if (!open && dialog.value.open) dialog.value.close()
  },
)
</script>

<template>
  <dialog ref="dialog" class="confirm-dialog" @close="emit('close')" @cancel="emit('close')">
    <button class="close-button" type="button" aria-label="关闭" @click="emit('close')">×</button>
    <h2>请确认您的选择</h2>
    <p>您选择了“{{ negativeLabel }}”，请确认是否选错。</p>
    <div class="actions">
      <button class="positive-button" type="button" @click="emit('positive')">误触，有收获</button>
      <button class="confirm-button" type="button" @click="emit('confirm')">确认并选择原因</button>
    </div>
  </dialog>
</template>

<style scoped>
.confirm-dialog {
  width: min(460px, calc(100vw - 32px));
  padding: 24px 18px;
  border: 0;
  border-radius: 9px;
  color: #333;
  background: #fff;
  box-shadow: 0 12px 50px rgb(0 0 0 / 12%);
}

.confirm-dialog::backdrop {
  background: rgb(0 0 0 / 73%);
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  border: 0;
  color: #999;
  background: transparent;
  font-size: 24px;
}

h2 {
  margin: 0 0 18px;
  text-align: center;
  font-size: 19px;
  font-weight: 500;
}

p {
  margin: 0;
  text-align: center;
  font-size: 16px;
  line-height: 1.7;
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 22px;
}

.actions button {
  min-width: 0;
  min-height: 42px;
  flex: 1;
  padding: 8px;
  border: 1px solid var(--color-accent);
  border-radius: 6px;
  font-size: 14px;
}

.positive-button {
  color: #fff;
  background: var(--color-accent);
}

.confirm-button {
  color: var(--color-accent);
  background: #fff;
}
</style>
