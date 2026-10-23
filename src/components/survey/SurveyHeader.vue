<script setup>
import headerBackground from '@/assets/images/survey-header.png'
</script>

<template>
  <header class="survey-header" :style="{ backgroundImage: `url(${headerBackground})` }">
    <p class="eyebrow">每一份反馈，都很重要</p>
    <h1>产品与服务满意度调查</h1>
  </header>
</template>

<style scoped>
.survey-header {
  display: flex;
  height: auto;
  aspect-ratio: 2.5;
  margin: 0 -12px;
  padding: 34px 24px 10px;
  flex-direction: column;
  overflow: hidden;
  background-color: transparent;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.eyebrow {
  order: 2;
  margin: 7px 0 0;
  color: #66779d;
  font-size: 16px;
  font-weight: 400;
}

h1 {
  order: 1;
  margin: 0;
  color: #101b3b;
  font-size: 25px;
  font-weight: 700;
  line-height: 1.4;
}
</style>
