import { submitSurveyMock } from '@/mocks/survey'

export async function submitSurvey(payload) {
  const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false'
  if (useMock) return submitSurveyMock(payload)

  const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

  const response = await fetch(`${apiBaseUrl}/api/surveys`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || '提交失败，请稍后重试。')
  return result
}
