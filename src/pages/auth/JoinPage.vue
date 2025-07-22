<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import './auth.css';
import { doList, sigugunMap } from '../../assets/addressData';
import { useAuthStore } from '../../stores/auth';

const authStore = useAuthStore();

const router = useRouter();
const emailInput = ref(null);
const nicknameInput = ref(null);

const checkEmail = async () => {
  if (!emailInput.value.checkValidity()) {
    emailInput.value.reportValidity();
    return;
  }
  await authStore.checkEmail(authStore.email);
};

const checkNickname = async () => {
  if (!nicknameInput.value.checkValidity()) {
    nicknameInput.value.reportValidity();
    return;
  }
  await authStore.checkNickname(authStore.nickname);
};

const openAddressModal = () => {
  authStore.openAddressModal();
};

const onSelectDo = (doName) => {
  authStore.onSelectDo(doName);
};

const onSelectSigugun = (sigugunName) => {
  authStore.onSelectSigugun(sigugunName);
};

const inputAddress = () => {
  openAddressModal();
};

const handleSignUp = async () => {
  authStore.errorMessage = '';
  authStore.successMessage = '';
  authStore.loading = true;

  if (!authStore.emailChecked) {
    authStore.errorMessage = '이메일 중복확인을 해주세요.';
    authStore.loading = false;
    return;
  }
  if (!authStore.nicknameChecked) {
    authStore.errorMessage = '닉네임 중복확인을 해주세요.';
    authStore.loading = false;
    return;
  }

  const result = await authStore.signup({
    name: authStore.name,
    nickname: authStore.nickname,
    email: authStore.email,
    address: authStore.address,
    password: authStore.password,
  });
  if (result.success) {
    setTimeout(() => router.push('/login'), 1000);
  }
};

const resetEmail = () => {
  authStore.resetEmail();
};

const resetNickname = () => {
  authStore.resetNickname();
};

const goToSignIn = () => {
  authStore.resetJoinLoginState();
  router.push('/login');
};

// 카카오 소셜 회원가입 일 경우 받아온 정보로 세팅
onMounted(async () => {
  // 카카오 소셜 회원가입이 아닐 때는 email을 무조건 초기화
  if (!authStore.id) {
    authStore.email = '';
    authStore.emailChecked = false;
    authStore.password = '';
  } else {
    // 카카오 소셜 회원가입일 때만 기존 로직 유지
    authStore.emailChecked = true;
    authStore.password = 'KAKAO ' + authStore.id;
  }
});

// 해당 페이지를 벗어 날 경우 정보 초기화
onBeforeRouteLeave(() => {
  authStore.resetInfo(); // 초기화 함수 호출
  authStore.resetJoinLoginState();
});
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
          <input type="text" v-model="authStore.name" required />
        </div>
        <div
          class="auth-input-group"
          style="display: flex; align-items: center; gap: 8px"
        >
          <div style="flex: 1">
            <label>Nickname</label>
            <input
              ref="nicknameInput"
              type="text"
              v-model="authStore.nickname"
              required
              :readonly="authStore.nicknameChecked"
              :class="{ 'input-checked': authStore.nicknameChecked }"
            />
            <div
              v-if="authStore.nicknameCheckMessage"
              class="auth-error"
              style="margin-top: 4px"
            >
              {{ authStore.nicknameCheckMessage }}
            </div>
          </div>
          <button
            v-if="!authStore.nicknameChecked"
            type="button"
            class="auth-check-btn"
            @click="checkNickname"
            :disabled="authStore.nicknameChecking"
          >
            중복 확인
          </button>
          <button
            v-else
            type="button"
            class="auth-check-btn"
            @click="resetNickname"
            style="
              background: #fff;
              color: #8ab191;
              border: 1.5px solid #8ab191;
            "
          >
            재입력
          </button>
        </div>
        <div
          class="auth-input-group"
          style="display: flex; align-items: center; gap: 8px"
        >
          <div style="flex: 1">
            <label>Email</label>
            <input
              ref="emailInput"
              type="email"
              v-model="authStore.email"
              required
              :readonly="authStore.emailChecked"
              :class="{ 'input-checked': authStore.emailChecked }"
            />
            <div
              v-if="authStore.emailCheckMessage"
              class="auth-error"
              style="margin-top: 4px"
            >
              {{ authStore.emailCheckMessage }}
            </div>
          </div>
          <button
            v-if="!authStore.emailChecked"
            type="button"
            class="auth-check-btn"
            @click="checkEmail"
            :disabled="authStore.emailChecking"
          >
            중복 확인
          </button>
          <button
            v-else
            type="button"
            class="auth-check-btn"
            @click="resetEmail"
            style="
              background: #fff;
              color: #8ab191;
              border: 1.5px solid #8ab191;
            "
          >
            재입력
          </button>
        </div>
        <div
          class="auth-input-group"
          style="display: flex; align-items: center; gap: 8px"
        >
          <div style="flex: 1">
            <label>Address</label>
            <input type="text" v-model="authStore.address" required readonly />
          </div>
          <button type="button" class="auth-check-btn" @click="inputAddress">
            주소 입력
          </button>
        </div>
        <div v-if="authStore.showAddressModal" class="modal-backdrop">
          <div class="modal-content">
            <button class="modal-close" @click="authStore.showAddressModal = false">
              &times;
            </button>
            <div v-if="!authStore.selectedDo">
              <div class="modal-title">거주지(시/도) 선택</div>
              <div class="modal-btn-group">
                <button
                  v-for="doName in doList"
                  :key="doName"
                  @click="onSelectDo(doName)"
                  class="modal-btn"
                >
                  {{ doName }}
                </button>
              </div>
            </div>
            <div v-else>
              <div class="modal-title">{{ authStore.selectedDo }}의 구/군 선택</div>
              <div class="modal-btn-group">
                <button
                  v-for="sigugun in sigugunMap[authStore.selectedDo]"
                  :key="sigugun"
                  @click="onSelectSigugun(sigugun)"
                  class="modal-btn"
                >
                  {{ sigugun }}
                </button>
              </div>
              <button class="modal-back-btn" @click="authStore.selectedDo = ''">
                이전
              </button>
            </div>
          </div>
        </div>
        <div class="auth-input-group">
          <label>Password</label>
          <input type="password" v-model="authStore.password" required />
        </div>
        <button type="submit" class="auth-submit" :disabled="authStore.loading">
          Sign Up
        </button>
        <div v-if="authStore.errorMessage" class="auth-error">{{ authStore.errorMessage }}</div>
        <div
          v-if="authStore.successMessage"
          class="auth-success"
          style="color: #7a9c7e; text-align: center; margin-top: 10px"
        >
          {{ authStore.successMessage }}
        </div>
      </form>
    </div>
  </div>
</template>
