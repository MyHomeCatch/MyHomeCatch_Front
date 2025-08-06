<script setup>
import Header from './Header.vue';
import NavBar from './NavBar.vue';
import Footer from './Footer.vue';
</script>
<template>
  <div class="container">
    <Header />
    <NavBar />
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
  background-image: url('@/assets/images/background1.png');
}

.footer {
  background-color: white;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>