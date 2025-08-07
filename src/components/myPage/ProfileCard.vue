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
  margin-bottom: 1rem;
}

.profile-img {
  width: 140px;
  height: 140px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 0.8rem;
  border: 2px solid #e5e7eb; /* 연한 테두리로 강조 */
}

.user-name {
  font-weight: 700;
  color: #1f2937; /* 진한 텍스트 (gray-800) */
  font-size: 1.3rem;
  margin-bottom: 0.2rem;
}

.nickname {
  font-size: 1rem;
  color: #4b5563; /* 중간 회색 (gray-600) */
  font-weight: 500;
}
</style>
