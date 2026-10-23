import { computed, reactive } from 'vue'

function createEmptyAnswer() {
  return { value: null, reasons: [] }
}

export function useSurveyForm(questions) {
  const answers = reactive(
    Object.fromEntries(questions.map((question) => [question.id, createEmptyAnswer()])),
  )
  const errors = reactive({})

  const isQuestionComplete = (question) => {
    const answer = answers[question.id]
    return Boolean(answer.value && (answer.value === 'positive' || answer.reasons.length > 0))
  }

  const completedCount = computed(() => questions.filter(isQuestionComplete).length)
  const isComplete = computed(() => completedCount.value === questions.length)

  function selectAnswer(questionId, value) {
    answers[questionId].value = value
    if (value === 'positive') answers[questionId].reasons = []
    if (isQuestionComplete(questions.find((question) => question.id === questionId))) {
      errors[questionId] = ''
    }
  }

  function toggleReason(questionId, reason) {
    const selected = answers[questionId].reasons
    const index = selected.indexOf(reason)
    if (index === -1) selected.push(reason)
    else selected.splice(index, 1)
    if (selected.length) errors[questionId] = ''
  }

  function validate() {
    let firstInvalidId = null
    questions.forEach((question) => {
      const answer = answers[question.id]
      const message = !answer.value
        ? '请选择您的感受。'
        : answer.value === 'negative' && !answer.reasons.length
          ? '请选择至少一项具体原因。'
          : ''
      errors[question.id] = message
      if (message && !firstInvalidId) firstInvalidId = question.id
    })
    return firstInvalidId
  }

  function toPayload() {
    return questions.map((question) => {
      const answer = answers[question.id]
      return {
        questionId: question.id,
        value: answer.value,
        reasonIds: answer.reasons.map((reason) => question.reasons.indexOf(reason)),
      }
    })
  }

  return {
    answers,
    errors,
    completedCount,
    isComplete,
    selectAnswer,
    toggleReason,
    validate,
    toPayload,
  }
}
