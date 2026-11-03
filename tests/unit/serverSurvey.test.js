import { describe, expect, it } from 'vitest'
import surveyModule from '../../cloudfunctions/survey/survey.cjs'

const { MAX_BODY_BYTES, normalizeSubmission, parseBody, toPublicSubmission } = surveyModule

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
    const result = normalizeSubmission(validPayload, new Date('2026-11-02T00:00:00.000Z'), {})

    expect(result.answers[1].reasons).toEqual(['没时间学习', '功能太多，不会使用'])
    expect(result.reward).toMatchObject({ days: 7, before: '2026-11-02', after: '2026-11-09', mode: 'demo' })
  })

  it('rejects a negative answer without a reason', () => {
    const payload = structuredClone(validPayload)
    payload.answers[1].reasonIds = []

    expect(() => normalizeSubmission(payload)).toThrow('负向反馈至少需要选择一项具体原因。')
  })

  it('rejects an invalid reason id', () => {
    const payload = structuredClone(validPayload)
    payload.answers[1].reasonIds = [99]

    expect(() => normalizeSubmission(payload)).toThrow('具体原因无效，请重新选择。')
  })

  it('parses a base64 encoded request body', () => {
    const body = Buffer.from(JSON.stringify(validPayload)).toString('base64')

    expect(parseBody({ body, isBase64Encoded: true })).toEqual(validPayload)
  })

  it('rejects an oversized request body', () => {
    expect(() => parseBody({ body: 'a'.repeat(MAX_BODY_BYTES + 1) })).toThrow('请求数据过大。')
  })

  it('maps a PostgreSQL row to the public response', () => {
    const row = {
      request_id: validPayload.requestId,
      service_id: validPayload.serviceId,
      submitted_at: '2026-11-02T10:00:00.000Z',
      answers: [],
      reward: { mode: 'demo' },
    }

    expect(toPublicSubmission(row)).toEqual({
      submissionId: validPayload.requestId,
      requestId: validPayload.requestId,
      submittedAt: '2026-11-02T10:00:00.000Z',
      answers: [],
      reward: { mode: 'demo' },
    })
  })
})
