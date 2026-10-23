import { SURVEY_QUESTIONS } from '@/constants/questions'

export async function submitSurveyMock(payload) {
  await new Promise((resolve) => window.setTimeout(resolve, 900))

  const answers = payload.answers.map((answer) => {
    const question = SURVEY_QUESTIONS.find((item) => item.id === answer.questionId)
    const option = question.answers.find((item) => item.value === answer.value)
    return {
      id: question.id,
      title: question.title,
      value: answer.value,
      label: option.label,
      reasons: answer.reasonIds.map((index) => question.reasons[index]).filter(Boolean),
    }
  })

  return {
    submissionId: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
    answers,
    reward: {
      days: 7,
      before: '2026-11-29',
      after: '2026-12-06',
      serviceName: '投顾服务',
    },
  }
}
