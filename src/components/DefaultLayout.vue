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
  position: sticky;
  top: 0;
  z-index: 1000;
}

.footer {
  background-color: white;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}
</style>
