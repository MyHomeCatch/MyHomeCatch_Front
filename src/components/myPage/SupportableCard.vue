<template>
  <div class="supportable-card" :class="{ disabled: householdInfoError }">
    <div class="supportable-body">
      <div class="supportable-title-wrapper">
        <p class="supportable-title">{{ 지원가능갯수 }}개 지원 가능</p>
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
  router.push({ name: 'SelfCheck' }); // or '/self-check'
}
</script>

<style scoped>
.supportable-card {
  width: 320px;
  min-height: 220px;
  padding: 1.6rem 1.4rem;
  border-radius: 14px;
  background-color: white;
  border: 1px solid #e4e4e4;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  font-family: 'Pretendard', sans-serif;
  text-align: center;
  transition: all 0.2s ease;
  margin-top: 1.2rem;
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
</style>
