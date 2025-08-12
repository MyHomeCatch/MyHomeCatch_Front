<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goToMain() {
  router.push('/');
}
</script>

<template>
  <div class="page-wrapper">
    <div class="card">
      <!-- 동그라미 체크 아이콘 -->
      <div class="check-circle">
        <svg
          class="check-icon"
          fill="none"
          stroke="currentColor"
          stroke-width="3"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h2 class="title">회원 탈퇴가 완료되었습니다.</h2>
      <p class="subtitle">그동안 MyHomeCatch를 이용해주셔서 감사합니다.</p>

      <button class="main-button" @click="goToMain">메인으로 돌아가기</button>
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f9fa;
}

.card {
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  text-align: center;
  max-width: 360px;
  width: 100%;
}

.check-circle {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background-color: #e6f4ea;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  width: 40px;
  height: 40px;
  color: #2ecc71;
}

.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.subtitle {
  font-size: 14px;
  color: #666;
  margin-bottom: 32px;
}

.main-button {
  padding: 12px 24px;
  background-color: #3498db;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.main-button:hover {
  background-color: #2980b9;
}
</style>
