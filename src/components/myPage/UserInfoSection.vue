<template>
  <div class="user-info-section">
    <div class="section-header">
      <div class="header-icon">
        <span>👤</span>
      </div>
      <div class="header-content">
        <h2 class="section-title">내 정보</h2>
        <p class="section-subtitle">사용자 기본 정보를 확인하고 관리하세요</p>
      </div>
      <router-link to="/profile/edit" class="edit-link">
        <span>✏️</span>
        <span>편집</span>
      </router-link>
    </div>

    <div class="info-grid">
      <div
        class="info-item"
        v-for="(item, index) in flattenedUserRows"
        :key="index"
      >
        <div class="info-label">
          <span>{{ getLabelEmoji(item.label) }}</span>
          <span>{{ item.label }}</span>
        </div>
        <div class="info-value">{{ item.value || '정보 없음' }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const { userInfo } = storeToRefs(useMyPageStore());

const flattenedUserRows = computed(() => [
  { label: '닉네임', value: userInfo.value.nickname },
  { label: '이메일', value: userInfo.value.email },
  { label: '이름', value: userInfo.value.name },
  { label: '거주지', value: userInfo.value.residence },
]);

const getLabelEmoji = (label) => {
  const emojiMap = {
    닉네임: '🏷️',
    이메일: '📧',
    이름: '🆔',
    거주지: '📍',
  };
  return emojiMap[label] || 'ℹ️';
};
</script>

<style scoped>
.user-info-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.header-icon {
  width: 48px;
  height: 48px;
  background: #f3f4f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.section-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.edit-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}

.edit-link span:first-child {
  font-size: 14px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 16px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 600;
}

.info-label span:first-child {
  font-size: 16px;
}

.info-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
  word-break: break-word;
  line-height: 1.4;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .user-info-section {
    padding: 20px;
    margin-bottom: 16px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    margin-bottom: 20px;
  }

  .header-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .section-title {
    font-size: 1.2rem;
  }

  .edit-link {
    align-self: stretch;
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .info-item {
    padding: 14px;
  }
}

@media (max-width: 480px) {
  .user-info-section {
    padding: 16px;
  }

  .section-header {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .info-item {
    padding: 12px;
  }

  .info-value {
    font-size: 0.9rem;
  }
}
</style>
