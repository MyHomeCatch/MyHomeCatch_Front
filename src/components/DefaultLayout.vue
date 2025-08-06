<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
</script>

<template>
  <div class="container">
    <Header />
    <div class="navbar-wrapper">
      <NavBar />
    </div>
    <div class="content">
      <slot></slot>
    </div>
    <div class="footer">
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.container {
}

.navbar-wrapper {
  margin-left: -12px;
  margin-right: -12px;
}

/* 필요 시 반응형으로 조절 */
@media (min-width: 768px) {
  .navbar-wrapper {
    margin-left: -15px;
    margin-right: -15px;
  }
}

.footer {
  background-color: white;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
