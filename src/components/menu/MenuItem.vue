<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  menu: {
    type: Object,
    required: true,
  },
  variant: {
    type: String,
    default: 'dropdown', // 'dropdown' or 'account'
  },
});
</script>

<template>
  <li class="nav-item me-2">
    <router-link
      :class="
        variant === 'account' ? 'account-menu-item' : 'menu-dropdown-item'
      "
      :to="menu.url"
    >
      <i :class="menu.icon" /> {{ menu.title }}
    </router-link>
  </li>
</template>

<style scoped>
/* 일반 드롭다운 메뉴용 스타일 */
.menu-dropdown-item {
  color: #212529;
  background-color: white;
  padding: 0.5rem 1rem;
  display: block;
  text-decoration: none;
  transition: background-color 0.2s, color 0.2s;
}

.menu-dropdown-item:hover {
  color: #86a788;
  background-color: #f5f5f5;
}

.menu-dropdown-item i {
  margin-right: 6px;
  color: inherit;
}

/* 로그인/회원가입용 스타일 */
.account-menu-item {
  color: #374151;
  background-color: transparent;
  padding: 8px 16px;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 600;
}

.account-menu-item:hover {
  color: #1f40af;
}

.account-menu-item i {
  margin-right: 6px;
  color: inherit;
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .account-menu-item {
    color: white;
    background-color: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .account-menu-item:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.25);
  }
}
</style>
