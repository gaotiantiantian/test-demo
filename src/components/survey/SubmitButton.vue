<script setup>
defineProps({
  disabled: { type: Boolean, default: false },
})
</script>

<template>
  <button class="submit-button" type="submit" :disabled="disabled">提交反馈</button>
</template>

<style scoped>
.submit-button {
  display: block;
  width: min(250px, 78%);
  min-height: 50px;
  margin: auto;
  border: 0;
  border-radius: 6px;
  color: #fff;
  background: var(--color-accent);
  box-shadow: none;
  font-size: 16px;
  font-weight: 600;
}

.submit-button:disabled {
  background: #f4b3b5;
  opacity: 1;
}
</style>
