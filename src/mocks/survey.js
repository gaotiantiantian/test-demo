import { SURVEY_QUESTIONS } from '@/constants/questions'

export async function submitSurveyMock(payload) {
  await new Promise((resolve) => window.setTimeout(resolve, 900))

  const submittedAt = new Date()
  const rewardStorageKey = `survey-last-reward:${payload.visitorId}:${payload.serviceId}`
  const storedRewardAt = window.localStorage.getItem(rewardStorageKey)
  const lastRewardAt = storedRewardAt ? new Date(storedRewardAt) : null
  const previousNextEligibleAt = lastRewardAt
    ? new Date(lastRewardAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    : new Date(submittedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
  const rewardGranted = !lastRewardAt || previousNextEligibleAt <= submittedAt
  const nextEligibleAt = rewardGranted
    ? new Date(submittedAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    : previousNextEligibleAt

  if (rewardGranted) window.localStorage.setItem(rewardStorageKey, submittedAt.toISOString())

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
    submittedAt: submittedAt.toISOString(),
    answers,
    reward: {
      days: rewardGranted ? 7 : 0,
      granted: rewardGranted,
      before: '2026-11-29',
      after: rewardGranted ? '2026-12-06' : '2026-11-29',
      nextEligibleAt: nextEligibleAt.toISOString(),
      serviceName: '投顾服务',
    },
  }
}
