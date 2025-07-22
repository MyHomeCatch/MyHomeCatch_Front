<script setup>
import authApi from '@/api/auth';
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await googleFunc();
  isLoading.value = false;
});

const googleFunc = async () => {
  try {
    const code = new URL(window.location.href).searchParams.get('code');

    const res = await authApi.googleLogin(code); // ✅ POST 요청

    if (res.token) {
      // 로그인 성공 → 토큰 저장 후 이동
      localStorage.setItem('token', res.token);
      router.replace('/');
    } else {
      // 신규 유저 → 회원가입 페이지로
      authStore.setInfo({
        id: res.id,
        nickname: res.name, // or res.nickname
        email: res.email,
        profile: res.profile,
      });
      router.push('/join');
    }
  } catch (e) {
    console.error('구글 로그인 실패:', e);
    router.replace('/login');
  }
};
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <div v-else>
      <h1>구글 로그인 처리 중입니다...</h1>
    </div>
  </div>
</template>
