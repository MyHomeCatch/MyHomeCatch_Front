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

// 닉네임 중복확인 관련 상태
const nicknameChecked = ref(false);
const nicknameCheckMessage = ref('');
const nicknameChecking = ref(false);

const showPassword = ref(false);
const showAddressModal = ref(false); // 주소 모달 표시 여부

// 토큰 헤더 반환 함수
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

// 닉네임 변경 시 중복확인 초기화
watch(nickname, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    nicknameChecked.value = false;
    nicknameCheckMessage.value = '';
  }
});

// 닉네임 중복확인 API 호출 (여기선 임시 로직)
const checkNickname = async () => {
  if (!nickname.value || nickname.value.trim() === '') {
    nicknameCheckMessage.value = '닉네임을 입력해주세요.';
    nicknameChecked.value = false;
    return;
  }
  nicknameChecking.value = true;
  nicknameCheckMessage.value = '';

  try {
    // 실제 API 호출 대신 임시 예시
    const fakeCheck = (name) => {
      const takenNames = ['admin', 'user', 'test'];
      return !takenNames.includes(name.toLowerCase());
    };

    const available = fakeCheck(nickname.value);

    if (available) {
      nicknameChecked.value = true;
      nicknameCheckMessage.value = '사용 가능한 닉네임입니다.';
    } else {
      nicknameChecked.value = false;
      nicknameCheckMessage.value = '이미 사용 중인 닉네임입니다.';
    }
  } catch (error) {
    nicknameChecked.value = false;
    nicknameCheckMessage.value = '닉네임 확인 중 오류가 발생했습니다.';
  } finally {
    nicknameChecking.value = false;
  }
};

// 닉네임 재입력 시 값 초기화 함수
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

  // 닉네임 중복확인 필수
  if (!nicknameChecked.value) {
    message.value = '닉네임 중복확인을 해주세요.';
    return;
  }
  // 주소 입력 필수
  if (!address.value || address.value.trim() === '') {
    message.value = '주소를 입력해주세요.';
    return;
  }

  try {
    const updateData = {
      nickname: nickname.value,
      email: email.value, // 이메일은 disabled지만, 백엔드 식별용으로 보냄
      address: address.value,
      currentPassword: currentPassword.value,
    };

    const res = await axios.put('/api/user', updateData, getAuthConfig());

    if (res.status === 200) {
      message.value = '회원 정보가 성공적으로 수정되었습니다.';
      currentPassword.value = ''; // 현재 비밀번호 필드 초기화
      // 필요하다면 Pinia 스토어의 사용자 정보도 업데이트
      // authStore.setUser({ ...authStore.user, nickname: nickname.value, address: address.value });
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
    const res = await axios.get('/api/user', getAuthConfig());
    const data = res.data;
    name.value = data.name;
    nickname.value = data.nickname;
    email.value = data.email;
    address.value = data.address;
    // 초기 로드 시 닉네임 중복확인 상태 초기화
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

// AddressModal에서 '도' 선택 시 호출
const handleSelectDo = (doName) => {
  authStore.selectedDo = doName; // Pinia 스토어 업데이트
};

// AddressModal에서 '시/군' 선택 시 호출
const handleSelectSigugun = (sigugunName) => {
  authStore.selectedSigugun = sigugunName; // Pinia 스토어 업데이트
};

// AddressModal에서 최종 주소 선택 완료 후 호출될 함수
// AddressModal에서 이 이벤트를 emit 해야 합니다.
const updateAddress = () => {
  if (authStore.selectedDo && authStore.selectedSigugun) {
    address.value = `${authStore.selectedDo} ${authStore.selectedSigugun}`;
    showAddressModal.value = false; // 주소 선택 완료 후 모달 닫기
  }
};
</script>

<template>
  <div>
    <h4 class="fw-bold mb-3">회원정보 수정</h4>

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

    <div class="mb-3">
      <label class="form-label">이름</label>
      <input type="text" class="form-control" v-model="name" disabled />
    </div>

    <div class="mb-3">
      <label class="form-label">닉네임</label>
      <div style="display: flex; gap: 8px; align-items: center">
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
          class="btn btn-outline-primary"
          @click="checkNickname"
          :disabled="nicknameChecking"
          v-if="!nicknameChecked"
          style="width: 120px; height: 38px"
        >
          중복 확인
        </button>
        <button
          type="button"
          class="btn btn-outline-danger"
          v-else
          @click="resetNickname"
          style="width: 120px; height: 38px"
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

    <div class="mb-3">
      <label class="form-label">이메일</label>
      <input type="email" class="form-control" v-model="email" disabled />
    </div>

    <!-- 주소 입력 + 모달 열기 버튼 -->
    <div class="mb-3 d-flex align-items-center gap-2">
      <div style="flex: 1">
        <label class="form-label">주소</label>
        <input
          type="text"
          class="form-control"
          v-model="address"
          readonly
          placeholder="주소를 선택해주세요"
          required
        />
      </div>
      <button
        type="button"
        class="btn btn-outline-primary mt-4"
        @click="openAddressModal"
        style="width: 120px; height: 38px"
      >
        주소 입력
      </button>
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
          transform: translateY(-50%); /* 수직 중앙 정렬 */
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
