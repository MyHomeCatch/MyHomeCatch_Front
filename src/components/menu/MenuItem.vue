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
  color: white;
  font-weight: bold;
  cursor: pointer;
}

/* 호버 시 색상 변경 */
.dropdown-item:hover {
  color: #86a788;
  background-color: transparent; /* 배경색 없애고 글자색만 변경 */
}

/* 아이콘도 같이 색상 적용되도록 */
.dropdown-item i {
  margin-right: 6px;
  color: inherit;
}
</style>
