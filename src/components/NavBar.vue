<script setup>
import config from '@/config';
import MenuGroup from './menu/MenuGroup.vue';
import AccountMenuGroup from './menu/AccountMenuGroup.vue';
</script>

<template>
  <nav class="navbar navbar-expand-sm custom-navbar container-fluid px-0 py-1">
    <div class="d-flex justify-content-between align-items-center w-100 px-3">
      <!-- 왼쪽 메뉴 -->
      <div class="d-flex align-items-center">
        <MenuGroup :menus="config.menus" />
      </div>

      <!-- 로고 -->
      <router-link class="navbar-brand mx-auto" to="/">
        <img src="../assets/images/MyHomeCatchLogo.png" alt="로고 이미지" />
      </router-link>

      <!-- 오른쪽 계정 메뉴 -->
      <div class="d-flex align-items-center">
        <AccountMenuGroup />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background-color: white;
  padding: 0;
  width: 100%;
  margin: 0;
  font-family: 'Pretendard', sans-serif;
}

.navbar-brand img {
  width: 210px;
  height: auto;
}

@media (max-width: 768px) {
  .navbar-brand {
    margin: 0 auto;
  }

  #collapsibleNavbar {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
}

html,
body {
  margin: 0;
  padding: 0;
}
</style>
