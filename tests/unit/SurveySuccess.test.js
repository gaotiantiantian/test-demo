// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import SurveySuccess from '@/components/survey/SurveySuccess.vue'

const submission = {
  submittedAt: '2026-11-05T08:00:00.000Z',
  answers: [],
  reward: {
    days: 0,
    granted: false,
    before: '2026-11-29',
    after: '2026-11-29',
    nextEligibleAt: '2026-12-05T08:00:00.000Z',
    serviceName: '投顾服务',
  },
}

describe('SurveySuccess', () => {
  it('shows the 30-day limit when a repeated submission receives no reward', () => {
    const wrapper = mount(SurveySuccess, { props: { submission } })

    expect(wrapper.text()).toContain('反馈已提交，本次不重复赠送')
    expect(wrapper.text()).toContain('下次可获奖日期 2026.12.05')
    expect(wrapper.text()).not.toContain('本次已赠送7天服务期')
  })
})
