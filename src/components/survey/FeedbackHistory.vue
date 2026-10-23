<script setup>
defineProps({
  submission: { type: Object, required: true },
})

const formatDateTime = (value) =>
  new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
</script>

<template>
  <section class="feedback-history">
    <header>
      <h2>第1次反馈</h2>
      <span class="submission-gift">已赠送{{ submission.reward.days }}天</span>
      <time :datetime="submission.submittedAt">{{ formatDateTime(submission.submittedAt) }}</time>
    </header>
    <article v-for="answer in submission.answers" :key="answer.id">
      <h3>{{ answer.title }}</h3>
      <div class="summary-answer">
        <strong>{{ answer.label }}</strong>
        <div v-if="answer.reasons.length" class="reason-tags">
          <span v-for="reason in answer.reasons" :key="reason">{{ reason }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.feedback-history {
  margin: 12px 4px 0;
  padding: 16px;
  border: 0;
  border-radius: 12px;
  background: #fff;
}

header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 16px;
}

header h2 {
  margin: 0;
  color: #6f4428;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}

header time {
  margin-left: auto;
  color: #999;
  font-size: 11px;
  white-space: nowrap;
}

.submission-gift {
  padding: 2px 6px;
  border-radius: 4px;
  color: var(--color-gift-text);
  background: #fff0df;
  font-size: 11px;
  line-height: 1.5;
}

article {
  padding: 0;
}

article + article {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 0.5px solid #eee;
}

article h3 {
  margin: 0 0 8px;
  color: #765f50;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
}

article strong {
  display: block;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.5;
}

.summary-answer {
  padding: 10px 12px;
  border-radius: 7px;
  color: #71492f;
  background: #f7f7f7;
}

.reason-tags {
  display: flex;
  margin-top: 7px;
  flex-wrap: wrap;
  gap: 6px;
}

.reason-tags span {
  padding: 5px 7px;
  border: 1px solid #c9ad9c;
  border-radius: 6px;
  color: #825338;
  background: transparent;
  font-size: 12px;
  line-height: 1.4;
}
</style>
