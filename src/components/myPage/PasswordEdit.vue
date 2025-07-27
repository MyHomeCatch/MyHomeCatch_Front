<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const passwordError = ref('');

const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const showAllPasswords = ref(false);

watch(showAllPasswords, (val) => {
  showOldPassword.value = val;
  showNewPassword.value = val;
  showConfirmPassword.value = val;
});

const updatePassword = () => {
  if (newPassword.value !== confirmPassword.value) {
    passwordError.value = '비밀번호가 일치하지 않습니다.';
    return;
  }

  // TODO: API 요청
  alert('비밀번호가 변경되었습니다.');
};

const cancel = () => {
  history.back();
};
</script>

<template>
  <div>
    <h4 class="fw-bold mb-3">비밀번호 변경</h4>

    <div class="mb-3">
      <label class="form-label">현재 비밀번호</label>
      <input
        :type="showOldPassword ? 'text' : 'password'"
        class="form-control"
        v-model="currentPassword"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">새 비밀번호</label>
      <input
        :type="showNewPassword ? 'text' : 'password'"
        class="form-control"
        v-model="newPassword"
      />
    </div>

    <div class="mb-3">
      <label class="form-label">새 비밀번호 확인</label>
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        class="form-control"
        v-model="confirmPassword"
      />
      <div v-if="passwordError" class="text-danger small mt-1">
        {{ passwordError }}
      </div>
    </div>

    <div class="form-check mb-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="toggleVisibility"
        v-model="showAllPasswords"
      />
      <label class="form-check-label" for="toggleVisibility"
        >비밀번호 표시</label
      >
    </div>

    <div class="mt-4">
      <button class="btn btn-secondary me-2" @click="cancel">취소</button>
      <button class="btn btn-primary" @click="updatePassword">변경</button>
    </div>
  </div>
</template>
