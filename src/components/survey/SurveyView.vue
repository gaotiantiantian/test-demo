<script setup>
import { computed, nextTick, ref } from 'vue'
import { SURVEY_QUESTIONS } from '@/constants/questions'
import { useSurveyForm } from '@/composables/useSurveyForm'
import NegativeConfirmDialog from './NegativeConfirmDialog.vue'
import SubmitButton from './SubmitButton.vue'
import SurveyHeader from './SurveyHeader.vue'
import SurveyIntro from './SurveyIntro.vue'
import SurveyQuestion from './SurveyQuestion.vue'

const props = defineProps({
  submitting: { type: Boolean, default: false },
})

const emit = defineEmits(['submit'])
const pendingNegative = ref(null)
const {
  answers,
  errors,
  completedCount,
  isComplete,
  selectAnswer,
  toggleReason,
  validate,
  toPayload,
} = useSurveyForm(SURVEY_QUESTIONS)

const pendingNegativeLabel = computed(
  () => pendingNegative.value?.answers.find((answer) => answer.value === 'negative')?.label ?? '',
)

function requestSelect(question, value) {
  if (value === 'negative') {
    pendingNegative.value = question
    return
  }
  selectAnswer(question.id, value)
}

function closeDialog() {
  pendingNegative.value = null
}

function selectPositive() {
  if (!pendingNegative.value) return
  selectAnswer(pendingNegative.value.id, 'positive')
  closeDialog()
}

async function confirmNegative() {
  if (!pendingNegative.value) return
  const questionId = pendingNegative.value.id
  selectAnswer(questionId, 'negative')
  closeDialog()
  await nextTick()
  document.querySelector(`[data-question-id="${questionId}"] .reason-option input`)?.focus()
}

async function handleSubmit() {
  const firstInvalidId = validate()
  if (firstInvalidId) {
    await nextTick()
    const card = document.querySelector(`[data-question-id="${firstInvalidId}"]`)
    card?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    card?.focus({ preventScroll: true })
    return
  }

  emit('submit', toPayload())
}
</script>

<template>
  <main class="survey-page">
    <SurveyHeader />
    <div class="survey-content">
      <SurveyIntro />

      <p class="sr-only" aria-live="polite">已完成 {{ completedCount }} / {{ SURVEY_QUESTIONS.length }}</p>

      <form novalidate @submit.prevent="handleSubmit">
        <SurveyQuestion
          v-for="question in SURVEY_QUESTIONS"
          :key="question.id"
          :question="question"
          :answer="answers[question.id]"
          :error="errors[question.id]"
          :disabled="submitting"
          @select="requestSelect(question, $event)"
          @toggle-reason="toggleReason(question.id, $event)"
        />

        <div class="submit-area">
          <SubmitButton :disabled="!isComplete || submitting" />
        </div>
        <p class="endnote">感谢您，帮助我们做得更好。</p>
      </form>
    </div>

    <NegativeConfirmDialog
      :open="Boolean(pendingNegative)"
      :negative-label="pendingNegativeLabel"
      @close="closeDialog"
      @positive="selectPositive"
      @confirm="confirmNegative"
    />
  </main>
</template>

<style scoped>
.survey-page {
  width: min(100%, var(--page-width));
  min-height: 100vh;
  margin: 0 auto;
  padding: 0 12px;
  background: var(--color-background);
}

.survey-content {
  padding-bottom: 32px;
}

form {
  display: grid;
  gap: 12px;
}

.submit-area {
  padding-top: 17px;
}

.endnote {
  display: none;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
