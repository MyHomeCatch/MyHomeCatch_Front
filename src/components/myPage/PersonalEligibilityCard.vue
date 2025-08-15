<template>
  <div class="eligibility-card-compact">
    <div class="card-header">
      <h3>나의 자격 심사 결과</h3>
      <span :class="['overall-status', eligibility.overallStatus.toLowerCase()]">
        {{ overallStatusText }}
      </span>
    </div>

    <div class="card-body">
      <h4 @click="isDetailsVisible = !isDetailsVisible" class="details-header">
        상세 결과
        <span class="toggle-icon">{{ isDetailsVisible ? '▼' : '▶' }}</span>
      </h4>

      <ul v-if="isDetailsVisible" class="detailed-status-list">
        <li v-for="(status, key) in eligibility.detailedStatus" :key="key">
          <strong>{{ statusMap[key] || key }}</strong>
          <span :class="['status-badge', status.toLowerCase()]">
            {{ statusTextMap[status] || status }}
          </span>
        </li>
      </ul>

      <div v-if="filteredNotes.length > 0" class="notes-section">
        <h4 @click="isNotesVisible = !isNotesVisible" class="notes-header">
          참고 사항
          <span class="toggle-icon">{{ isNotesVisible ? '숨기기' : '보기' }}</span>
        </h4>
        <ul v-if="isNotesVisible" class="notes-list">
          <li v-for="(note, index) in filteredNotes" :key="index">{{ note }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';

// props 정의는 기존과 동일
const props = defineProps({
  eligibility: {
    type: Object,
    required: true,
  },
});

// --- 기능 추가 ---
// 1. 참고 사항을 보여줄지 여부를 결정하는 상태 변수
const isNotesVisible = ref(false);
const isDetailsVisible = ref(false);

// 2. 'null'이 포함된 노트를 제외하고 필터링하는 computed 속성
const filteredNotes = computed(() => {
  // eligibility.notes가 없거나 배열이 아니면 빈 배열 반환
  if (!props.eligibility.notes || !Array.isArray(props.eligibility.notes)) {
    return [];
  }
  // 'null' 문자열이 포함되지 않은 노트만 필터링
  return props.eligibility.notes.filter(note => !note.includes('null'));
});

// --- 기존 computed 속성들 (일부 수정) ---
const overallStatusText = computed(() => {
  const statusMap = {
    ELIGIBLE: '적격',
    INELIGIBLE: '부적격',
    NEEDS_REVIEW: '재검토 필요',
  };
  return statusMap[props.eligibility.overallStatus] || props.eligibility.overallStatus;
});

const statusTextMap = {
  ELIGIBLE: '적격',
  INELIGIBLE: '부적격',
  NEEDS_REVIEW: '재검토 필요',
  NOT_APPLICABLE: '해당 없음',
};

const statusMap = {
  homeless: '무주택 여부',
  income: '소득 기준',
  total_asset: '총 자산',
  car_value: '자동차 가액',
  real_estate_value: '부동산 가액',
  residence_period_value: '거주 기간',
  subscription_period_value: '청약 가입 기간',
  household_members_value: '가구원 수',
  types: '신청 유형',
};
</script>

<style scoped>
/* 전체적으로 패딩과 폰트 크기를 줄여 요약된 느낌을 줍니다. */
.eligibility-card-compact {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 20px;
  margin-top: 20px;
  color: #333;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.card-header h3 {
  margin: 0;
  font-size: 18px; /* 크기 축소 */
  font-weight: 700;
}

.overall-status {
  padding: 5px 12px; /* 패딩 축소 */
  border-radius: 16px;
  font-weight: 600;
  font-size: 13px; /* 크기 축소 */
}

/* 상태별 색상은 기존과 유사하게 유지 */
.overall-status.eligible { background-color: #e6f7ed; color: #28a745; }
.overall-status.ineligible { background-color: #ffe6e6; color: #dc3545; }
.overall-status.needs_review { background-color: #fff3cd; color: #ffc107; }

.card-body h4 {
  font-size: 16px; /* 크기 축소 */
  color: #4a4a4a;
  margin-top: 20px;
  margin-bottom: 10px;
}

.details-header {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none; /* 텍스트 선택 방지 */
  padding: 10px 5px;
  border-radius: 5px;
  transition: background-color 0.2s ease;
}



.detailed-status-list {
  /* 부드러운 애니메이션 효과를 위한 설정 */
  animation: fadeIn 0.5s ease;
  margin-top: 10px;
  list-style: none;
  padding: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detailed-status-list li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0; /* 패딩 축소 */
  font-size: 14px;
  border-bottom: 1px dashed #f5f5f5;
}

.detailed-status-list li:last-child { border-bottom: none; }

.status-badge {
  padding: 4px 10px; /* 패딩 축소 */
  border-radius: 12px;
  font-size: 12px;
}

.status-badge.eligible { background-color: #d4edda; color: #155724; }
.status-badge.ineligible { background-color: #f8d7da; color: #721c24; }
.status-badge.needs_review { background-color: #fff3cd; color: #856404; }
.status-badge.not_applicable { background-color: #e2e3e5; color: #495057; }

/* --- 토글 기능 관련 스타일 --- */
.notes-section {
  margin-top: 20px;
  border-top: 1px solid #f0f0f0;
  padding-top: 10px;
}

.notes-header {
  cursor: pointer; /* 클릭 가능하도록 커서 변경 */
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none; /* 텍스트 선택 방지 */
}

.toggle-icon {
  font-size: 12px;
  color: #6c757d;
}

.notes-list {
  list-style: disc;
  padding-left: 20px;
  margin-top: 10px;
  font-size: 13px; /* 크기 축소 */
  color: #555;
  background-color: #fafafa;
  border-radius: 5px;
  padding: 10px 10px 10px 25px;
    animation: fadeIn 0.5s ease;
}

.notes-list li {
  margin-bottom: 5px;
  line-height: 1.5;
}
</style>