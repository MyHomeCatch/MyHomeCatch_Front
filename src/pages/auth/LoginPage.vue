<script setup>
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import './auth.css';

const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  authStore.errorMessage = '';
  const result = await authStore.login({
    email: authStore.email,
    password: authStore.password,
  });
  if (result.success) {
    router.push('/');
  } else {
    if (result.message && result.message.includes('이메일')) {
      authStore.errorMessage = result.message;
    } else if (result.message && result.message.includes('비밀번호')) {
      authStore.errorMessage = result.message;
    } else {
      authStore.errorMessage = result.message;
    }
  }
};

const goToSignUp = () => {
  router.push('/join');
};

const redirect_uri = 'http://localhost:5173/auth/loading';
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=88bfa8b4d388fa64195c1c13747bc0ff&redirect_uri=${redirect_uri}&response_type=code&prompt=select_account`;

const kakaoLogin = () => {
  window.location.href = kakaoURL;
};
</script>

<template>
  <div class="auth-bg">
    <div class="auth-card">
      <div class="auth-card-bar"></div>
      <h2 class="auth-title">LOG IN</h2>
      <form @submit.prevent="handleLogin">
        <div class="auth-input-group">
          <label>Email</label>
          <input type="email" v-model="authStore.email" required />
          <div v-if="authStore.errorMessage && authStore.errorMessage.includes('이메일')" class="auth-error">{{ authStore.errorMessage }}</div>
        </div>
        <div class="auth-input-group">
          <label>Password</label>
          <input type="password" v-model="authStore.password" required />
          <div v-if="authStore.errorMessage && authStore.errorMessage.includes('비밀번호')" class="auth-error">{{ authStore.errorMessage }}</div>
        </div>
        <div class="auth-divider"><span>Social LogIn</span></div>
        <div class="auth-social-row">
          <button type="button" class="auth-social-btn">
            <span class="icon-google"></span> Google
          </button>
          <button @click="kakaoLogin" type="button" class="auth-social-btn">
            <span class="icon-kakao"></span> Kakao
          </button>
        </div>
        <div class="auth-forgot"><a href="#">Forgot Password</a></div>
        <button type="submit" class="auth-submit">Log In</button>
        <div v-if="authStore.errorMessage && !authStore.errorMessage.includes('이메일') && !authStore.errorMessage.includes('비밀번호')" class="auth-error">{{ authStore.errorMessage }}</div>
      </form>
    </div>
    <div class="auth-side">
      <p>Don't have an account?</p>
      <button class="auth-side-btn" @click="goToSignUp">Sign Up</button>
    </div>
  </div>
</template>
