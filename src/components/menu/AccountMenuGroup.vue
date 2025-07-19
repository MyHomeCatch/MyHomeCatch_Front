<script setup>
import { computed } from 'vue';
import MenuItem from './MenuItem.vue';
import config from '@/config';
const { login, join } = config.accoutMenus;
</script>

<template>
  <ul class="navbar-nav ms-auto">
    <MenuItem :menu="login" />
    <MenuItem :menu="join" />
  </ul>
</template>
