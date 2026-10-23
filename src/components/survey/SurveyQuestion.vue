<script setup>
import selectedCorner from '@/assets/images/selected-corner.png'

const props = defineProps({
  question: { type: Object, required: true },
  answer: { type: Object, required: true },
  error: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['select', 'toggle-reason'])

function onSelect(value) {
  if (!props.disabled) emit('select', value)
}
</script>

<template>
  <section
    class="question"
    :class="{ 'question--error': error }"
    :aria-labelledby="`${question.id}-title`"
    :aria-describedby="`${question.id}-error`"
    :aria-invalid="Boolean(error)"
    :data-question-id="question.id"
    tabindex="-1"
  >
    <h2 :id="`${question.id}-title`">{{ question.title }}</h2>

    <div class="answers" role="radiogroup" :aria-labelledby="`${question.id}-title`">
      <label
        v-for="option in question.answers"
        :key="option.value"
        class="answer-option"
        :class="{ 'answer-option--selected': answer.value === option.value }"
      >
        <input
          type="radio"
          :name="question.id"
          :value="option.value"
          :checked="answer.value === option.value"
          :disabled="disabled"
          @change="onSelect(option.value)"
        />
        <span class="answer-label">{{ option.label }}</span>
        <img
          v-if="answer.value === option.value"
          class="selected-corner"
          :src="selectedCorner"
          alt=""
          aria-hidden="true"
        />
      </label>
    </div>

    <fieldset v-if="answer.value === 'negative'" class="reasons" :disabled="disabled">
      <legend>请选择具体原因<span>可多选</span></legend>
      <div class="reason-options">
        <label v-for="reason in question.reasons" :key="reason" class="reason-option">
          <input
            type="checkbox"
            :checked="answer.reasons.includes(reason)"
            @change="emit('toggle-reason', reason)"
          />
          <span>{{ reason }}</span>
        </label>
      </div>
    </fieldset>

    <p v-if="error" :id="`${question.id}-error`" class="field-error" role="alert">{{ error }}</p>
  </section>
</template>

<style scoped>
.question {
  margin: 0;
  padding: 15px 16px 16px;
  border: 0;
  border-radius: 8px;
  background: #fff;
  box-shadow: none;
  scroll-margin-top: 12px;
}

.question--error {
  box-shadow: 0 0 0 1px #ffb2b5;
}

.question:focus {
  outline: none;
}

h2 {
  margin: 0;
  color: #333;
  font-size: 16px;
  font-weight: 650;
  line-height: 1.5;
}

h2::before {
  margin-right: 6px;
  color: var(--color-accent);
  content: "*";
  font-size: 18px;
  vertical-align: -1px;
}

.answers {
  display: grid;
  gap: 8px;
  margin-top: 12px;
}

.answer-option {
  position: relative;
  display: flex;
  min-height: 44px;
  padding: 8px 12px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #444;
  background: #fff;
  box-shadow: inset 0 0 0 1px #e8e8e8;
  font-size: 15px;
  line-height: 1.5;
  text-align: center;
}

.answer-option--selected {
  padding: 8px 28px;
  color: var(--color-accent);
  background: #fff;
  box-shadow: inset 0 0 0 1px #ff777b;
  font-weight: 500;
}

.answer-option input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.selected-corner {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.answer-label {
  min-width: 0;
  max-width: 100%;
  overflow-wrap: anywhere;
}

.reasons {
  margin: 14px 0 0;
  padding: 0;
  border: 0;
}

.reasons legend {
  display: flex;
  width: 100%;
  margin: 0 0 10px;
  padding: 10px 0 0;
  align-items: center;
  border-top: 0.5px solid #e5e5e5;
  float: none;
  white-space: nowrap;
  color: #aaa;
  font-size: 14px;
}

.reason-options {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.reasons legend span {
  margin-left: 7px;
  padding: 2px 5px;
  border-radius: 3px;
  color: #777;
  background: #eee;
  font-size: 11px;
}

.reason-option {
  position: relative;
  display: flex;
  min-height: 34px;
  padding: 5px 9px;
  align-items: center;
  border-radius: 6px;
  color: #777;
  background: #f5f5f5;
  font-size: 13px;
  line-height: 1.5;
}

.reason-option input {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: 0;
  cursor: pointer;
  opacity: 0;
}

.reason-option:has(input:checked) {
  color: var(--color-accent);
  background: #fff1f1;
  font-weight: 600;
}

.field-error {
  margin: 10px 0 0;
  color: #c62832;
  font-size: 12px;
}
</style>
