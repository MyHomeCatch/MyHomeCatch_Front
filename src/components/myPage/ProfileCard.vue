<script setup>
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo, householdInfo, financialInfo, profileImage } =
  storeToRefs(store);
</script>

<template>
  <div class="text-center">
    <img :src="profileImage" alt="Profile" class="rounded-circle mb-2" />
    <h5 class="fw-bold text-primary">{{ userInfo.name }} 님</h5>
  </div>
</template>

<!-- <template>
  <div class="text-center">
    <img
      src="../../assets/images/background1.png"
      alt="Profile"
      class="rounded-circle mb-2"
    />
    <h5 class="fw-bold text-primary">유저1 님</h5>
  </div>
</template> -->

<style scoped>
img.rounded-circle {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
</style>
