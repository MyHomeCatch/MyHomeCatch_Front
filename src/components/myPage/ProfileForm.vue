<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const name = ref('');
const nickname = ref('');
const email = ref('');
const address = ref('');
const currentPassword = ref('');
const currentPasswordError = ref('');
const message = ref('');

const showPassword = ref(false);

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

const saveChanges = async () => {
  message.value = '';
  currentPasswordError.value = '';

  if (!currentPassword.value) {
    currentPasswordError.value = '비밀번호를 입력해야 합니다.';
    return;
  }

  try {
    const updateData = {
      nickname: nickname.value,
      email: email.value,
      address: address.value,
      currentPassword: currentPassword.value,
    };

    const res = await axios.put('/api/user', updateData, getAuthConfig());

    if (res.status === 200) {
      message.value = '회원 정보가 성공적으로 수정되었습니다.';
      currentPassword.value = '';
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
        message.value = `회원 정보 수정 실패: ${errorMessage}`; // 기타 오류 메시지
      }
    } else {
      message.value = '회원 정보 수정 중 오류가 발생했습니다.';
    }
  }
};

onMounted(async () => {
  try {
    const res = await axios.get('/api/user', getAuthConfig());
    const data = res.data;
    name.value = data.name;
    nickname.value = data.nickname;
    email.value = data.email;
    address.value = data.address;
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
</script>

<template>
  <div>
    <h4 class="fw-bold mb-3">회원정보 수정</h4>

    <div
      v-if="message"
      :class="{
        'alert alert-success': message.includes('성공'),
        'alert alert-danger': message.includes('실패'),
      }"
      role="alert"
    >
      {{ message }}
    </div>

    <div class="mb-3">
      <label class="form-label">이름</label>
      <input type="text" class="form-control" v-model="name" disabled />
    </div>

    <div class="mb-3">
      <label class="form-label">닉네임</label>
      <input type="text" class="form-control" v-model="nickname" />
    </div>

    <div class="mb-3">
      <label class="form-label">이메일</label>
      <input type="email" class="form-control" v-model="email" disabled />
    </div>

    <div class="mb-3">
      <label class="form-label">주소</label>
      <input type="text" class="form-control" v-model="address" />
    </div>

    <div class="mb-3 position-relative">
      <label class="form-label">현재 비밀번호</label>
      <input
        :type="showPassword ? 'text' : 'password'"
        class="form-control pe-5"
        v-model="currentPassword"
        placeholder="현재 비밀번호를 입력하세요"
      />
      <i
        :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
        class="position-absolute end-0 me-3 text-secondary"
        style="
          top: 50%;
          transform: translateY(0%);
          cursor: pointer;
          z-index: 10;
        "
        @click="showPassword = !showPassword"
      ></i>
      <div v-if="currentPasswordError" class="text-danger small mt-1">
        {{ currentPasswordError }}
      </div>
    </div>

    <div class="mt-4">
      <button class="btn btn-secondary me-2" @click="cancel">취소</button>
      <button class="btn btn-primary" @click="saveChanges">수정</button>
    </div>
  </div>
</template>
