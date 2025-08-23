<script setup>
import { watch } from 'vue';
import { useAuthStore } from './stores/auth';
import { RouterView } from 'vue-router';
import DefaultLayout from './components/DefaultLayout.vue';
import ChatBot from './components/AI/ChatBot.vue';

const authStore = useAuthStore();

// 토큰 유효성 검증 함수
function validateToken(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

watch(
  () => authStore.token,
  async (newToken) => {
    // 토큰이 있고 유효할 때만 사용자 정보 조회
    if (newToken && validateToken(newToken)) {
      console.log('유효한 토큰 감지, fetchUserInfo 호출');
      try {
        await authStore.fetchUserInfo();
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        if (error.response?.status === 401) {
          // 토큰이 유효하지 않으면 클리어
          authStore.token = null;
          authStore.isLoggedIn = false;
          localStorage.removeItem('token');
        }
      }
    } else if (newToken && !validateToken(newToken)) {
      console.log('유효하지 않은 토큰 감지, 토큰 클리어');
      authStore.token = null;
      authStore.isLoggedIn = false;
      localStorage.removeItem('token');
    }
  },
  { immediate: true }
);
</script>

<template>
  <div id="app">
    <DefaultLayout>
      <RouterView />
      <ChatBot></ChatBot>
    </DefaultLayout>
  </div>
</template>

<style scoped>
#app {
  /* background-image: url('@/assets/images/background1.png'); */
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  min-height: 100vh;
}
</style>
