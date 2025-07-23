<script setup>
import authApi from '../../api/auth';
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const isLoading = ref(true);
const authStore = useAuthStore();
const router = useRouter();

onMounted(async () => {
  await googleLoginHandler();
  isLoading.value = false;
});

const googleLoginHandler = async () => {
  try {
    const code = new URL(window.location.href).searchParams.get('code');
    const res = await authApi.googleLogin(code);

    if (res.token) {
      localStorage.setItem('token', res.token);
      authStore.setToken(res.token);
      router.replace('/');
    } else {
      // 신규 유저 → 회원가입 페이지로 정보 넘김
      authStore.setInfo({
        email: res.email,
        name: res.name,
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
    <div v-else>Redirecting...</div>
  </div>
</template>
