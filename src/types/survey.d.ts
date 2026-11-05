export type AnswerValue = 'positive' | 'negative'

export interface SurveyAnswerPayload {
  questionId: string
  value: AnswerValue
  reasonIds: number[]
}

export interface SurveySubmissionPayload {
  requestId: string
  visitorId: string
  serviceId: string
  answers: SurveyAnswerPayload[]
}

export interface RewardResult {
  days: number
  granted: boolean
  before: string
  after: string
  nextEligibleAt: string
  serviceName: string
}
