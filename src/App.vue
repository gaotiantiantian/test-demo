<script setup>
import { ref } from 'vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import SurveySuccess from '@/components/survey/SurveySuccess.vue'
import SurveyView from '@/components/survey/SurveyView.vue'
import { submitSurvey } from '@/api/survey'

const pageState = ref('survey')
const submission = ref(null)
const submitError = ref('')

async function handleSubmit(answers) {
  if (pageState.value === 'submitting') return

  pageState.value = 'submitting'
  submitError.value = ''

  try {
    submission.value = await submitSurvey({
      requestId: crypto.randomUUID(),
      serviceId: 'demo-service',
      answers,
    })
    pageState.value = 'success'
    window.scrollTo({ top: 0, behavior: 'instant' })
  } catch (error) {
    submitError.value = error instanceof Error ? error.message : '提交失败，请稍后重试。'
    pageState.value = 'survey'
  }
}
</script>

<template>
  <SurveySuccess v-if="pageState === 'success'" :submission="submission" />
  <SurveyView v-else :submitting="pageState === 'submitting'" @submit="handleSubmit" />
  <p v-if="submitError" class="global-error" role="alert">{{ submitError }}</p>
  <LoadingOverlay :visible="pageState === 'submitting'" />
</template>

<style scoped>
.global-error {
  position: fixed;
  z-index: 20;
  right: 16px;
  bottom: 16px;
  left: 16px;
  max-width: 398px;
  margin: 0 auto;
  padding: 12px 16px;
  border-radius: 6px;
  color: #fff;
  background: #b52b33;
  font-size: 13px;
}
</style>
