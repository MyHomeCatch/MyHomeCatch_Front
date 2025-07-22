<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import './auth.css';
import { checkEmailRequest } from '../../api/auth';

const router = useRouter();
const name = ref('');
const nickname = ref('');
const address = ref('');
const password = ref('');
const errorMessage = ref('');

const email = ref('');
const emailInput = ref(null);
const emailCheckMessage = ref('');
const emailChecking = ref(false);
const emailChecked = ref(false); // 중복확인 성공 여부


const checkEmail = async () => {
  if (!emailInput.value.checkValidity()) {
    emailInput.value.reportValidity();
    return;
  }
  emailCheckMessage.value = '';
  emailChecking.value = true;
  try {
    const response = await checkEmailRequest(email.value);
    if (response.data.available) {
      emailCheckMessage.value = '사용 가능한 이메일입니다.';
      emailChecked.value = true;
    } else {
      emailCheckMessage.value = '이미 사용 중인 이메일입니다.';
      emailChecked.value = false;
    }
  } catch (err) {
    emailCheckMessage.value = '오류가 발생했습니다.';
    emailChecked.value = false;
  } finally {
    emailChecking.value = false;
  }
};
const checkNickname = () => {
  // 닉네임 중복 확인 로직
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

const resetEmail = () => {
  emailChecked.value = false;
  email.value = '';
  emailCheckMessage.value = '';
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
            <input
              ref="emailInput"
              type="email"
              v-model="email"
              required
              autocomplete="username"
              :readonly="emailChecked"
              :class="{'input-checked': emailChecked}"
            />
            <!-- 메시지 표시 -->
            <div v-if="emailCheckMessage" class="auth-error" style="margin-top: 4px;">{{ emailCheckMessage }}</div>
          </div>
          <button
            v-if="!emailChecked"
            type="button"
            class="auth-check-btn"
            @click="checkEmail"
            :disabled="emailChecking"
          >
            중복 확인
          </button>
          <button
            v-else
            type="button"
            class="auth-check-btn"
            @click="resetEmail"
            style="background: #fff; color: #8ab191; border: 1.5px solid #8ab191;"
          >
            이메일 다시 입력
          </button>
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
        <button type="submit" class="auth-submit">Sign Up</button>
        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
      </form>
    </div>
  </div>
</template>
