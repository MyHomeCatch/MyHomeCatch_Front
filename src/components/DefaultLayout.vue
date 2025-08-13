<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="app-wrapper">
    <Header />
    <div class="navbar-sticky">
      <NavBar />
    </div>

    <div class="container">
      <div class="content">
        <slot></slot>
      </div>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.navbar-sticky {
  /* position: sticky; */
  top: 0;
  z-index: 1000;
}

.container {
  max-width: 100% !important;
  margin: 0 !important; /* 좌우·상하 마진 제거 */
  padding: 0 !important; /* 필요 시 좌우 패딩도 제거 */
  font-family: 'Pretendard', sans-serif;
}

.footer {
  background-color: white;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
