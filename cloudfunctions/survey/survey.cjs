const QUESTIONS = Object.freeze([
  {
    id: 'q1',
    title: '自您的直播间服务权限开通以来，您认为是否有收获？',
    answers: [
      { value: 'positive', label: '有收获' },
      { value: 'negative', label: '没收获' },
    ],
    reasons: ['跟不上老师操作节奏', '课程内容不满意'],
  },
  {
    id: 'q2',
    title: '您觉得公司软件产品对您学习证券投资技巧是否有帮助？',
    answers: [
      { value: 'positive', label: '有帮助，产品体验良好' },
      { value: 'negative', label: '帮助不大' },
    ],
    reasons: ['没时间学习', '功能太多，不会使用', '不经常登录软件，使用频率较低'],
  },
  {
    id: 'q3',
    title: '请问您对我们服务人员的响应时效及沟通态度感受如何？',
    answers: [
      { value: 'positive', label: '很好，响应及时、沟通顺畅' },
      { value: 'negative', label: '有待改善' },
    ],
    reasons: ['消息回复不及时', '服务跟踪不及时', '服务态度不好'],
  },
])

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const MAX_BODY_BYTES = 16 * 1024

class RequestError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.statusCode = statusCode
  }
}

function toDateOnly(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date, days) {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + days)
  return result
}

function normalizeAnswer(answer, question) {
  if (!answer || answer.questionId !== question.id) throw new RequestError(400, '请完整填写三道题目。')

  const option = question.answers.find((item) => item.value === answer.value)
  if (!option || !Array.isArray(answer.reasonIds)) throw new RequestError(400, '问卷答案格式不正确。')

  const reasonIds = [...new Set(answer.reasonIds)]
  if (reasonIds.some((id) => !Number.isInteger(id) || id < 0 || id >= question.reasons.length)) {
    throw new RequestError(400, '具体原因无效，请重新选择。')
  }
  if (option.value === 'negative' && reasonIds.length === 0) {
    throw new RequestError(400, '负向反馈至少需要选择一项具体原因。')
  }

  return {
    id: question.id,
    title: question.title,
    value: option.value,
    label: option.label,
    reasons: option.value === 'negative' ? reasonIds.map((id) => question.reasons[id]) : [],
  }
}

function normalizeSubmission(payload, now = new Date(), environment = process.env) {
  if (!payload || typeof payload !== 'object') throw new RequestError(400, '请求数据格式不正确。')
  if (!uuidPattern.test(payload.requestId || '')) throw new RequestError(400, '请求标识无效。')
  if (!uuidPattern.test(payload.visitorId || '')) throw new RequestError(400, '访客标识无效。')
  if (typeof payload.serviceId !== 'string' || !payload.serviceId.trim() || payload.serviceId.length > 64) {
    throw new RequestError(400, '服务标识无效。')
  }
  if (!Array.isArray(payload.answers) || payload.answers.length !== QUESTIONS.length) {
    throw new RequestError(400, '请完整填写三道题目。')
  }

  const answerMap = new Map(payload.answers.map((answer) => [answer.questionId, answer]))
  if (answerMap.size !== QUESTIONS.length) throw new RequestError(400, '问卷题目不能重复。')

  const configuredDate = environment.DEMO_SERVICE_END_DATE
  const beforeDate = configuredDate ? new Date(`${configuredDate}T00:00:00.000Z`) : now
  if (Number.isNaN(beforeDate.getTime())) throw new RequestError(500, '演示服务到期日配置无效。')

  return {
    requestId: payload.requestId,
    visitorId: payload.visitorId,
    serviceId: payload.serviceId.trim(),
    answers: QUESTIONS.map((question) => normalizeAnswer(answerMap.get(question.id), question)),
    reward: {
      days: 7,
      before: toDateOnly(beforeDate),
      after: toDateOnly(addDays(beforeDate, 7)),
      serviceName: environment.DEMO_SERVICE_NAME || '投顾服务',
      mode: 'demo',
    },
  }
}

function parseBody(event) {
  if (event.body && typeof event.body === 'object') return event.body
  if (typeof event.body !== 'string') throw new RequestError(400, '请求数据格式不正确。')
  const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body
  if (Buffer.byteLength(body, 'utf8') > MAX_BODY_BYTES) throw new RequestError(413, '请求数据过大。')
  try {
    return JSON.parse(body)
  } catch {
    throw new RequestError(400, '请求数据格式不正确。')
  }
}

function toPublicSubmission(row) {
  return {
    submissionId: row.request_id,
    requestId: row.request_id,
    submittedAt: row.submitted_at,
    answers: row.answers,
    reward: row.reward,
  }
}

module.exports = { MAX_BODY_BYTES, RequestError, normalizeSubmission, parseBody, toPublicSubmission }
