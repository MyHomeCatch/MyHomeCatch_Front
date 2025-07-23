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
  await kakaoFunc();
  isLoading.value = false;
});

const kakaoFunc = async () => {
  try {
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) throw new Error('인증 코드가 없습니다.');
    const res = await authApi.kakaoLogin(code);
    if (res.token) {
      authStore.setToken(res.token);
      router.replace('/');
    } else {
      authStore.setSocialInfo({
        id: res.id,
        nickname: res.nickname,
        email: res.email,
        profile: res.profile,
        birthday: res.birthday,
        type: 'kakao',
      });
      router.push('/join');
    }
  } catch (e) {
    console.error('카카오 로그인 실패:', e);
    errorMessage.value = e.response?.data?.message || '카카오 로그인에 실패했습니다.';
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
