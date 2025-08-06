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
  <nav class="navbar navbar-expand-sm custom-navbar">
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <!-- 왼쪽: 메뉴 그룹 -->
      <div class="d-flex align-items-center">
        <MenuGroup :menus="config.menus" />
      </div>

      <!-- 가운데: 로고 -->
      <!-- 로고 이미지는 추후 수정 예정 -->
      <router-link class="navbar-brand mx-auto" to="/">
        <img src="../assets/images/MyHomeCatchLogo.png" alt="로고 이미지" />
      </router-link>

      <!-- 오른쪽: 계정 메뉴 -->
      <div class="d-flex align-items-center">
        <AccountMenuGroup />
      </div>

      <!-- 모바일용 토글 버튼 -->
      <button
        class="navbar-toggler position-absolute end-0 me-3"
        type="button"
        @click="toggleNavShow"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
    </div>

    <!-- 모바일 메뉴 영역 -->
    <div v-if="state.isNavShow" :class="navClass" id="collapsibleNavbar">
      <MenuGroup :menus="config.menus" />
      <AccountMenuGroup />
    </div>
  </nav>
</template>

<style scoped>
.custom-navbar {
  background-color: rgba(134, 167, 136, 0.8); /* 반투명 조절도 가능 */
  backdrop-filter: blur(10px);
  padding: 0.5rem 1.5rem;
  position: relative;
  z-index: 1000;
}

.navbar-brand img {
  border-radius: 10%;
  width: 70px;
  height: 70px;
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
</style>
