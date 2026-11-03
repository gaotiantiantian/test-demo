// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurveyQuestion from '../../src/components/survey/SurveyQuestion.vue'

const question = {
  id: 'q1',
  title: '测试题目',
  answers: [
    { value: 'positive', label: '有收获' },
    { value: 'negative', label: '没收获' },
  ],
  reasons: ['原因一', '原因二'],
}

describe('SurveyQuestion', () => {
  it('emits one toggle event when a reason is selected', async () => {
    const wrapper = mount(SurveyQuestion, {
      props: {
        question,
        answer: { value: 'negative', reasons: [] },
      },
    })

    await wrapper.find('.reason-option').trigger('pointerup', { pointerType: 'touch' })
    await wrapper.find('.reason-option input').setValue(true)

    expect(wrapper.emitted('toggle-reason')).toEqual([['原因一']])
  })
})
