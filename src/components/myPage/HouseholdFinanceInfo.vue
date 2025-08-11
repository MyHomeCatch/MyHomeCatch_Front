<template>
  <div class="household-finance-section">
    <div class="section-header">
      <div class="header-icon">
        <span>📊</span>
      </div>
      <div class="header-content">
        <h2 class="section-title">자가진단 정보</h2>
        <p class="section-subtitle">가구 및 재정 정보를 확인하세요</p>
      </div>
    </div>

    <div class="info-content" :class="{ blurred: householdInfoError }">
      <div class="info-grid">
        <div
          class="info-item"
          v-for="(item, index) in flattenedHouseholdRows"
          :key="index"
        >
          <div class="info-label">
            <span>{{ getLabelEmoji(item.label) }}</span>
            <span>{{ item.label }}</span>
          </div>
          <div class="info-value">{{ item.value || '정보 없음' }}</div>
        </div>
      </div>
    </div>

    <div v-if="householdInfoError" class="diagnosis-overlay">
      <div class="overlay-content">
        <div class="overlay-icon">
          <span>📋</span>
        </div>
        <h3 class="overlay-title">자가진단이 필요합니다</h3>
        <p class="overlay-description">
          가구 및 재정 정보를 확인하려면 자가진단을 완료해주세요
        </p>
        <button class="btn-diagnosis" @click="goToDiagnosis">
          <span>▶️</span>
          <span>자가진단 하러가기</span>
        </button>
      </div>
    </div>
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

const getLabelEmoji = (label) => {
  const emojiMap = {
    '거주 기간': '📅',
    '무주택 여부': '🏠',
    '세대 구성': '👨‍👩‍👧‍👦',
    '혼인 여부': '💕',
    '청약 통장': '💰',
    '대상 그룹': '🏷️',
    '총 자산': '💎',
    '자동차 자산': '🚗',
    '월평균 소득': '💵',
    '부동산 자산': '🏢',
  };
  return emojiMap[label] || 'ℹ️';
};

function goToDiagnosis() {
  router.push({ name: 'SelfCheck' });
}
</script>

<style scoped>
.household-finance-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;
  min-height: 280px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.info-content {
  transition: all 0.3s ease;
}

.info-content.blurred {
  filter: blur(4px);
  pointer-events: none;
  user-select: none;
  opacity: 0.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 12px;
}

.info-item {
  padding: 12px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 600;
}

.info-label span:first-child {
  font-size: 14px;
}

.info-value {
  font-size: 0.9rem;
  color: #1f2937;
  font-weight: 600;
  word-break: break-word;
  line-height: 1.4;
  white-space: pre-line;
}

.diagnosis-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 16px;
}

.overlay-content {
  text-align: center;
  padding: 1.5rem;
  max-width: 360px;
}

.overlay-icon {
  width: 60px;
  height: 60px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin: 0 auto 16px;
}

.overlay-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.overlay-description {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0 0 20px 0;
  line-height: 1.5;
}

.btn-diagnosis {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: #3b82f6;
  border: none;
  border-radius: 20px;
  color: white;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-diagnosis span:first-child {
  font-size: 14px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .household-finance-section {
    padding: 20px;
    margin-bottom: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 10px;
  }

  .info-item {
    padding: 10px;
  }

  .overlay-content {
    padding: 1rem;
  }

  .overlay-icon {
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  .overlay-title {
    font-size: 1.1rem;
  }

  .btn-diagnosis {
    padding: 10px 20px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .household-finance-section {
    padding: 16px;
  }

  .section-header {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .info-item {
    padding: 8px;
  }

  .info-value {
    font-size: 0.85rem;
  }
}
</style>
