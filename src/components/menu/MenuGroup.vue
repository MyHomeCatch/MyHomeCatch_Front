<template>
  <ul class="navbar-nav ms-3">
    <li v-for="(menu, index) in menus" :key="index" class="nav-item">
      <router-link class="nav-link" :to="menu.url">
        <i :class="menu.icon" /> {{ menu.title }}
      </router-link>
    </li>
  </ul>
</template>

<script setup>
defineProps({
  menus: {
    type: Array,
    required: true,
  },
});
</script>

<style scoped>
/* 기본 메뉴 글씨 색상 */
.nav-link {
  color: black;
  font-weight: 600;
}

/* 호버 시 색상 */
.nav-link:hover {
  color: #4caf50;
}
</style>
