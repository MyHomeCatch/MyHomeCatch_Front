<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';
import './auth.css';

const router = useRouter();

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const emailError = ref('');
const passwordError = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  emailError.value = '';
  passwordError.value = '';
  errorMessage.value = '';
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
  router.push('/join');
};

const redirect_uri = 'http://localhost:5173/auth/loading';
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=88bfa8b4d388fa64195c1c13747bc0ff&redirect_uri=${redirect_uri}&response_type=code&prompt=select_account`;

const kakaoLogin = () => {
  window.location.href = kakaoURL;
};

const google_redirect_uri = 'http://localhost:5173/auth/googleloading';
// const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=621454264251-e7vmm3ltoi2p27krvctie68fjtnjhfub.apps.googleusercontent.com&redirect_uri=${encodeURIComponent(
// google_redirect_uri
// )}&response_type=code&scope=email%20profile`;

const googleURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=621454264251-e7vmm3ltoi2p27krvctie68fjtnjhfub.apps.googleusercontent.com&redirect_uri=${google_redirect_uri}&response_type=code&scope=email%20profile`;
const handleGoogleLogin = () => {
  console.log('Google login clicked');
  // alert('구글 로그인 버튼 클릭됨!');
  window.location.href = googleURL;
};

console.log('hello');
</script>

<template>
  <div class="auth-bg">
    <div class="auth-card">
      <div class="auth-card-bar"></div>
      <h2 class="auth-title">LOG IN</h2>
      <form @submit.prevent="handleLogin">
        <div class="auth-input-group">
          <label>Email</label>
          <input type="email" v-model="email" required />
          <div v-if="emailError" class="auth-error">{{ emailError }}</div>
        </div>
        <div class="auth-input-group">
          <label>Password</label>
          <input type="password" v-model="password" required />
          <div v-if="passwordError" class="auth-error">{{ passwordError }}</div>
        </div>
        <div class="auth-divider"><span>Social LogIn</span></div>
        <div class="auth-social-row">
          <button
            type="button"
            class="auth-social-btn"
            @click="handleGoogleLogin"
          >
            <span class="icon-google"></span> Google
          </button>
          <button @click="kakaoLogin" type="button" class="auth-social-btn">
            <span class="icon-kakao"></span> Kakao
          </button>
        </div>
        <div class="auth-forgot"><a href="#">Forgot Password</a></div>
        <button type="submit" class="auth-submit">Log In</button>
        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
      </form>
    </div>
    <div class="auth-side">
      <p>Don't have an account?</p>
      <button class="auth-side-btn" @click="goToSignUp">Sign Up</button>
    </div>
  </div>
</template>
