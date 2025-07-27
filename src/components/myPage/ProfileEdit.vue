<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const route = useRoute();
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

// 현재 라우트에 따른 활성 메뉴 계산
const isProfileActive = computed(() => route.path === '/profile/edit');
const isPasswordActive = computed(
  () => route.path === '/profile/edit/passwordEdit'
);
const isDeleteActive = computed(() => route.path === '/profile/edit/byeBye');
</script>

<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-3 border-end pe-4">
        <router-link
          to="/profile/edit"
          class="text-decoration-none"
          :class="isProfileActive ? 'text-danger' : 'text-dark'"
        >
          <h5
            class="fw-bold mt-3"
            :class="isProfileActive ? 'text-danger' : ''"
          >
            프로필 수정
          </h5>
        </router-link>
        <hr />

        <router-link
          to="/profile/edit/passwordEdit"
          class="text-decoration-none"
          :class="isPasswordActive ? 'text-danger' : 'text-dark'"
        >
          <h5
            class="fw-bold mt-3"
            :class="isPasswordActive ? 'text-danger' : ''"
          >
            비밀번호 변경
          </h5>
        </router-link>
        <hr />

        <router-link
          to="/profile/edit/byeBye"
          class="text-decoration-none"
          :class="isDeleteActive ? 'text-danger' : 'text-dark'"
        >
          <h5 class="fw-bold mt-3" :class="isDeleteActive ? 'text-danger' : ''">
            회원 탈퇴
          </h5>
        </router-link>
        <hr />
      </div>
      <div class="col-md-9">
        <router-view />
      </div>
    </div>
  </div>
</template>
