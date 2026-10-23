export const SURVEY_QUESTIONS = Object.freeze([
  {
    id: 'q1',
    category: '直播间体验',
    title: '自您的直播间服务权限开通以来，您认为是否有收获？',
    answers: [
      { value: 'positive', label: '有收获' },
      { value: 'negative', label: '没收获' },
    ],
    reasons: ['跟不上老师操作节奏', '课程内容不满意'],
  },
  {
    id: 'q2',
    category: '软件产品体验',
    title: '您觉得公司软件产品对您学习证券投资技巧是否有帮助？',
    answers: [
      { value: 'positive', label: '有帮助，产品体验良好' },
      { value: 'negative', label: '帮助不大' },
    ],
    reasons: ['没时间学习', '功能太多，不会使用', '不经常登录软件，使用频率较低'],
  },
  {
    id: 'q3',
    category: '客服服务体验',
    title: '请问您对我们服务人员的响应时效及沟通态度感受如何？',
    answers: [
      { value: 'positive', label: '很好，响应及时、沟通顺畅' },
      { value: 'negative', label: '有待改善' },
    ],
    reasons: ['消息回复不及时', '服务跟踪不及时', '服务态度不好'],
  },
])
