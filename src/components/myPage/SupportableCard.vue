<template>
  <div class="supportable-card" :class="{ disabled: householdInfoError }">
    <div class="card-header">
      <div class="header-icon">
        <span>🏠</span>
      </div>
      <div class="header-content">
        <h3 class="card-title">지원 가능한 유형</h3>
        <p class="card-subtitle">{{ 지원가능갯수 }}개 지원 가능</p>
      </div>
    </div>

    <div class="card-body">
      <div class="date-info">
        <span>📅</span>
        <span>2025-07-18 기준</span>
      </div>

      <div class="supportable-list">
        <div
          v-for="item in supportableList"
          :key="item.name"
          class="supportable-item"
        >
          <div class="item-info">
            <span class="item-name">{{ item.name }}</span>
            <span class="item-status" :class="{ available: item.available }">
              {{ item.available ? '✅ 지원 가능' : '❌ 지원 불가' }}
            </span>
          </div>
        </div>
      </div>

      <div class="card-actions">
        <button class="btn-recheck" @click="goToDiagnosis">
          <span>🔄</span>
          <span>재진단하기</span>
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
const { supportableList, householdInfoError } = storeToRefs(store);

const 지원가능갯수 = computed(
  () => supportableList.value.filter((item) => item.available).length
);

function goToDiagnosis() {
  router.push({ name: 'SelfCheck' });
}
</script>

<style scoped>
.supportable-card {
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

.supportable-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #3b82f6;
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
  background: #f3f4f6;
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
  gap: 12px;
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

.supportable-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.supportable-item {
  padding: 8px 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 0.85rem;
  color: #374151;
  font-weight: 500;
}

.item-status {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  background: #f3f4f6;
  color: #6b7280;
}

.item-status.available {
  background: #d1fae5;
  color: #065f46;
}

.card-actions {
  margin-top: 4px;
}

.btn-recheck {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-recheck span:first-child {
  font-size: 14px;
}

/* 자가진단 실패 시 비활성화 */
.disabled {
  opacity: 0.6;
  pointer-events: none;
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
  color: #dc2626;
  font-weight: 600;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  border-radius: 16px;
  z-index: 10;
  text-align: center;
  padding: 1.5rem;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .supportable-card {
    padding: 16px;
    max-width: 280px;
  }

  .header-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .card-title {
    font-size: 0.95rem;
  }

  .btn-recheck {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
