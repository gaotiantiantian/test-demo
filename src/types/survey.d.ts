export type AnswerValue = 'positive' | 'negative'

export interface SurveyAnswerPayload {
  questionId: string
  value: AnswerValue
  reasonIds: number[]
}

export interface SurveySubmissionPayload {
  requestId: string
  serviceId: string
  answers: SurveyAnswerPayload[]
}

export interface RewardResult {
  days: number
  before: string
  after: string
  serviceName: string
}
