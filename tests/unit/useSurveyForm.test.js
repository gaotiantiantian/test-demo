import { describe, expect, it } from 'vitest'
import { useSurveyForm } from '../../src/composables/useSurveyForm'

const questions = [
  { id: 'q1', reasons: ['原因一'] },
  { id: 'q2', reasons: ['原因二'] },
]

describe('useSurveyForm', () => {
  it('requires reasons for negative answers', () => {
    const form = useSurveyForm(questions)
    form.selectAnswer('q1', 'negative')
    form.selectAnswer('q2', 'positive')

    expect(form.isComplete.value).toBe(false)
    expect(form.validate()).toBe('q1')
  })

  it('clears reasons after switching to a positive answer', () => {
    const form = useSurveyForm(questions)
    form.selectAnswer('q1', 'negative')
    form.toggleReason('q1', '原因一')
    form.selectAnswer('q1', 'positive')

    expect(form.answers.q1.reasons).toEqual([])
  })
})
