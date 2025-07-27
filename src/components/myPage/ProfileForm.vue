<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// 편집용 폼 상태
const name = ref(user.value.name || '');
const nickname = ref(user.value.nickname || '');
const email = ref(user.value.email || '');
const address = ref(user.value.address || '');
const password = ref('');
const confirmPassword = ref('');
const passwordError = ref('');

const saveChanges = () => {
  if (password.value !== confirmPassword.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  // TODO: API 연동
  console.log('변경 사항 저장', {
    name: name.value,
    nickname: nickname.value,
    email: email.value,
    address: address.value,
    password: password.value,
  });

  passwordError.value = '';
  alert('회원 정보가 수정되었습니다.');
};

const cancel = () => {
  history.back();
};
</script>

<template>
  <div>
    <h4 class="fw-bold mb-3">회원정보 수정</h4>

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
      <input type="email" class="form-control" v-model="email" />
    </div>

    <div class="mb-3">
      <label class="form-label">주소</label>
      <input type="text" class="form-control" v-model="address" />
    </div>

    <div class="mb-3">
      <label class="form-label">현재 비밀번호</label>
      <input type="password" class="form-control" v-model="password" />
    </div>

    <div class="mb-3">
      <label class="form-label">비밀번호 확인</label>
      <input type="password" class="form-control" v-model="confirmPassword" />
      <div v-if="passwordError" class="text-danger small mt-1">
        {{ passwordError }}
      </div>
    </div>

    <div class="mt-4">
      <button class="btn btn-secondary me-2" @click="cancel">취소</button>
      <button class="btn btn-primary" @click="saveChanges">수정</button>
    </div>
  </div>
</template>
