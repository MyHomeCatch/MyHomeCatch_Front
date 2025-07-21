<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import './auth.css';

const router = useRouter();
const name = ref('');
const nickname = ref('');
const email = ref('');
const address = ref('');
const password = ref('');
const errorMessage = ref('');

const checkNickname = () => {
  // 닉네임 중복 확인 로직
};
const checkEmail = () => {
  // 이메일 중복 확인 로직
};
const inputAddress = () => {
  // 주소 입력 로직
};

const handleSignUp = async () => {
  errorMessage.value = '';
  // 회원가입 API 호출 등 구현
  router.push('/login');
};

const goToSignIn = () => {
  router.push('/login');
};
</script>

<template>
  <div class="auth-bg">
    <div class="auth-side">
      <p>Already have an account?</p>
      <button class="auth-side-btn" @click="goToSignIn">Log In</button>
    </div>
    <div class="auth-card">
      <div class="auth-card-bar"></div>
      <h2 class="auth-title">SIGN UP</h2>
      <form @submit.prevent="handleSignUp">
        <div class="auth-input-group">
          <label>Name</label>
          <input type="text" v-model="name" required />
        </div>
        <div class="auth-input-group" style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1;">
            <label>Nickname</label>
            <input type="text" v-model="nickname" required />
          </div>
          <button type="button" class="auth-check-btn" @click="checkNickname">중복 확인</button>
        </div>
        <div class="auth-input-group" style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1;">
            <label>Email</label>
            <input type="email" v-model="email" required autocomplete="username" />
          </div>
          <button type="button" class="auth-check-btn" @click="checkEmail">중복 확인</button>
        </div>
        <div class="auth-input-group" style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1;">
            <label>Address</label>
            <input type="text" v-model="address" required readonly />
          </div>
          <button type="button" class="auth-check-btn" @click="inputAddress">주소 입력</button>
        </div>
        <div class="auth-input-group">
          <label>Password</label>
          <input type="password" v-model="password" required autocomplete="new-password" />
        </div>
        <div class="auth-divider">
          <span>Social SignUp</span>
        </div>
        <div class="auth-social-row">
          <button type="button" class="auth-social-btn">
            <span class="icon-google"></span> Google
          </button>
          <button type="button" class="auth-social-btn">
            <span class="icon-kakao"></span> Kakao
          </button>
        </div>
        <button type="submit" class="auth-submit">Sign Up</button>
        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>
