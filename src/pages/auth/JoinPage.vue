<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import './auth.css';
import { doList, sigugunMap } from '../../assets/addressData';
import { useAuthStore } from '../../stores/auth';
import AddressModal from '../../components/modals/AddressModal.vue';

const authStore = useAuthStore();

const router = useRouter();
const emailInput = ref(null);
const nicknameInput = ref(null);

const emailVerified = ref(false);
const showSendVerification = ref(false);
const showVerificationInput = ref(false); // 인증번호 입력란 노출 여부
const verificationCode = ref('');
const verificationSent = ref(false);
const verificationError = ref('');

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
  showSendVerification.value = false;
  showVerificationInput.value = false;
  verificationCode.value = '';
  verificationError.value = '';
  emailVerified.value = false;
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
  if (!authStore.id) {
    authStore.email = '';
    authStore.emailChecked = false;
    authStore.password = '';
  } else {
    authStore.emailChecked = true;
    authStore.password = 'KAKAO ' + authStore.id;
  }
});

// 해당 페이지를 벗어 날 경우 정보 초기화
onBeforeRouteLeave(() => {
  authStore.resetInfo();
  authStore.resetJoinLoginState();
});

const handleModalClose = () => {
  authStore.showAddressModal = false;
};
const handleSelectDo = (doName) => {
  authStore.onSelectDo(doName);
};
const handleSelectSigugun = (sigugunName) => {
  authStore.onSelectSigugun(sigugunName);
};

// 이메일 중복확인 후 인증 버튼 노출
const checkEmail = async () => {
  if (!emailInput.value.checkValidity()) {
    emailInput.value.reportValidity();
    return;
  }
  await authStore.checkEmail(authStore.email);
  if (authStore.emailChecked) {
    showSendVerification.value = true;
  }
};

// 인증하기 버튼 클릭 시 인증번호 입력란 노출
const handleShowVerificationInput = () => {
  showVerificationInput.value = true;
};

// 인증번호 확인 (기능 미구현)
const verifyCode = async () => {
  // 실제 인증 기능은 추후 구현
  // 예시: 인증 성공 시 emailVerified.value = true;
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

        <!-- 이메일 인증하기 버튼 -->
        <div v-if="showSendVerification && !emailVerified && !showVerificationInput" style="margin-bottom: 8px;">
          <button type="button" class="auth-check-btn" @click="handleShowVerificationInput">
            이메일 인증하기
          </button>
        </div>

        <!-- 인증번호 입력 및 확인 (기능 미구현) -->
        <div v-if="showVerificationInput && !emailVerified" style="display: flex; gap: 8px; align-items: center; margin-bottom: 8px;">
          <input
            type="text"
            v-model="verificationCode"
            placeholder="인증번호 입력"
            style="flex: 1"
          />
          <button type="button" class="auth-check-btn" @click="verifyCode">
            인증 확인
          </button>
        </div>
        <div v-if="verificationError" class="auth-error">{{ verificationError }}</div>
        <div v-if="emailVerified" class="auth-success" style="color: #7a9c7e;">이메일 인증 완료!</div>
        <div
          class="auth-input-group"
          style="display: flex; align-items: center; gap: 8px"
        >
          <div style="flex: 1">
            <label>Address</label>
            <input type="text" v-model="authStore.address" required readonly />
          </div>
          <button type="button" class="auth-check-btn" @click="openAddressModal">
            주소 입력
          </button>
        </div>
        <AddressModal
          :do-list="doList"
          :sigugun-map="sigugunMap"
          :selected-do="authStore.selectedDo"
          :selected-sigugun="authStore.selectedSigugun"
          :show="authStore.showAddressModal"
          @close="handleModalClose"
          @selectDo="handleSelectDo"
          @selectSigugun="handleSelectSigugun"
        />
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
