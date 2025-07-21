<script setup>
import { computed } from 'vue';
import { useAuthStore } from '../../stores/auth';
import MenuItem from './MenuItem.vue';
import config from '@/config';
const { login, join, logout } = config.accoutMenus;
const authStore = useAuthStore();
</script>

<template>
  <ul class="navbar-nav ms-auto">
    <template v-if="!authStore.isLoggedIn">
      <MenuItem :menu="login" />
      <MenuItem :menu="join" />
    </template>
    <template v-else>
      <li class="nav-item">
        <a class="nav-link" href="#" @click.prevent="authStore.logout()">
          <i :class="logout.icon"></i>
          {{ logout.title }}
        </a>
      </li>
    </template>
  </ul>
</template>
