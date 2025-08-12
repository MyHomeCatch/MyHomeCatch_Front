<template>
  <div class="score-card">
    <div class="score-body">
      <p class="score-title">나의 청약 가점</p>
      <small class="score-date"
        >📅 {{ userInfo.additionalPointUpdatedAt }}일 기준</small
      >
      <div class="score-value">{{ userInfo.additionalPoint }}점</div>
      <button class="score-button" @click="$emit('openModal')">
        가점 계산
      </button>
    </div>
  </div>
</template>

<script setup>
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo } = storeToRefs(store);
</script>

<style scoped>
.score-card {
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
}
.score-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.score-body {
  display: flex;
  flex-direction: column;
  align-items: center;
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
