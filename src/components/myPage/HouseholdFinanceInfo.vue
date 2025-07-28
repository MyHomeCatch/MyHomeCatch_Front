<template>
  <div class="info-wrapper position-relative mt-4 mx-4">
    <div :class="['row', !showInfo && 'blurred']">
      <div class="col-md-6">
        <h3 class="fw-bold">세대 정보</h3>
        <p>세대 구성: {{ householdInfo.householdSize }}</p>
        <p>월 소득: {{ householdInfo.incomeLevel }}</p>
        <p>총 자산: {{ householdInfo.totalAssets }}</p>
        <p>자동차: {{ householdInfo.vehicle }}</p>
        <p>세대 유형: {{ householdInfo.type }}</p>
      </div>
      <div class="col-md-6">
        <h3 class="fw-bold">자금</h3>
        <p>월 소득: {{ financialInfo.monthlyIncome }}</p>
        <p>보유 현금: {{ financialInfo.cash }}</p>
        <p>월 저축액: {{ financialInfo.monthlySaving }}</p>
      </div>
    </div>

    <button v-if="!showInfo" class="center-button" @click="showInfo = true">
      자격진단 하러가기
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo, householdInfo, financialInfo, profileImage } =
  storeToRefs(store);

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
