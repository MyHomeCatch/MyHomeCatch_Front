<template>
  <div class="supportable-card">
    <div class="supportable-body">
      <p class="supportable-title">{{ 지원가능갯수 }}개 지원가능</p>
      <small class="supportable-date">📅 2025-07-18일 기준</small>

      <ul class="supportable-list">
        <li v-for="item in list" :key="item.name" class="supportable-item">
          {{ item.name }}
          <span
            class="badge"
            :class="item.available ? 'bg-success' : 'bg-danger'"
          >
            {{ item.available ? '지원가능' : '지원불가' }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({ list: Array });

const 지원가능갯수 = computed(
  () => props.list.filter((item) => item.available).length
);
</script>

<style scoped>
.supportable-card {
  width: 260px; /* 🔽 너비 축소 */
  padding: 1rem; /* 🔽 패딩 축소 */
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

.supportable-title {
  font-size: 0.88rem; /* 🔽 약간 작게 */
  font-weight: 600;
  color: #444;
  margin-bottom: 0.2rem;
}

.supportable-date {
  font-size: 0.72rem;
  color: #888;
  margin-bottom: 0.6rem; /* 🔽 여백도 소폭 축소 */
}

.supportable-list {
  list-style: none;
  padding: 0;
  width: 100%;
}

.supportable-item {
  font-size: 0.82rem; /* 🔽 폰트 크기 조정 */
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0.5rem; /* 🔽 여백 축소 */
  border-top: 1px solid #eee;
}

.badge {
  font-size: 0.7rem;
  padding: 0.25em 0.6em; /* 🔽 더 콤팩트하게 */
  border-radius: 0.5rem;
  color: white;
}

.bg-success {
  background-color: #3d6650;
}

.bg-danger {
  background-color: #d9534f;
}
</style>
