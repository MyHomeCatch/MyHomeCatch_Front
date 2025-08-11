<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import './auth.css';
import PasswordResetModal from '../../components/modals/PasswordResetModal.vue';

const router = useRouter();
const authStore = useAuthStore();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const emailError = ref('');
const passwordError = ref('');

const showPwModal = ref(false);

const handleLogin = async () => {
  // 입력값 초기화
  emailError.value = '';
  passwordError.value = '';
  errorMessage.value = '';

  // 유효성 검사
  if (!email.value || email.value.trim() === '') {
    emailError.value = '이메일을 입력해주세요.';
    return;
  }
  if (!password.value || password.value.trim() === '') {
    passwordError.value = '비밀번호를 입력해주세요.';
    return;
  }

  const result = await authStore.login({
    email: email.value,
    password: password.value,
  });

  if (result.success) {
    router.push('/');
  } else {
    if (result.message && result.message.includes('이메일')) {
      emailError.value = result.message;
    } else if (result.message && result.message.includes('비밀번호')) {
      passwordError.value = result.message;
    } else {
      errorMessage.value = result.message;
    }
  }
};

const goToSignUp = () => {
  authStore.resetAll();
  router.push('/join');
};

const redirect_uri = 'http://localhost:5173/auth/loading';
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=88bfa8b4d388fa64195c1c13747bc0ff&redirect_uri=${redirect_uri}&response_type=code&prompt=select_account`;

const kakaoLogin = () => {
  window.location.href = kakaoURL;
};

const google_redirect_uri = 'http://localhost:5173/auth/googleloading';
const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=621454264251-e7vmm3ltoi2p27krvctie68fjtnjhfub.apps.googleusercontent.com&redirect_uri=${google_redirect_uri}&response_type=code&scope=email%20profile`;

const handleGoogleLogin = () => {
  window.location.href = googleURL;
};
</script>

<template>
  <div class="auth-bg">
    <div class="auth-card">
      <div class="auth-card-bar"></div>
      <h2 class="auth-title">로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="auth-input-group">
          <label>이메일</label>
          <input type="email" v-model="email" required />
          <div v-if="emailError" class="auth-error">{{ emailError }}</div>
        </div>
        <div class="auth-input-group">
          <label>비밀번호</label>
          <input type="password" v-model="password" required />
          <div v-if="passwordError" class="auth-error">{{ passwordError }}</div>
        </div>
        <div class="auth-divider"><span>소셜 로그인</span></div>
        <div class="auth-social-row">
          <button
            type="button"
            class="auth-social-btn"
            @click="handleGoogleLogin"
          >
            <span class="icon-google"></span> 구글
          </button>
          <button @click="kakaoLogin" type="button" class="auth-social-btn">
            <span class="icon-kakao"></span> 카카오
          </button>
        </div>
        <div class="auth-forgot">
          <a href="#" @click.prevent="showPwModal = true">비밀번호 찾기</a>
        </div>
        <button type="submit" class="auth-submit">로그인</button>
        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
      </form>
    </div>
    <div class="auth-side">
      <p>계정이 없으신가요?</p>
      <button class="auth-side-btn" @click="goToSignUp">회원가입</button>
    </div>
    <PasswordResetModal :show="showPwModal" @close="showPwModal = false" />
  </div>
</template>
