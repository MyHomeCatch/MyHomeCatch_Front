<script setup>
import authApi from '../../api/auth';
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const errorMessage = ref('');
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await googleLoginHandler();
  isLoading.value = false;
});

const googleLoginHandler = async () => {
  try {
    const code = new URL(window.location.href).searchParams.get('code');
    
    if (!code) {
      throw new Error('인증 코드가 없습니다.');
    }
    
    const res = await authApi.googleLogin(code);

    if (res.token) {
      // ✅ 토큰이 있으면 로그인 완료 → 토큰 저장 + 이동
      authStore.setToken(res.token);
      router.replace('/');
    } else {
      // ✅ 토큰이 없으면 회원가입 페이지로 값 전달
      authStore.setInfo({
        email: res.email,
        name: res.name,
      });
      router.push('/join');
    }
  } catch (e) {
    console.error('구글 로그인 실패:', e);
    errorMessage.value = e.response?.data?.message || '구글 로그인에 실패했습니다.';
    setTimeout(() => {
      router.replace('/login');
    }, 2000);
  }
};
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <div v-else-if="errorMessage" class="error-container">
      <h2>로그인 실패</h2>
      <p>{{ errorMessage }}</p>
      <p>로그인 페이지로 이동합니다...</p>
    </div>
    <div v-else>
      <!-- 실제 컨텐츠 -->
      <h1>페이지 본문입니다</h1>
    </div>
  </div>
</template>

<style scoped>
.error-container {
  text-align: center;
  padding: 2rem;
  color: #e74c3c;
}
</style>
