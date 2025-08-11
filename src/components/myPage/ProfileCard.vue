<template>
  <div class="profile-card">
    <div class="profile-header">
      <div class="profile-avatar">
        <img :src="profileImage" alt="Profile" class="profile-img" />
        <div class="profile-status">
          <span>🟢</span>
        </div>
      </div>
      <div class="profile-info">
        <h3 class="user-name">{{ userInfo.nickname }} 님</h3>
        <p class="user-email">{{ userInfo.name }}</p>
      </div>
    </div>
    <div class="profile-actions">
      <button class="btn-edit-profile">
        <span>✏️</span>
        <span>프로필 편집</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo, profileImage } = storeToRefs(store);
</script>

<style scoped>
.profile-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 320px;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
}

.profile-avatar {
  position: relative;
  margin-bottom: 12px;
}

.profile-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #e5e7eb;
}

.profile-status {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 16px;
}

.profile-info {
  text-align: center;
}

.user-name {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.2rem;
  margin: 0 0 4px 0;
}

.user-email {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.profile-actions {
  display: flex;
  justify-content: center;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-edit-profile span:first-child {
  font-size: 14px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .profile-card {
    padding: 16px;
    max-width: 280px;
  }

  .profile-img {
    width: 80px;
    height: 80px;
  }

  .user-name {
    font-size: 1.1rem;
  }

  .btn-edit-profile {
    padding: 8px 12px;
    font-size: 0.85rem;
  }
}
</style>
