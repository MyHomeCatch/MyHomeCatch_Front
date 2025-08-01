<template>
  <div class="info-wrapper">
    <div :class="['row gx-5 py-4', householdInfoError && 'blurred']">
      <div class="col-12">
        <h4 class="section-title mb-3">자가진단 정보</h4>

        <!-- ✅ 반응형 Bootstrap Grid -->
        <div class="row g-3">
          <div
            class="col-12 col-md-6"
            v-for="(item, index) in flattenedHouseholdRows"
            :key="index"
          >
            <div class="d-flex gap-2">
              <div class="label">{{ item.label }}</div>
              <div class="value">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <button
      v-if="householdInfoError"
      class="center-button"
      @click="goToDiagnosis"
    >
      자가진단 하러가기
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const router = useRouter();
const store = useMyPageStore();
const { householdInfo, householdInfoError } = storeToRefs(store);

function formatHouseholdSize(raw) {
  if (!raw) return '-';
  const [adults, children] = raw.split(',');
  return `${adults}인 (본인 포함)\n자녀 ${children}명(태아 포함)`;
}

const flattenedHouseholdRows = computed(() => {
  return [
    { label: '거주 기간', value: householdInfo.value.residencePeriod },
    { label: '무주택 여부', value: householdInfo.value.isHomeless },
    {
      label: '세대 구성',
      value: formatHouseholdSize(householdInfo.value.householdSize),
    },
    { label: '혼인 여부', value: householdInfo.value.isMarried },
    {
      label: '청약 통장',
      value: householdInfo.value.hasSubscriptionAccount,
    },
    { label: '대상 그룹', value: householdInfo.value.targetGroup },
    { label: '총 자산', value: householdInfo.value.totalAssets },
    { label: '자동차 자산', value: householdInfo.value.vehicle },
    { label: '월평균 소득', value: householdInfo.value.monthlyIncome },
    { label: '부동산 자산', value: householdInfo.value.realEstate },
  ];
});

function goToDiagnosis() {
  router.push({ name: 'SelfCheck' });
}
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

.label {
  color: #666;
  font-weight: 600;
  min-width: 90px;
}

.value {
  color: #222;
  font-weight: 500;
  word-break: keep-word;
  white-space: pre-line;
}

.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
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
}
</style>
