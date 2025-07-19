<script setup>
import { reactive, computed } from 'vue';
import config from '@/config';
import MenuGroup from './menu/MenuGroup.vue';
import AccountMenuGroup from './menu/AccountMenuGroup.vue';

let state = reactive({ isNavShow: false });
let navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
);
const toggleNavShow = () => (state.isNavShow = !state.isNavShow);
</script>
<template>
  <nav class="navbar navbar-expand-sm bg-secondary navbar-light">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">
        <img src="../assets/images/MyHomeCatchLogo.png" alt="로고 이미지" />
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#collapsibleNavbar"
        @click="toggleNavShow"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div :class="navClass" id="collapsibleNavbar">
        <!-- 추후 작업 예정 -->
        <MenuGroup :menus="config.menus" />
        <AccountMenuGroup />
      </div>
    </div>
  </nav>
</template>

<style scope>
img {
  border-radius: 10%;
  width: 50px;
  height: 50px;
}
</style>
