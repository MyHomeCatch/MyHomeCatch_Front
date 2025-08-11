<template>
  <div class="score-card">
    <div class="card-header">
      <div class="header-icon">
        <span>⭐</span>
      </div>
      <div class="header-content">
        <h3 class="card-title">나의 청약 가점</h3>
        <p class="card-subtitle">{{ userInfo.additionalPoint }}점</p>
      </div>
    </div>

    <div class="card-body">
      <div class="score-display">
        <div class="score-circle">
          <div class="score-number">{{ userInfo.additionalPoint }}</div>
          <div class="score-unit">점</div>
        </div>
        <div
          class="score-grade"
          :class="getScoreGradeClass(userInfo.additionalPoint)"
        >
          {{ getScoreGrade(userInfo.additionalPoint) }}
        </div>
      </div>

      <div class="date-info">
        <span>📅</span>
        <span>{{ userInfo.additionalPointUpdatedAt }}일 기준</span>
      </div>

      <div class="card-actions">
        <button class="btn-calculate" @click="$emit('openModal')">
          <span>🧮</span>
          <span>가점 계산</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo } = storeToRefs(store);

const getScoreGrade = (score) => {
  if (score <= 10) return '낮음';
  if (score <= 30) return '보통';
  if (score <= 50) return '높음';
  return '매우 높음';
};

const getScoreGradeClass = (score) => {
  if (score <= 10) return 'grade-low';
  if (score <= 30) return 'grade-medium';
  if (score <= 50) return 'grade-high';
  return 'grade-very-high';
};
</script>

<style scoped>
.score-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 320px;
  position: relative;
  overflow: hidden;
}

.score-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #f59e0b;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.header-icon {
  width: 40px;
  height: 40px;
  background: #fef3c7;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.header-content {
  flex: 1;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 2px 0;
}

.card-subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.score-circle {
  width: 100px;
  height: 100px;
  background: #f59e0b;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.score-number {
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
}

.score-unit {
  font-size: 0.8rem;
  font-weight: 600;
  opacity: 0.9;
}

.score-grade {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.grade-low {
  background: #fee2e2;
  color: #dc2626;
}

.grade-medium {
  background: #fef3c7;
  color: #d97706;
}

.grade-high {
  background: #d1fae5;
  color: #059669;
}

.grade-very-high {
  background: #dbeafe;
  color: #2563eb;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  color: #6b7280;
  font-size: 0.8rem;
  font-weight: 500;
}

.card-actions {
  margin-top: 4px;
}

.btn-calculate {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: #f59e0b;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-calculate span:first-child {
  font-size: 14px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .score-card {
    padding: 16px;
    max-width: 280px;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .score-circle {
    width: 80px;
    height: 80px;
  }

  .score-number {
    font-size: 1.5rem;
  }

  .card-title {
    font-size: 0.95rem;
  }

  .btn-calculate {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
