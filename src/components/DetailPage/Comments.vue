<script setup>
import axios from 'axios';
import { ref, onMounted } from 'vue';

const panId = 'now_panId';
const comments = ref([]);

// 댓글 목록 조회
async function fetchComments() {
  try {
    const res = await axios.get(`/api/detail/comments/${panId}`, {
      params: { panId },
    });
    comments.value = res.data;
  } catch (e) {
    console.log('댓글 조회 실패', e);
  }
}

// 댓글 삭제
async function delComment(idx) {
  try {
    const commentId = comments.value[idx].commentId;
    await axios.delete(`/api/detail/comments/${commentId}`);
    comments.value.splice(idx, 1);
  } catch (e) {
    console.log('댓글 삭제 실패', e);
  }
}

// 댓글 작성
async function addComment(newComment) {
  try {
    await axios.post(`/api/detail/comments`, newComment);
    await fetchComments(); // 새로고침
  } catch (e) {
    console.error('댓글 작성 실패', e);
  }
}

onMounted(() => {
  fetchComments();
});

// 프론트 디자인 테스트 용도
// const comments = [
//   { nickname: "펌로봇사", date: "2025년 7월 21일", content: "분양권리에 대한 감상평, 입지에 대한 평가 등등..." },
//   { nickname: "사용자1", date: "2025년 7월 20일", content: "두 번째 테스트 댓글입니다." }
// ];

// function deleteComment(idx) {
//   alert(`댓글 ${idx + 1} 삭제 클릭됨!`);
// }
</script>

<template>
  <div class="bg-light rounded p-4 max-w-md mx-auto">
    <h2 class="mb-4 fw-bold">단지별 소통게시판</h2>

    <div
      v-for="(comment, idx) in comments"
      :key="idx"
      class="bg-white rounded shadow-sm p-3 mb-3"
    >
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="d-flex gap-3">
          <span class="fw-semibold">{{ comment.nickname }}</span>
          <span class="text-muted small">{{ comment.date }}</span>
        </div>
        <!-- 둥근 테두리 네모 버튼 -->
        <button
          class="btn btn-outline-success btn-sm rounded-pill px-3 py-1"
          @click="delComment(idx)"
          style="font-weight: 600"
        >
          삭제
        </button>
      </div>
      <div class="text-success bg-success bg-opacity-25 rounded p-3">
        {{ comment.content }}
      </div>
    </div>
  </div>
</template>
