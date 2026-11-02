import { ApiError, parseRequestBody, sendJson, setCorsHeaders } from './_lib/http.js'
import { supabaseRequest } from './_lib/supabase.js'
import { normalizeSubmissionPayload, toApiSubmission } from './_lib/survey.js'

async function findByRequestId(requestId) {
  const query = new URLSearchParams({
    select: 'id,request_id,service_id,answers,reward,submitted_at',
    request_id: `eq.${requestId}`,
    limit: '1',
  })
  const rows = await supabaseRequest(`survey_submissions?${query}`)
  return rows?.[0] ?? null
}

async function findBySubmissionId(submissionId) {
  const query = new URLSearchParams({
    select: 'id,request_id,service_id,answers,reward,submitted_at',
    id: `eq.${submissionId}`,
    limit: '1',
  })
  const rows = await supabaseRequest(`survey_submissions?${query}`)
  return rows?.[0] ?? null
}

async function createSubmission(payload) {
  const existing = await findByRequestId(payload.requestId)
  if (existing) return existing

  const record = {
    request_id: payload.requestId,
    service_id: payload.serviceId,
    answers: payload.answers,
    reward: payload.reward,
    submission_mode: 'demo',
  }

  try {
    const rows = await supabaseRequest('survey_submissions', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(record),
    })
    return rows[0]
  } catch (error) {
    if (error.databaseStatus === 409 || error.databaseCode === '23505') {
      const racedRecord = await findByRequestId(payload.requestId)
      if (racedRecord) return racedRecord
    }
    throw error
  }
}

export default async function handler(request, response) {
  setCorsHeaders(request, response)

  if (request.method === 'OPTIONS') return response.status(204).end()

  try {
    if (request.method === 'GET') {
      const submissionId = request.query?.id
      if (!submissionId) throw new ApiError(400, '缺少反馈记录标识。')
      const row = await findBySubmissionId(submissionId)
      if (!row) throw new ApiError(404, '未找到反馈记录。')
      return sendJson(response, 200, toApiSubmission(row))
    }

    if (request.method !== 'POST') {
      response.setHeader('Allow', 'GET, POST, OPTIONS')
      throw new ApiError(405, '请求方法不支持。')
    }

    const payload = normalizeSubmissionPayload(parseRequestBody(request))
    const row = await createSubmission(payload)
    return sendJson(response, 201, toApiSubmission(row))
  } catch (error) {
    const statusCode = error instanceof ApiError ? error.statusCode : 500
    const message = error instanceof ApiError ? error.message : '服务暂时不可用，请稍后重试。'
    return sendJson(response, statusCode, { error: message })
  }
}
