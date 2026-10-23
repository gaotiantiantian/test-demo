<script setup>
import { ref } from 'vue'
import successImage from '@/assets/images/survey-success.png'
import FeedbackHistory from './FeedbackHistory.vue'

defineProps({
  submission: { type: Object, required: true },
})

const expanded = ref(false)
const formatDate = (value) => value.replaceAll('-', '.')
</script>

<template>
  <main class="success-page">
    <section class="success-card">
      <img :src="successImage" alt="" aria-hidden="true" />
      <h1 tabindex="-1">感谢您的反馈</h1>
      <p class="lead">诚挚感谢您的服务反馈！<br />您的每一条评价，都是支撑我们持续改进发展的动力。</p>
      <p class="description">我们将持续优化产品性能与服务质量，为您带来更为优质的使用体验。</p>

      <div class="reward">
        <div class="reward-days">
          <div><strong>{{ submission.reward.days }}</strong><span>天</span></div>
          <small>赠送天数</small>
        </div>
        <div class="reward-copy">
          <h2>本次已赠送{{ submission.reward.days }}天服务期</h2>
          <p>{{ submission.reward.serviceName }}</p>
          <p>原到期日 {{ formatDate(submission.reward.before) }}</p>
          <p>延长后到期日 {{ formatDate(submission.reward.after) }}</p>
        </div>
      </div>

      <p class="wish">祝您万事顺遂！</p>
      <button class="history-button" type="button" :aria-expanded="expanded" @click="expanded = !expanded">
        {{ expanded ? '收起我的反馈 ↑' : '查看我的反馈 ↓' }}
      </button>
    </section>

    <FeedbackHistory v-if="expanded" :submission="submission" />
  </main>
</template>

<style scoped>
.success-page {
  width: min(100%, var(--page-width));
  min-height: 100vh;
  margin: 0 auto;
  padding: 16px 12px 32px;
}

.success-card {
  margin: 0 4px;
  padding: 24px 16px 20px;
  border: 0;
  border-radius: 12px;
  text-align: center;
  background: #fff;
  box-shadow: none;
}

.success-card > img {
  display: block;
  width: 132px;
  height: 92px;
  margin: 0 auto 15px;
  object-fit: contain;
}

h1 {
  margin: 0 0 4px;
  color: #333;
  font-size: 22px;
  font-weight: 600;
  line-height: 1.4;
}

.lead,
.description,
.wish {
  color: #777;
  font-size: 13px;
  line-height: 1.75;
}

.lead {
  display: none;
}

.description {
  display: block;
  margin: 0;
  color: #aaa;
  text-align: center;
  font-size: 14px;
  line-height: 1.55;
}

.reward {
  display: flex;
  min-height: 94px;
  margin: 16px 0 12px;
  padding: 12px;
  align-items: center;
  gap: 12px;
  border: 1px solid #ffdfbd;
  border-radius: 9px;
  text-align: left;
  background: #fff7ed;
}

.reward-days {
  display: flex;
  align-self: stretch;
  flex: 0 0 66px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-right: 1px solid #ffe5ce;
  color: #8b3f12;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.1;
}

.reward-days strong {
  font: inherit;
}

.reward-days span {
  margin-left: 2px;
  font-size: 13px;
}

.reward-days small {
  margin-top: 8px;
  font-size: 11px;
  font-weight: 400;
  line-height: 1;
}

.reward-copy h2 {
  margin: 0 0 4px;
  color: #8b3f12;
  font-size: 15px;
  line-height: 1.45;
}

.reward-copy p {
  margin: 0;
  color: #c28b67;
  font-size: 12px;
  line-height: 1.55;
}

.wish {
  display: none;
}

.history-button {
  padding: 5px 12px;
  border: 0;
  border-radius: 18px;
  color: #ff5057;
  background: #fff1f1;
  box-shadow: none;
  font-size: 13px;
  line-height: 1.5;
}
</style>
