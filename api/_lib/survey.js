import { SURVEY_QUESTIONS } from '../../src/constants/questions.js'
import { ApiError } from './http.js'

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function toDateOnly(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date, days) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function normalizeAnswer(answer, question) {
  if (!answer || answer.questionId !== question.id) {
    throw new ApiError(400, '请完整填写三道题目。')
  }

  const option = question.answers.find((item) => item.value === answer.value)
  if (!option || !Array.isArray(answer.reasonIds)) {
    throw new ApiError(400, '问卷答案格式不正确。')
  }

  const uniqueReasonIds = [...new Set(answer.reasonIds)]
  const hasInvalidReason = uniqueReasonIds.some(
    (reasonId) => !Number.isInteger(reasonId) || reasonId < 0 || reasonId >= question.reasons.length,
  )

  if (hasInvalidReason) throw new ApiError(400, '具体原因无效，请重新选择。')
  if (option.value === 'negative' && uniqueReasonIds.length === 0) {
    throw new ApiError(400, '负向反馈至少需要选择一项具体原因。')
  }

  return {
    id: question.id,
    title: question.title,
    value: option.value,
    label: option.label,
    reasons: option.value === 'negative'
      ? uniqueReasonIds.map((reasonId) => question.reasons[reasonId])
      : [],
  }
}

export function normalizeSubmissionPayload(payload, now = new Date()) {
  if (!payload || typeof payload !== 'object') throw new ApiError(400, '请求数据格式不正确。')
  if (!uuidPattern.test(payload.requestId ?? '')) throw new ApiError(400, '请求标识无效。')
  if (typeof payload.serviceId !== 'string' || !payload.serviceId.trim() || payload.serviceId.length > 64) {
    throw new ApiError(400, '服务标识无效。')
  }
  if (!Array.isArray(payload.answers) || payload.answers.length !== SURVEY_QUESTIONS.length) {
    throw new ApiError(400, '请完整填写三道题目。')
  }

  const answerMap = new Map(payload.answers.map((answer) => [answer.questionId, answer]))
  if (answerMap.size !== SURVEY_QUESTIONS.length) throw new ApiError(400, '问卷题目不能重复。')

  const answers = SURVEY_QUESTIONS.map((question) => normalizeAnswer(answerMap.get(question.id), question))
  const configuredEndDate = process.env.DEMO_SERVICE_END_DATE
  const beforeDate = configuredEndDate ? new Date(`${configuredEndDate}T00:00:00.000Z`) : now

  if (Number.isNaN(beforeDate.getTime())) throw new ApiError(500, '演示服务到期日配置无效。')

  return {
    requestId: payload.requestId,
    serviceId: payload.serviceId.trim(),
    answers,
    reward: {
      days: 7,
      before: toDateOnly(beforeDate),
      after: toDateOnly(addDays(beforeDate, 7)),
      serviceName: process.env.DEMO_SERVICE_NAME || '投顾服务',
      mode: 'demo',
    },
  }
}

export function toApiSubmission(row) {
  return {
    submissionId: row.id,
    requestId: row.request_id,
    submittedAt: row.submitted_at,
    answers: row.answers,
    reward: row.reward,
  }
}
