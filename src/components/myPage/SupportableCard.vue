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
  width: 260px;
  padding: 1rem;
  border-radius: 14px;
  background-color: #f5eee6;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  font-family: 'Pretendard', sans-serif;
  text-align: center;
  margin-top: 1.2rem;
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
  font-size: 0.88rem;
  font-weight: 600;
  color: #444;
  text-align: center;
}

.supportable-date {
  font-size: 0.72rem;
  color: #888;
  margin-bottom: 0.6rem;
}

.supportable-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.supportable-item {
  font-size: 0.82rem;
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0.5rem;
  border-top: 1px solid #eee;
}

.badge {
  font-size: 0.7rem;
  padding: 0.25em 0.6em;
  border-radius: 0.5rem;
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

.disabled {
  opacity: 0.6;
  pointer-events: none;
  position: relative;
}
.disabled::after {
  content: '자가진단이 필요합니다';
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #b23c3c;
  font-weight: 600;
  background: #f5eee6;
  padding: 0.6rem 1.2rem;
  border-radius: 10px;
  z-index: 10;
}
</style>
