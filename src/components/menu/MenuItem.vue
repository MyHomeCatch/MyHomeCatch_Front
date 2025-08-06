<script setup>
import { defineProps } from 'vue';

defineProps({
  menu: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <li class="nav-item me-2">
    <router-link class="dropdown-item" :to="menu.url">
      <i :class="menu.icon" /> {{ menu.title }}
    </router-link>
  </li>
</template>

<style scoped>
.dropdown-item {
  cursor: pointer;
}
</style>
