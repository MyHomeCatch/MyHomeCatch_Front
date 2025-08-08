<template>
  <ul class="navbar-nav ms-3">
    <li v-for="(menu, index) in menus" :key="index" class="nav-item dropdown">
      <a
        class="nav-link dropdown-toggle"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        @click="toggleSubMenu(index)"
      >
        <i :class="menu.icon" /> {{ menu.title }}
      </a>
      <ul
        class="dropdown-menu"
        :class="{ show: activeMenuIndex === index }"
        aria-labelledby="navbarDropdown"
      >
        <MenuItem
          v-for="child in menu.children"
          :key="child.title"
          :menu="child"
        />
      </ul>
    </li>
  </ul>
</template>

<script setup>
import { ref } from 'vue';
import MenuItem from './MenuItem.vue';

defineProps({
  menus: {
    type: Array,
    required: true,
  },
});

const activeMenuIndex = ref(null);

const toggleSubMenu = (index) => {
  if (activeMenuIndex.value === index) {
    activeMenuIndex.value = null;
  } else {
    activeMenuIndex.value = index;
  }
};
</script>

<style scoped>
.dropdown-menu.show {
  display: block;
}

/* 기본 메뉴 글씨 색상 */
.nav-link {
  color: white; /* 원하는 색상으로 변경 */
  font-weight: 600;
}

/* 호버 시 색상 */
.nav-link:hover {
  color: #86a788; /* 예시로 살짝 연한 녹색 계열 */
}

.dropdown-toggle::after {
  display: none;
}
</style>
