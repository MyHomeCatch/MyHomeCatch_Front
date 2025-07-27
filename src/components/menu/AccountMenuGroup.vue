<script setup>
import { useAuthStore } from '../../stores/auth';
import { storeToRefs } from 'pinia';
import MenuItem from './MenuItem.vue';
import config from '@/config';
const { login, join, logout } = config.accoutMenus;
const authStore = useAuthStore();

const { isLoggedIn, user } = storeToRefs(authStore);

console.log('로그인 정보 확인', user.nickname);
console.log('로그인 정보 확인', authStore.user.name);
</script>

<template>
  <ul class="navbar-nav ms-auto">
    <template v-if="!authStore.isLoggedIn">
      <MenuItem :menu="login" />
      <MenuItem :menu="join" />
    </template>
    <template v-else>
      <li class="nav-item d-flex align-items-center text-white fw-bold me-2">
        <router-link to="/mypage" class="nav-link text-white fw-bold">
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
