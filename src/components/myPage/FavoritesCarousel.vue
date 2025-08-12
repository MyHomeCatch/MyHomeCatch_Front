<template>
  <div
    class="bookmark-section"
    style="padding: 1rem 2rem; max-width: 800px; margin: 0 auto"
  >
    <HorizonzontalCardScroller
      :title="'북마크'"
      :cards="danziList"
      :loading="loading"
      :key-field="'danziId'"
      :favorite-list="bookmarks"
      :empty-config="emptyConfig"
      @toggle-favorite="handleToggleFavorite"
      @empty-action="loadBookmarks"
    />
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
const danziList = ref([]); // computed가 아닌 ref로 변경
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
.bookmark-section {
  max-width: 100%;
  padding: 2rem 1.5rem;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  border-radius: 16px;
  margin-top: 1.5rem;
}
</style>
