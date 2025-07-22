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
  await kakaoFunc();
  isLoading.value = false;
});

const kakaoFunc = async () => {
  try {
    const code = new URL(window.location.href).searchParams.get('code');
    const res = await authApi.kakaoLogin(code);

    if (res.token) {
      // ✅ 토큰이 있으면 로그인 완료 → 토큰 저장 + 이동
      localStorage.setItem('token', res.token);
      authStore.token = res.token;
      authStore.isLoggedIn = true;
      router.replace('/');
    } else {
      authStore.setInfo({
        id: res.id,
        nickname: res.nickname,
        email: res.email,
        profile: res.profile,
        birthday: res.birthday,
      });

      // ✅ 토큰이 없으면 회원가입 페이지로 값 전달
      router.push('/join');
    }
  } catch (e) {
    console.error('카카오 로그인 실패:', e);
    router.replace('/login'); // 실패 시 fallback
  }
};
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <div v-else>
      <!-- 실제 컨텐츠 -->
      <h1>페이지 본문입니다</h1>
    </div>
  </div>
</template>
