<template>
  <div class="container-layout">
    <!-- 왼쪽: 유저 정보 -->
    <div class="left-panel">
      <div class="supportable-card" :class="{ disabled: householdInfoError }">
        <div class="supportable-body">
          <p class="user-name">{{ userInfo.nickname }} 님은 지금</p>
          <div class="supportable-title-wrapper">
            <p class="supportable-title">{{ availableCount }}개 지원 가능</p>
            <span
              v-if="!householdInfoError"
              class="recheck-link"
              @click="goToDiagnosis"
            >
              재진단 &gt;
            </span>
          </div>

          <small class="supportable-date">📅 2025-07-18 기준</small>

          <ul class="supportable-list">
            <li
              v-for="item in supportableList"
              :key="item.name"
              class="supportable-item"
            >
              {{ item.name }}
              <span class="badge bg-success">
                {{ item.available }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 지원/불가 공고 정보 -->
      <div class="announcement-info">
        <h3>공고 현황</h3>
        <ul>
          <li>지원 가능: {{ availableCount }}건</li>
          <li>지원 불가: {{ unavailableCount }}건</li>
        </ul>
      </div>
    </div>

    <!-- 중앙: 진단 정보 -->
    <div class="center-panel">
      <h2 class="section-title">진단 정보</h2>

      <div :class="['info-section', householdInfoError && 'blurred']">
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

        <button
          v-if="householdInfoError"
          class="center-button"
          @click="goToDiagnosis"
        >
          자가진단 하러가기
        </button>
      </div>
    </div>

    <!-- 오른쪽: 자격진단 & 가점계산 -->
    <div class="right-panel">
      <!-- 가점계산 -->
      <div class="score-calculation">
        <h3>가점 계산</h3>
        <div class="content-box">
          <div class="score-body">
            <p class="score-title">나의 청약 가점</p>
            <small class="score-date">
              📅 {{ userInfo.additionalPointUpdatedAt }}일 기준</small
            >
            <div class="score-value">{{ userInfo.additionalPoint }}점</div>
            <button class="score-button" @click="showScoreModal = true">
              가점 계산
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <SubscriptionScoreModal
    v-if="showScoreModal"
    @close="showScoreModal = false"
    @calculated="score = $event"
  />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';
import SubscriptionScoreModal from '@/components/mypage/SubscriptionScoreModal.vue';

const router = useRouter();
const store = useMyPageStore();

const showScoreModal = ref(false);
const score = ref(0);

const { userInfo, supportableList, householdInfo, householdInfoError } =
  storeToRefs(store);

onMounted(() => {
  store.getUserInfo();
  store.getHouseholdInfo();
  store.getSupportableList();
});

const availableCount = computed(
  () => supportableList.value.filter((item) => item.available).length
);
const unavailableCount = computed(
  () => supportableList.value.filter((item) => !item.available).length
);

function goToDiagnosis() {
  router.push({ name: 'SelfCheck' });
}

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

// 자격진단에 표시할 핵심 정보만 따로 추출
const qualificationItems = computed(() => [
  { label: '거주 기간', value: householdInfo.value.residencePeriod || '-' },
  { label: '무주택 여부', value: householdInfo.value.isHomeless || '-' },
  { label: '혼인 여부', value: householdInfo.value.isMarried || '-' },
  { label: '세대 구성', value: householdInfo.value.householdSize || '-' },
  {
    label: '청약 통장 가입 여부',
    value: householdInfo.value.hasSubscriptionAccount || '-',
  },
  { label: '대상 그룹', value: householdInfo.value.targetGroup || '-' },
]);
</script>

<style scoped>
.container-layout {
  display: grid;
  grid-template-columns: 0.9fr 1.7fr 0.9fr; /* 1 : 2 : 0.5 비율 */
  gap: 1.5rem;
  padding: 1.5rem;
  height: 50vh;
  box-sizing: border-box;
}

.left-panel,
.center-panel,
.right-panel {
  background-color: #fff;
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  overflow-y: auto; /* 각 칸 내부 스크롤 허용 */
  display: flex;
  flex-direction: column;
}

.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
}

