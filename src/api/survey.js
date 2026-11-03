import { submitSurveyMock } from '@/mocks/survey'

export async function submitSurvey(payload) {
  const useMock = import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_API !== 'false'
  if (useMock) return submitSurveyMock(payload)

  const functionUrl = import.meta.env.VITE_CLOUDBASE_FUNCTION_URL
  if (!functionUrl) throw new Error('云函数地址尚未配置。')

  const response = await fetch(functionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'omit',
    body: JSON.stringify(payload),
  })

  const result = await response.json().catch(() => null)
  if (!response.ok) throw new Error(result?.error || '提交失败，请稍后重试。')
  return result
}
