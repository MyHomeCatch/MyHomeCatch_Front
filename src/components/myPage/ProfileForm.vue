<script setup>
import { ref, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import axios from 'axios';

import { doList, sigugunMap } from '../../assets/addressData';
import AddressModal from '../../components/modals/AddressModal.vue';

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const name = ref('');
const nickname = ref('');
const email = ref('');
const address = ref('');
const currentPassword = ref('');
const currentPasswordError = ref('');
const message = ref('');

const nicknameChecked = ref(false);
const nicknameCheckMessage = ref('');
const nicknameChecking = ref(false);

const showPassword = ref(false);
const showAddressModal = ref(false);

const getAuthConfig = () => {
  if (token.value) {
    return {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    };
  }
  return {};
};

watch(nickname, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nicknameChecked.value = false;
    nicknameCheckMessage.value = '';
  }
});

const checkNickname = async () => {
  if (!nickname.value || nickname.value.trim() === '') {
    nicknameCheckMessage.value = '닉네임을 입력해주세요.';
    nicknameChecked.value = false;
    return;
  }

  if (nickname.value === user.value.nickname) {
    nicknameChecked.value = true;
    nicknameCheckMessage.value = '현재 사용 중인 닉네임입니다.';
    return;
  }

  await authStore.checkNickname(nickname.value);

  nicknameChecked.value = authStore.nicknameChecked;
  nicknameCheckMessage.value = authStore.nicknameCheckMessage;
};

const resetNickname = () => {
  nicknameChecked.value = false;
  nicknameCheckMessage.value = '';
  nickname.value = '';
};

const saveChanges = async () => {
  message.value = '';
  currentPasswordError.value = '';

  if (!currentPassword.value) {
    currentPasswordError.value = '비밀번호를 입력해야 합니다.';
    return;
  }

  if (!nicknameChecked.value) {
    message.value = '닉네임 중복확인을 해주세요.';
    return;
  }

  if (!address.value || address.value.trim() === '') {
    message.value = '주소를 입력해주세요.';
    return;
  }

  try {
    const updateData = {
      nickname: nickname.value,
      email: email.value,
      address: address.value,
      currentPassword: currentPassword.value,
    };

    const res = await axios.put('/api/api/user', updateData, getAuthConfig());

    if (res.status === 200) {
      message.value = '회원 정보가 성공적으로 수정되었습니다.';
      currentPassword.value = '';

      await authStore.fetchUserInfo();
    } else {
      message.value = '회원 정보 수정에 실패했습니다. 다시 시도해주세요.';
    }
  } catch (err) {
    console.error('회원 정보 수정 실패:', err);
    if (err.response && err.response.data) {
      const errorMessage = err.response.data.message || err.response.data;
      if (errorMessage.includes('비밀번호가 일치하지 않습니다.')) {
        currentPasswordError.value = errorMessage;
      } else if (errorMessage.includes('비밀번호를 입력해야 합니다.')) {
        currentPasswordError.value = errorMessage;
      } else {
        message.value = `회원 정보 수정 실패: ${errorMessage}`;
      }
    } else {
      message.value = '회원 정보 수정 중 오류가 발생했습니다.';
    }
  }
};

onMounted(async () => {
  try {
    const res = await axios.get('/api/api/user', getAuthConfig());
    const data = res.data;
    name.value = data.name;
    nickname.value = data.nickname;
    email.value = data.email;
    address.value = data.address;
    nicknameChecked.value = false;
    nicknameCheckMessage.value = '';
  } catch (err) {
    console.error('사용자 정보 조회 실패:', err);
    message.value = '사용자 정보를 불러오는 데 실패했습니다.';
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 403)
    ) {
      message.value =
        '인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
    }
  }
});

const cancel = () => {
  history.back();
};

const openAddressModal = () => {
  showAddressModal.value = true;
};

const handleModalClose = () => {
  showAddressModal.value = false;
};

const handleSelectDo = (doName) => {
  authStore.selectedDo = doName;
};

const handleSelectSigugun = (sigugunName) => {
  authStore.selectedSigugun = sigugunName;
};

const updateAddress = () => {
  if (authStore.selectedDo && authStore.selectedSigugun) {
    address.value = `${authStore.selectedDo} ${authStore.selectedSigugun}`;
    showAddressModal.value = false;
  }
};
</script>

