<template>
  <div class="info-wrapper">
    <div :class="['row gx-5 py-4', !showInfo && 'blurred']">
      <div class="col-12">
        <h4 class="section-title mb-3">자가진단 정보</h4>

        <!-- ✅ 두 개씩 나열하는 그리드 -->
        <div
          v-for="(row, rowIndex) in householdRows"
          :key="rowIndex"
          class="info-grid"
        >
          <div
            v-for="(item, colIndex) in row"
            :key="colIndex"
            class="info-item"
          >
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value }}</span>
          </div>
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
const { householdInfo } = storeToRefs(store);

const showInfo = ref(false);

// ✅ 두 개씩 짝지어 배열로 구성된 세대 정보
const householdRows = computed(() => [
  [
    { label: '거주 기간', value: householdInfo.value.residencePeriod },
    { label: '무주택 여부', value: householdInfo.value.isHomeless },
  ],
  [
    { label: '세대 구성', value: householdInfo.value.householdSize },
    { label: '혼인 여부', value: householdInfo.value.isMarried },
  ],
  [
    {
      label: '청약 통장',
      value: householdInfo.value.hasSubscriptionAccount,
    },
    { label: '대상 그룹', value: householdInfo.value.targetGroup },
  ],
  [
    { label: '총 자산', value: householdInfo.value.totalAssets },
    { label: '자동차 자산', value: householdInfo.value.vehicle },
  ],
  [
    { label: '월평균 소득', value: householdInfo.value.monthlyIncome },

    { label: '부동산 자산', value: householdInfo.value.realEstate },
  ],
]);
</script>

<style scoped>
.info-wrapper {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 2rem;
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

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem 1.5rem;
  margin-bottom: 0.5rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
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
