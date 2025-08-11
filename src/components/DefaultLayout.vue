<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="app-wrapper">
    <Header />

    <main class="main-content">
      <slot></slot>
    </main>

    <Footer />
  </div>
</template>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 10px; /* Header 높이만큼 여백 추가 */
  padding-top: 20px; /* 추가 상단 여백 */
}

.navbar-sticky {
  position: sticky;
  top: 0;
  z-index: 1000;
}

.footer {
  background-color: white;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

/* 반응형 여백 조정 */
@media (max-width: 768px) {
  .main-content {
    margin-top: 5px; /* 모바일 Header 높이 */
    padding-top: 16px;
  }
}
</style>
