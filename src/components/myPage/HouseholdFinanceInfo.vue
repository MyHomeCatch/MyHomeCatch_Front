<template>
  <div class="info-wrapper position-relative mt-4 mx-4">
    <div :class="['row', !showInfo && 'blurred']">
      <div class="col-md-6">
        <h3 class="fw-bold">세대 정보 ✏️</h3>
        <p>세대 구성: 4인</p>
        <p>월 소득: 80% 이하</p>
        <p>총 자산: 3억 5,000만 원 이하</p>
        <p>자동차: TESLA X</p>
        <p>세대 유형: 청년</p>
      </div>
      <div class="col-md-6">
        <h3 class="fw-bold">자금</h3>
        <p>월 소득: 999만</p>
        <p>보유 현금: 9,999만</p>
        <p>월 저축액: 99만</p>
      </div>
    </div>

    <button v-if="!showInfo" class="center-button" @click="showInfo = true">
      자격진단 하러가기
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const showInfo = ref(false);
</script>

<style scoped>
.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
  transition: filter 0.3s ease;
}

.info-wrapper {
  position: relative;
  min-height: 300px;
}

.center-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  padding: 0.8rem 2rem;
  font-weight: bold;
  background-color: white;
  color: #198754;
  border: 1px solid #198754;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.center-button:hover {
  background-color: #198754;
  color: white;
}
</style>
