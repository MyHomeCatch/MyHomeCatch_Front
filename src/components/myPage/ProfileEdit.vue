<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const route = useRoute();
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

// 현재 라우트에 따른 활성 메뉴 계산
const isProfileActive = computed(() => route.path === '/profile/edit');
const isPasswordActive = computed(
  () => route.path === '/profile/edit/passwordEdit'
);
const isDeleteActive = computed(() => route.path === '/profile/edit/byeBye');
</script>

<template>
  <div class="container-fluid mt-4">
    <div class="row">
      <!-- 사이드바 -->
      <div class="col-md-3">
        <div class="sidebar-container">
          <!-- 프로필 이미지 -->
          <div class="profile-image-container text-center mb-4">
            <div class="profile-image">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E"
                alt="프로필"
                class="profile-avatar"
              />
            </div>
          </div>

          <!-- 네비게이션 메뉴 -->
          <div class="sidebar-menu">
            <router-link
              to="/profile/edit"
              class="sidebar-menu-item"
              :class="{ active: isProfileActive }"
            >
              <span class="menu-text">프로필</span>
            </router-link>

            <router-link
              to="/profile/edit/passwordEdit"
              class="sidebar-menu-item"
              :class="{ active: isPasswordActive }"
            >
              <span class="menu-text">비밀번호 변경</span>
            </router-link>

            <router-link
              to="/profile/edit/byeBye"
              class="sidebar-menu-item"
              :class="{ active: isDeleteActive }"
            >
              <span class="menu-text">회원탈퇴</span>
            </router-link>
          </div>
        </div>
      </div>

      <!-- 메인 컨텐츠 -->
      <div class="col-md-9">
        <div class="content-container">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sidebar-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem 1.5rem;
  height: fit-content;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.profile-image-container {
  margin-bottom: 2rem;
}

.profile-image {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  overflow: hidden;
  margin-top: -1rem;
}

.profile-avatar {
  width: 80px;
  height: 80px;
  opacity: 0.6;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-menu-item {
  display: block;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #6c757d;
  border-radius: 8px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.sidebar-menu-item:hover {
  background: #e9ecef;
  color: #495057;
  text-decoration: none;
}

.sidebar-menu-item.active {
  background: #86a788;
  color: white;
}

.menu-text {
  font-size: 0.95rem;
}

.content-container {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  min-height: 500px;
}

@media (max-width: 768px) {
  .sidebar-container {
    margin-bottom: 1rem;
  }

  .content-container {
    padding: 1.5rem;
  }
}
</style>
