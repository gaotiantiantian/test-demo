const cloudbase = require('@cloudbase/node-sdk')
const { RequestError, normalizeSubmission, parseBody, toPublicSubmission } = require('./survey.cjs')

const app = cloudbase.init({ env: cloudbase.SYMBOL_CURRENT_ENV })
const database = app.rdb()
const surveyTable = () => database.from('survey_submissions')

function response(statusCode, data, event) {
  const allowedOrigin = process.env.ALLOWED_ORIGIN
  const requestOrigin = event.headers?.origin || event.headers?.Origin
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  }

  if (allowedOrigin && requestOrigin === allowedOrigin) headers['Access-Control-Allow-Origin'] = requestOrigin

  return { statusCode, headers, body: JSON.stringify(data) }
}

async function getSubmission(id) {
  const { data, error } = await surveyTable()
    .select('request_id, visitor_id, service_id, answers, reward, reward_granted, submission_mode, submitted_at')
    .eq('request_id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

async function checkDatabase() {
  const { error } = await surveyTable().select('request_id', { count: 'exact', head: true })
  if (error) throw error
}

async function saveSubmission(payload) {
  const existing = await getSubmission(payload.requestId)
  if (existing) return existing

  const submittedAt = new Date().toISOString()
  const { data, error } = await database.rpc('submit_survey_with_reward_limit', {
    p_request_id: payload.requestId,
    p_visitor_id: payload.visitorId,
    p_service_id: payload.serviceId,
    p_answers: payload.answers,
    p_reward: payload.reward,
    p_submission_mode: 'demo',
    p_submitted_at: submittedAt,
  })
  if (error) {
    const racedDocument = await getSubmission(payload.requestId)
    if (racedDocument) return racedDocument
    throw error
  }

  return Array.isArray(data) ? data[0] : data
}

exports.main = async (event) => {
  const method = event.httpMethod || event.requestContext?.httpMethod || 'POST'
  if (method === 'OPTIONS') return response(204, {}, event)

  try {
    if (method === 'GET') {
      const id = event.queryStringParameters?.id
      if (!id) {
        await checkDatabase()
        return response(200, { status: 'ok', database: 'connected' }, event)
      }
      const document = await getSubmission(id)
      if (!document) throw new RequestError(404, '未找到反馈记录。')
      return response(200, toPublicSubmission(document), event)
    }

    if (method !== 'POST') throw new RequestError(405, '请求方法不支持。')
    const payload = normalizeSubmission(parseBody(event))
    const document = await saveSubmission(payload)
    return response(201, toPublicSubmission(document), event)
  } catch (error) {
    console.error('survey function error', {
      code: error.code,
      name: error.name,
      requestId: event.body?.requestId,
    })
    const statusCode = error instanceof RequestError ? error.statusCode : 500
    const message = error instanceof RequestError ? error.message : '服务暂时不可用，请稍后重试。'
    return response(statusCode, { error: message }, event)
  }
}
