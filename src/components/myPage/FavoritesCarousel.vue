<template>
  <div class="favorites-carousel-section">
    <div class="section-header">
      <div class="header-icon">
        <span>❤️</span>
      </div>
      <div class="header-content">
        <h2 class="section-title">북마크한 공고</h2>
        <p class="section-subtitle">관심있는 주택 공고를 한눈에 확인하세요</p>
      </div>
      <div class="header-actions">
        <button class="btn-refresh" @click="loadBookmarks" :disabled="loading">
          <span class="refresh-icon" :class="{ spinning: loading }">🔄</span>
          <span>새로고침</span>
        </button>
      </div>
    </div>

    <div class="carousel-content">
      <HorizonzontalCardScroller
        :title="'즐겨찾기'"
        :cards="danziList"
        :loading="loading"
        :key-field="'danziId'"
        :favorite-list="bookmarks"
        :empty-config="emptyConfig"
        @toggle-favorite="handleToggleFavorite"
        @empty-action="loadBookmarks"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { getBookmarks } from '../../api/bookmardApi';
import { useAuthStore } from '../../stores/auth';
import HorizonzontalCardScroller from '../house/HorizontalCardScroller.vue';
import axios from 'axios';

const auth = useAuthStore();

// State
const bookmarks = ref([]);
const danziList = ref([]);
const loading = ref(false);

// Empty config
const emptyConfig = {
  icon: '🏠',
  title: '북마크한 공고가 없습니다',
  description: '관심있는 주택을 북마크해보세요.',
  showButton: false,
  buttonText: '다시 찾아보기',
};

// Methods
const handleToggleFavorite = (data) => {};

const loadBookmarkCards = async (bookmarkList) => {
  if (!bookmarkList || bookmarkList.length === 0) {
    danziList.value = [];
    return;
  }

  try {
    // 모든 API 호출을 병렬로 실행
    const promises = bookmarkList.map((bookmark) =>
      axios
        .get(`/api/api/house/card/${bookmark.danziId}`)
        .then((response) => response.data)
        .catch((error) => {
          console.error(
            `카드 로드 실패 (danziId: ${bookmark.danziId}):`,
            error
          );
          return null; // 실패한 경우 null 반환
        })
    );

    const results = await Promise.all(promises);

    // null이 아닌 결과만 필터링
    danziList.value = results.filter((data) => data !== null);
  } catch (error) {
    console.error('북마크 카드 로드 중 오류:', error);
    danziList.value = [];
  }
};

const loadBookmarks = async () => {
  loading.value = true;

  try {
    const res = await getBookmarks(auth.token);
    bookmarks.value = [...res.bookmarks];

    // 북마크 목록이 로드되면 각 카드 정보를 가져옴
    await loadBookmarkCards(bookmarks.value);
  } catch (error) {
    console.error('북마크 로드 실패:', error);
    bookmarks.value = [];
    danziList.value = [];
  } finally {
    loading.value = false;
    console.log('  ⚠️  : ', danziList.value);
  }
};

// 컴포넌트 마운트 시 초기화
onMounted(() => {
  loadBookmarks();
});
</script>

<style scoped>
.favorites-carousel-section {
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

.header-actions {
  display: flex;
  align-items: center;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  color: #374151;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-icon {
  font-size: 14px;
}

.refresh-icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.carousel-content {
  margin-top: 16px;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .favorites-carousel-section {
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

  .header-actions {
    align-self: stretch;
  }

  .btn-refresh {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .favorites-carousel-section {
    padding: 16px;
  }

  .section-header {
    padding-bottom: 12px;
    margin-bottom: 16px;
  }

  .btn-refresh {
    padding: 6px 10px;
    font-size: 0.8rem;
  }
}
</style>
