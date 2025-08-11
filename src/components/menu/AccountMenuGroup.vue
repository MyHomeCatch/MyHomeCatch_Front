<script setup>
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import MenuItem from './MenuItem.vue';
import config from '@/config';
const { login, join, logout } = config.accoutMenus;
const authStore = useAuthStore();

const { isLoggedIn, user } = storeToRefs(authStore);
</script>

<template>
  <div class="account-menu-group">
    <template v-if="!authStore.isLoggedIn">
      <MenuItem :menu="login" variant="account" />
      <MenuItem :menu="join" variant="account" />
    </template>
    <template v-else>
      <div class="user-profile">
        <router-link to="/mypage" class="user-link">
          <div class="user-avatar">
            <i class="fas fa-user"></i>
          </div>
          <span class="user-name">{{ user.nickname }}님</span>
        </router-link>
      </div>
      <button class="logout-button" @click="authStore.logout()">
        <i :class="logout.icon"></i>
        <span>{{ logout.title }}</span>
      </button>
    </template>
  </div>
</template>

<style scoped>
.account-menu-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
}

.user-link {
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  padding: 8px 12px;
  transition: color 0.3s ease;
  color: #374151;
}

.user-link:hover {
  color: #1f40af;
  text-decoration: none;
}

.user-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  font-size: 12px;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
}

.logout-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: color 0.3s ease;
}

.logout-button:hover {
  color: #1f40af;
}

.logout-button i {
  font-size: 12px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .account-menu-group {
    gap: 12px;
  }

  .user-link {
    padding: 6px 10px;
  }

  .user-name {
    font-size: 13px;
  }

  .logout-button {
    padding: 6px 12px;
    font-size: 13px;
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .user-link {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .user-link:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.25);
    color: white;
  }

  .user-avatar {
    background: rgba(255, 255, 255, 0.2);
    color: white;
  }

  .user-name {
    color: white;
  }

  .logout-button {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    color: white;
  }

  .logout-button:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    color: white;
  }
}
</style>
