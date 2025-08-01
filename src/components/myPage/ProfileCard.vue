<template>
  <div class="profile-wrapper">
    <img :src="profileImage" alt="Profile" class="profile-img" />
    <h5 class="user-name">{{ userInfo.nickname }} 님</h5>
    <p class="nickname">{{ userInfo.name }}</p>
  </div>
</template>

<script setup>
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo, profileImage } = storeToRefs(store);
</script>

<style scoped>
.profile-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.5rem;
}

.user-name {
  font-weight: bold;
  color: #2563eb;
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}

.nickname {
  font-size: 0.9rem;
  color: #666;
}
</style>
