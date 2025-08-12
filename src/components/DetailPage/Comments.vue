<template>
  <div class="comments-container">
    <h2 class="title">단지별 소통 게시판</h2>

    <!-- 댓글 작성 폼 -->
    <div class="comment-form">
      <textarea
        v-model="newCommentContent"
        placeholder="따뜻한 응원과 격려의 댓글은 큰 힘이 됩니다. 분양권리에 대한 감상평, 입지에 대한 평가 등 자유롭게 의견을 나눠보세요."
        class="comment-textarea"
        rows="3"
      ></textarea>
      <button @click="submitComment" class="submit-button" :disabled="isSubmitting">
        {{ isSubmitting ? '등록 중...' : '댓글 등록' }}
      </button>
    </div>

    <!-- 댓글 목록 -->
    <div v-if="loading" class="loading-spinner">로딩 중...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="comments.length === 0" class="no-comments">
      아직 등록된 댓글이 없습니다. 첫 댓글을 남겨보세요!
    </div>
    <div v-else class="comments-list">
      <div v-for="comment in comments" :key="comment.commentId" class="comment-item">
        <div class="comment-header">
          <span class="comment-author">{{ comment.nickname || '사용자' }}</span>
          <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
        </div>
        <p class="comment-content">{{ comment.content }}</p>
        <button
          v-if="authStore.user && authStore.user.id === comment.userId"
          @click="removeComment(comment.commentId)"
          class="delete-button"
        >
          삭제
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { getCommentsByDanziId, addComment, deleteComment } from '@/api/commentApi';

const props = defineProps({
  danziId: {
    type: [String, Number],
    required: true,
  },
});

const authStore = useAuthStore();

const comments = ref([]);
const newCommentContent = ref('');
const loading = ref(true);
const error = ref(null);
const isSubmitting = ref(false);

// 댓글 목록 불러오기
const fetchComments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await getCommentsByDanziId(props.danziId);
    comments.value = response.data;
  } catch (err) {
    console.error('댓글 조회 실패:', err);
    error.value = '댓글을 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
};

// 댓글 등록
const submitComment = async () => {
  if (!newCommentContent.value.trim()) {
    alert('댓글 내용을 입력해주세요.');
    return;
  }
  if (!authStore.isLoggedIn) {
    alert('로그인이 필요합니다.');
    return;
  }

  isSubmitting.value = true;
  try {
    const commentData = {
      danziId: props.danziId,
      content: newCommentContent.value,
      userId: authStore.user.id, // store에서 현재 로그인된 사용자 ID 가져오기
      nickname: authStore.user.nickname, // store에서 현재 로그인된 사용자 닉네임 가져오기
    };
    console.log(Number( authStore.user.id));
    await addComment(commentData);
    newCommentContent.value = '';
    await fetchComments(); // 목록 새로고침
  } catch (err) {
    console.error('댓글 작성 실패:', err);
    alert('댓글 등록에 실패했습니다.');
  } finally {
    isSubmitting.value = false;
  }
};

// 댓글 삭제
const removeComment = async (commentId) => {
  if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
    return;
  }

  try {
    await deleteComment(commentId);
    await fetchComments(); // 목록 새로고침
  } catch (err) {
    console.error('댓글 삭제 실패:', err);
    alert('댓글 삭제에 실패했습니다.');
  }
};

// 날짜 포맷팅 함수
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

onMounted(() => {
  if (props.danziId) {
    fetchComments();
  }
});
</script>

<style scoped>
.comments-container {
  max-width: 900px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 12px;
}

.title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #111827;
}

.comment-form {
  margin-bottom: 24px;
}

.comment-textarea {
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  font-size: 15px;
  resize: vertical;
}

.submit-button {
  display: block;
  margin-left: auto;
  margin-top: 12px;
  padding: 10px 20px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #1d4ed8;
}

.submit-button:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  position: relative;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.comment-author {
  font-weight: 600;
  color: #1f2937;
}

.comment-date {
  font-size: 13px;
  color: #6b7280;
}

.comment-content {
  color: #374151;
  line-height: 1.6;
}

.delete-button {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  font-size: 13px;
}

.delete-button:hover {
  color: #ef4444;
}

.loading-spinner, .error-message, .no-comments {
  text-align: center;
  padding: 40px;
  color: #6b7280;
}
</style>