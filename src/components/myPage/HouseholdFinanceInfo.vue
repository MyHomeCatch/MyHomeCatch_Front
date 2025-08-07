<template>
  <div class="info-section py-3 mt-4">
    <h2 class="section-title mb-4">자가진단 정보</h2>

    <div :class="['row g-3', householdInfoError && 'blurred']">
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
  return `${adults}인 (본인 포함)\n자녀 ${children}명 (태아 포함)`;
}

const flattenedHouseholdRows = computed(() => {
  const labelsToStrip = ['총 자산', '자동차', '월평균 소득', '부동산'];
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
  ].map(({ label, value }) => {
    const stripKeyword = labelsToStrip.find(
      (prefix) => typeof value === 'string' && value.startsWith(prefix)
    );
    if (stripKeyword) {
      return {
        label,
        value: value.replace(stripKeyword, '').trim(),
      };
    }
    return { label, value };
  });
});

function goToDiagnosis() {
  router.push({ name: 'SelfCheck' });
}
</script>

<style scoped>
/* 📦 동일한 스타일로 맞춤 */
.info-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem;
  border-radius: 14px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  font-family: 'Pretendard', sans-serif;
}

/* 📝 타이틀 */
.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1.2rem;
  color: #222;
}

/* 🧾 label-value layout */
.label {
  font-weight: 600;
  width: 90px;
  min-width: 90px;
  color: #666;
  flex-shrink: 0;
}

.value {
  font-weight: 500;
  color: #222;
  word-break: break-word;
  flex-grow: 1;
  text-align: right;
  white-space: pre-line;
}

/* 📏 행 구조 */
.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.col-md-6 {
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
}

/* 📱 모바일 대응 */
@media (max-width: 767px) {
  .value {
    text-align: left;
    margin-top: 0.2rem;
  }

  .d-flex {
    flex-direction: column;
    align-items: flex-start;
  }

  .col-md-6 {
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
}

/* 🔒 흐림 처리 */
.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

/* 🟢 자가진단 버튼 */
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.center-button:hover {
  background-color: #198754;
  color: white;
}
</style>
