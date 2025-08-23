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
  <ul class="navbar-nav ms-auto">
    <template v-if="!authStore.isLoggedIn">
      <MenuItem :menu="login" variant="account" />
      <MenuItem :menu="join" variant="account" />
    </template>
    <template v-else>
      <li class="nav-item d-flex align-items-center text-white me-2">
        <router-link to="/mypage" class="nav-link">
          {{ user.nickname }}님
        </router-link>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#" @click.prevent="authStore.logout()">
          <i :class="logout.icon"></i>
          {{ logout.title }}
        </a>
      </li>
    </template>
  </ul>
</template>

<style scoped>
/* 기본 nav-link 텍스트 색상 */
.nav-link {
  color: black;
  font-weight: bold;
}

/* 호버 시 색상 */
.nav-link:hover {
  color: #4caf50;
}

/* router-link도 동일한 스타일 적용 */
.router-link-active,
.router-link-exact-active {
  color: black;
}

.router-link-active:hover,
.router-link-exact-active:hover {
  color: #4caf50;
}
</style>
