const STORAGE_KEY = 'survey-visitor-id'
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

let fallbackVisitorId = ''

export function useVisitorId() {
  try {
    const storedVisitorId = window.localStorage.getItem(STORAGE_KEY)
    if (uuidPattern.test(storedVisitorId || '')) return storedVisitorId

    const visitorId = crypto.randomUUID()
    window.localStorage.setItem(STORAGE_KEY, visitorId)
    return visitorId
  } catch {
    fallbackVisitorId ||= crypto.randomUUID()
    return fallbackVisitorId
  }
}
