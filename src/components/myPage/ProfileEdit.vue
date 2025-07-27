<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

// defineProps({
//   userInfo: {
//     type: Object,
//     required: true,
//     default: () => ({
//       name: '',
//       residence: '',
//       preferredRegions: [],
//       noHousePeriod: '',
//       hasSubscriptionAccount: '',
//       isMarried: '',
//     }),
//   },
// });

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
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-9">
        <router-view />
      </div>
    </div>
  </div>
</template>
