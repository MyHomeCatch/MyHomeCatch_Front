<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import './auth.css';
import { checkEmailRequest } from '../../api/auth';
import { checkNicknameRequest } from '../../api/auth';
import { signupRequest } from '../../api/auth';
import { doList, sigugunMap } from '../../assets/addressData';

const router = useRouter();
const name = ref('');

const address = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

const email = ref('');
const emailInput = ref(null);
const emailCheckMessage = ref('');
const emailChecking = ref(false);
const emailChecked = ref(false); // 중복확인 성공 여부

const nickname = ref('');
const nicknameInput = ref(null);
const nicknameCheckMessage = ref('');
const nicknameChecking = ref(false);
const nicknameChecked = ref(false);

const showAddressModal = ref(false);
const selectedDo = ref('');
const selectedSigugun = ref('');

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

const checkNickname = async() => {
  if (!nicknameInput.value.checkValidity()) {
    nicknameInput.value.reportValidity();
    return;
  }
  nicknameCheckMessage.value = '';
  nicknameChecking.value = true;
  try {
    const response = await checkNicknameRequest(nickname.value);
    if(response.data.available) {
      nicknameCheckMessage.value = '사용 가능한 닉네임입니다.';
      nicknameChecked.value = true;
    } else {
      nicknameCheckMessage.value = '이미 사용 중인 닉네임입니다.';
      nicknameChecked.value = false;
    }
  } catch (err) {
    nicknameCheckMessage.value = '오류가 발생했습니다.';
    nicknameChecked.value = false;
  } finally {
    nicknameChecking.value = false;
  }
};

const openAddressModal = () => {
  showAddressModal.value = true;
  selectedDo.value = '';
  selectedSigugun.value = '';
};

const onSelectDo = (doName) => {
  selectedDo.value = doName;
  selectedSigugun.value = '';
};

const onSelectSigugun = (sigugunName) => {
  selectedSigugun.value = sigugunName;
  address.value = `${selectedDo.value} ${sigugunName}`;
  showAddressModal.value = false;
};

const inputAddress = () => {
  openAddressModal();
};

const handleSignUp = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  loading.value = true;

  if (!emailChecked.value) {
    errorMessage.value = '이메일 중복확인을 해주세요.';
    loading.value = false;
    return;
  }
  if (!nicknameChecked.value) {
    errorMessage.value = '닉네임 중복확인을 해주세요.';
    loading.value = false;
    return;
  }

  try {
    const response = await signupRequest({
      name: name.value,
      nickname: nickname.value,
      email: email.value,
      address: address.value,
      password: password.value,
    });
    successMessage.value = response.data.message;
    setTimeout(() => router.push('/login'), 1000);
  } catch (err) {
    errorMessage.value = err.response?.data?.message || '회원가입 실패';
  } finally {
    loading.value = false;
  }
};

const resetEmail = () => {
  emailChecked.value = false;
  email.value = '';
  emailCheckMessage.value = '';
};

const resetNickname = () => {
  nicknameChecked.value = false;
  nickname.value = '';
  nicknameCheckMessage.value = '';
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
            <input
            ref="nicknameInput"
            type="text"
            v-model="nickname"
            required
            :readonly="nicknameChecked"
            :class="{'input-checked': nicknameChecked}" 
            />
            <!-- 메시지 표시 -->
            <div v-if="nicknameCheckMessage" class="auth-error" style="margin-top: 4px;">{{ nicknameCheckMessage }}</div>
          </div>
          <button
            v-if="!nicknameChecked"
            type="button"
            class="auth-check-btn"
            @click="checkNickname"
            :disabled="nicknameChecking"
          >
            중복 확인
          </button>
          <button
            v-else
            type="button"
            class="auth-check-btn"
            @click="resetNickname"
            style="background: #fff; color: #8ab191; border: 1.5px solid #8ab191;"
          >
            재입력
          </button>
        </div>
        <div class="auth-input-group" style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1;">
            <label>Email</label>
            <input
              ref="emailInput"
              type="email"
              v-model="email"
              required
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
            재입력
          </button>
        </div>
        <div class="auth-input-group" style="display: flex; align-items: center; gap: 8px;">
          <div style="flex: 1;">
            <label>Address</label>
            <input type="text" v-model="address" required readonly />
          </div>
          <button type="button" class="auth-check-btn" @click="inputAddress">주소 입력</button>
        </div>
        <!-- Address Modal -->
        <div v-if="showAddressModal" class="modal-backdrop">
          <div class="modal-content">
            <button class="modal-close" @click="showAddressModal = false">&times;</button>
            <div v-if="!selectedDo">
              <div class="modal-title">거주지(시/도) 선택</div>
              <div class="modal-btn-group">
                <button
                  v-for="doName in doList"
                  :key="doName"
                  @click="onSelectDo(doName)"
                  class="modal-btn"
                >{{ doName }}</button>
              </div>
            </div>
            <div v-else>
              <div class="modal-title">{{ selectedDo }}의 구/군 선택</div>
              <div class="modal-btn-group">
                <button
                  v-for="sigugun in sigugunMap[selectedDo]"
                  :key="sigugun"
                  @click="onSelectSigugun(sigugun)"
                  class="modal-btn"
                >{{ sigugun }}</button>
              </div>
              <button class="modal-back-btn" @click="selectedDo = ''">이전</button>
            </div>
          </div>
        </div>
        <div class="auth-input-group">
          <label>Password</label>
          <input type="password" v-model="password" required />
        </div>        
        <button type="submit" class="auth-submit" :disabled="loading">Sign Up</button>
        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
        <div v-if="successMessage" class="auth-success" style="color: #7a9c7e; text-align: center; margin-top: 10px;">{{ successMessage }}</div>
      </form>
    </div>
  </div>
</template>
