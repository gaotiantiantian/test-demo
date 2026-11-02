import { sendJson, setCorsHeaders } from './_lib/http.js'
import { isSupabaseConfigured, supabaseRequest } from './_lib/supabase.js'

export default async function handler(request, response) {
  setCorsHeaders(request, response)

  if (request.method === 'OPTIONS') return response.status(204).end()
  if (request.method !== 'GET') return sendJson(response, 405, { status: 'method-not-allowed' })
  if (!isSupabaseConfigured()) return sendJson(response, 503, { status: 'missing-environment' })

  try {
    await supabaseRequest('survey_submissions?select=id&limit=1')
    return sendJson(response, 200, { status: 'ok', database: 'connected' })
  } catch {
    return sendJson(response, 503, { status: 'database-unavailable' })
  }
}