.announcement-info {
  margin-top: 1.5rem;
}

.announcement-info h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.announcement-info ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.announcement-info li {
  font-size: 0.9rem;
  padding: 0.25rem 0;
}

.right-panel {
  gap: 1.5rem;
  /* flex-direction: column; 이미 flex column 으로 지정 */
}

/* SupportableCard 스타일 */
.supportable-card {
  width: 100%;
  min-height: 220px;
  padding: 1.6rem 1.4rem;
  border-radius: 14px;
  background-color: white;
  border: 1px solid #e4e4e4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  font-family: 'Pretendard', sans-serif;
  text-align: center;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.supportable-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.supportable-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.supportable-title-wrapper {
  position: relative;
  width: 100%;
}

.supportable-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2d2d2d;
  text-align: center;
  margin-bottom: 0.25rem;
}

.supportable-date {
  font-size: 0.78rem;
  color: #999;
  margin-bottom: 1rem;
}

.supportable-list {
  list-style: none;
  padding: 0;
  margin: 0;
  width: 100%;
}

.supportable-item {
  font-size: 0.95rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.55rem 0.8rem;
  border-top: 1px solid #eee;
  color: #333;
}

.badge {
  font-size: 0.85rem;
  padding: 0.45em 1em;
  border-radius: 1rem;
  color: white;
}

.bg-success {
  background-color: #3d6650;
}

.recheck-link {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 0.75rem;
  color: #999;
  cursor: pointer;
  text-decoration: underline;
}
.recheck-link:hover {
  color: #555;
}

/* 자가진단 실패 시 비활성화 */
.disabled {
  opacity: 0.55;
  pointer-events: none;
  position: relative;
}

.disabled::after {
  content: '자가진단 완료 후 확인할 수 있어요';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #b23c3c;
  font-weight: 600;
  font-size: 0.9rem;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  border-radius: 14px;
  z-index: 10;
  text-align: center;
  padding: 1rem;
}

/* HouseholdInfo 스타일 */
.info-section {
  position: relative;
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1.5rem;
  border-radius: 14px;
  background-color: #f9f9f9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  font-family: 'Pretendard', sans-serif;
  min-height: 250px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
}

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

.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.col-md-6 {
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
}

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

/* 흐림 처리 */
.blurred {
  filter: blur(5px);
  pointer-events: none;
  user-select: none;
}

/* 자가진단 버튼 */
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
  cursor: pointer;
}

.center-button:hover {
  background-color: #198754;
  color: white;
}

/* 자격진단 박스 높이 조절 */
.qualification-content {
  transition: all 0.3s ease;
  overflow-y: auto;
  height: 100%;
  min-height: 80px;
  max-height: 200px;
}

/* 미완료 시 크게 */
.large-box {
  min-height: 120px;
  max-height: 200px;
}

/* 완료 시 작게 */
.small-box {
  min-height: 80px;
  max-height: 120px;
}

/* 자격진단 리스트 스타일 */
.qualification-list {
  list-style: none;
  padding: 0.5rem 1rem;
  margin: 0;
  font-size: 0.9rem;
  color: #333;
}

.qualification-list li {
  margin-bottom: 0.4rem;
}

.user-name {
  font-weight: bold;
  font-size: 24px;
}

.score-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0; /* Add some padding */
}

.score-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2d2d2d;
  margin-bottom: 0.25rem;
}

.score-date {
  font-size: 0.78rem;
  color: #999;
}

.score-value {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3d6650;
  margin: 1.3rem 0 1.4rem;
}

.score-button {
  padding: 0.6rem 1.4rem;
  font-size: 0.9rem;
  font-weight: 600;
  background-color: white;
  color: #3d6650;
  border: 1px solid #3d6650;
  border-radius: 14px;
  transition: all 0.2s ease-in-out;
}
.score-button:hover {
  background-color: #3d6650;
  color: white;
}
</style>
