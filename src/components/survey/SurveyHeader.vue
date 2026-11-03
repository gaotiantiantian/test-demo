<script setup>
import headerBackgroundPng from '@/assets/images/survey-header.png'
import headerBackgroundWebp from '@/assets/images/survey-header.webp'
</script>

<template>
  <header class="survey-header">
    <picture class="header-background" aria-hidden="true">
      <source :srcset="headerBackgroundWebp" type="image/webp" />
      <img :src="headerBackgroundPng" alt="" fetchpriority="high" />
    </picture>
    <p class="eyebrow">每一份反馈，都很重要</p>
    <h1>产品与服务满意度调查</h1>
  </header>
</template>

<style scoped>
.survey-header {
  position: relative;
  display: flex;
  height: auto;
  aspect-ratio: 2.5;
  margin: 0 -12px;
  padding: 34px 24px 10px;
  flex-direction: column;
  overflow: hidden;
  background-color: #dbe5ff;
}

.header-background {
  position: absolute;
  z-index: 0;
  inset: 0;
}

.header-background img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.eyebrow,
h1 {
  position: relative;
  z-index: 1;
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
