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
