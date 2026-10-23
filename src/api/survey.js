import { submitSurveyMock } from '@/mocks/survey'

export async function submitSurvey(payload) {
  if (import.meta.env.DEV) return submitSurveyMock(payload)

  const response = await fetch('/api/surveys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  if (!response.ok) throw new Error('提交失败，请稍后重试。')
  return response.json()
}
