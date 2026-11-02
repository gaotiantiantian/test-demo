import { describe, expect, it } from 'vitest'
import { normalizeSubmissionPayload, toApiSubmission } from '../../api/_lib/survey.js'

const validPayload = {
  requestId: '018f8f8e-7d30-7c22-9d60-3d0bdc531111',
  serviceId: 'demo-service',
  answers: [
    { questionId: 'q1', value: 'positive', reasonIds: [] },
    { questionId: 'q2', value: 'negative', reasonIds: [0, 1] },
    { questionId: 'q3', value: 'positive', reasonIds: [] },
  ],
}

describe('server survey normalization', () => {
  it('normalizes answers and creates a demo reward', () => {
    const result = normalizeSubmissionPayload(validPayload, new Date('2026-11-02T00:00:00.000Z'))

    expect(result.answers[1].reasons).toEqual(['没时间学习', '功能太多，不会使用'])
    expect(result.reward).toMatchObject({ days: 7, before: '2026-11-02', after: '2026-11-09', mode: 'demo' })
  })

  it('rejects a negative answer without a reason', () => {
    const payload = structuredClone(validPayload)
    payload.answers[1].reasonIds = []

    expect(() => normalizeSubmissionPayload(payload)).toThrow('负向反馈至少需要选择一项具体原因。')
  })

  it('maps a database row to the public response', () => {
    const result = toApiSubmission({
      id: 'submission-id',
      request_id: validPayload.requestId,
      submitted_at: '2026-11-02T00:00:00.000Z',
      answers: [],
      reward: {},
    })

    expect(result).toEqual({
      submissionId: 'submission-id',
      requestId: validPayload.requestId,
      submittedAt: '2026-11-02T00:00:00.000Z',
      answers: [],
      reward: {},
    })
  })
})