<template>
  <div class="profile-form-container">
    <h4 class="form-title">회원정보 수정</h4>

    <div
      v-if="message"
      :class="{
        'alert alert-success': message.includes('성공'),
        'alert alert-danger':
          message.includes('실패') ||
          message.includes('중복확인') ||
          message.includes('주소를 입력해주세요'),
      }"
      role="alert"
    >
      {{ message }}
    </div>

    <div class="form-section">
      <h5 class="section-title">프로필</h5>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Name</label>
          <input type="text" class="form-control" v-model="name" disabled />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nickname</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="nickname"
              :class="{
                'is-valid': nicknameChecked,
                'is-invalid': nicknameCheckMessage && !nicknameChecked,
              }"
              required
            />
            <button
              type="button"
              class="btn btn-outline-primary check-btn"
              @click="checkNickname"
              :disabled="nicknameChecking"
              v-if="!nicknameChecked"
            >
              중복 확인
            </button>
            <button
              type="button"
              class="btn btn-outline-danger check-btn"
              v-else
              @click="resetNickname"
            >
              재입력
            </button>
          </div>
          <div
            class="form-text"
            :class="{
              'text-success': nicknameChecked,
              'text-danger': nicknameCheckMessage && !nicknameChecked,
            }"
          >
            {{ nicknameCheckMessage }}
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Email</label>
          <input type="email" class="form-control" v-model="email" disabled />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Address</label>
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              v-model="address"
              readonly
              placeholder="주소를 선택해주세요"
              required
            />
            <button
              type="button"
              class="btn btn-outline-primary check-btn"
              @click="openAddressModal"
            >
              주소 입력
            </button>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Password</label>
          <div class="password-input-container">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              v-model="currentPassword"
              placeholder="현재 비밀번호를 입력하세요"
            />
            <i
              :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
              class="password-toggle"
              @click="showPassword = !showPassword"
            ></i>
          </div>
          <div v-if="currentPasswordError" class="text-danger small mt-1">
            {{ currentPasswordError }}
          </div>
        </div>
      </div>
    </div>

    <AddressModal
      :do-list="doList"
      :sigugun-map="sigugunMap"
      :selected-do="authStore.selectedDo"
      :selected-sigugun="authStore.selectedSigugun"
      :show="showAddressModal"
      @close="handleModalClose"
      @selectDo="handleSelectDo"
      @selectSigugun="handleSelectSigugun"
      @updateAddress="updateAddress"
    />

    <div class="form-actions">
      <button class="btn btn-secondary cancel-btn" @click="cancel">취소</button>
      <button class="btn btn-success update-btn" @click="saveChanges">
        수정
      </button>
    </div>
  </div>
</template>

<style scoped>
.profile-form-container {
  max-width: 100%;
}

.form-title {
  font-weight: 700;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #86a788, #6b8a6d);
  border-radius: 2px;
}

.form-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-title {
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #495057;
  font-size: 1.4rem;
}

.form-row {
  margin-bottom: 1.5rem;
}

.form-group {
  width: 100%;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.95rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.form-control:disabled {
  background-color: #e9ecef;
  opacity: 0.6;
}

.input-group {
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
}

.input-group .form-control {
  flex: 1;
}

.check-btn {
  padding: 0.75rem 1rem;
  font-size: 0.9rem;
  white-space: nowrap;
  min-width: 100px;
  background-color: #86a788;
  border-color: #86a788;
  color: white;
}

.check-btn:hover {
  background-color: #6b8a6d;
  border-color: #6b8a6d;
  color: white;
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  z-index: 10;
}

.password-toggle:hover {
  color: #495057;
}

.form-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: white;
  border-color: #86a788;
  color: #86a788;
}

.cancel-btn:hover {
  background-color: #f8f9fa;
  border-color: #6b8a6d;
  color: #6b8a6d;
}

.update-btn {
  padding: 0.75rem 3rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: #86a788;
  border-color: #86a788;
  min-width: 140px;
}

.update-btn:hover {
  background-color: #6b8a6d;
  border-color: #6b8a6d;
}

.alert {
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }

  .input-group {
    flex-direction: column;
    align-items: stretch;
  }

  .check-btn {
    width: 100%;
    margin-top: 0.5rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .update-btn {
    width: 100%;
  }
}
</style>
