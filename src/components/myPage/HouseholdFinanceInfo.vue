<template>
  <div class="info-wrapper">
    <div :class="['row gx-5 py-4', !showInfo && 'blurred']">
      <div class="col-md-6">
        <h4 class="section-title mb-3">세대 정보</h4>
        <div
          class="info-line"
          v-for="(value, label) in householdDisplay"
          :key="label"
        >
          <span class="label">{{ label }}</span>
          <span class="value">{{ value }}</span>
        </div>
      </div>
      <div class="col-md-6">
        <h4 class="section-title mb-3">자금</h4>
        <div
          class="info-line"
          v-for="(value, label) in financialDisplay"
          :key="label"
        >
          <span class="label">{{ label }}</span>
          <span class="value">{{ value }}</span>
        </div>
      </div>
    </div>

    <button v-if="!showInfo" class="center-button" @click="showInfo = true">
      자격진단 하러가기
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { householdInfo, financialInfo } = storeToRefs(store);

const showInfo = ref(false);

const householdDisplay = computed(() => ({
  '세대 구성': householdInfo.value.householdSize,
  '월 소득': householdInfo.value.incomeLevel,
  '총 자산': householdInfo.value.totalAssets,
  자동차: householdInfo.value.vehicle,
  '세대 유형': householdInfo.value.type,
}));

const financialDisplay = computed(() => ({
  '월 소득': financialInfo.value.monthlyIncome,
  '보유 현금': financialInfo.value.cash,
  '월 저축액': financialInfo.value.monthlySaving,
}));
</script>

<style scoped>
.info-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 2rem;
  background-color: transparent;
  position: relative;
  min-height: 300px;
}

.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.info-line {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 1.5rem;
  padding: 0.3rem 0;
  font-size: 0.95rem;
}

.label {
  color: #666;
  font-weight: 600;
  min-width: 100px;
  flex-shrink: 0;
}

.value {
  color: #222;
  font-weight: 500;
  word-break: keep-all;
}

.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
  transition: filter 0.3s ease;
}

.center-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  padding: 0.8rem 2.2rem;
  font-weight: bold;
  background-color: white;
  color: #198754;
  border: 2px solid #198754;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
}

.center-button:hover {
  background-color: #198754;
  color: white;
}
</style>
