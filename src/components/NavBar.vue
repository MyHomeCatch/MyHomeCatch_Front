<script setup>
import config from '@/config';
import MenuGroup from './menu/MenuGroup.vue';
import AccountMenuGroup from './menu/AccountMenuGroup.vue';
import { reactive, computed } from 'vue';

const state = reactive({ isNavShow: false });
const navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
);
const toggleNavShow = () => {
  state.isNavShow = !state.isNavShow;
};
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

      <!-- 모바일 토글 -->
      <!-- <button
        class="navbar-toggler position-absolute end-0 me-3"
        type="button"
        @click="toggleNavShow"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button> -->
    </div>

    <!-- 모바일 전용 메뉴 -->
    <!-- <div v-if="state.isNavShow" :class="navClass" id="collapsibleNavbar">
      <MenuGroup :menus="config.menus" />
      <AccountMenuGroup />
    </div> -->
  </nav>
</template>

<style scoped>
.custom-navbar {
  background-color: rgba(134, 167, 136, 0.8);
  padding: 0;
  width: 100%;
  margin: 0;
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
