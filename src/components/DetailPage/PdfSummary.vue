<template>
  <div class="pdf-summary-wrapper" :class="{ closing: isClosing }">
    <!-- 요약 내용 보여주기 -->
    <div class="summary-content">
      <div class="summary-header">
        <h2 class="notice-title">{{ title || '공고 제목 없음' }}</h2>
      </div>

      <!-- 여기서만 상태 스위칭 (디자인/스타일 유지) -->
      <div class="markdown-content">
        <!-- 로딩 -->
        <div v-if="loading" class="text-center">
          <div class="spinner-border" role="status" aria-live="polite">
            <span class="visually-hidden">Loading...</span>
          </div>
          <p class="mt-2">요약을 불러오는 중입니다…</p>
        </div>

        <!-- 에러 -->
        <div v-else-if="error" class="alert alert-warning" role="alert">
          {{ error }}
        </div>

        <!-- 내용 -->
        <div v-else v-html="renderedContent"></div>
      </div>
    </div>

    <!-- 닫기 버튼 영역 -->
    <div class="close-btn-container">
      <button class="close-btn" @click="handleClose">✕</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  title: String, // 제목
  summaryData: { type: String, default: '' }, // 요약 내용(마크다운)
  loading: { type: Boolean, default: false }, // 로딩 여부
  error: { type: String, default: '' }, // 에러 메시지
});

const emit = defineEmits(['close']);

const isClosing = ref(false);

const handleClose = () => {
  isClosing.value = true;
  setTimeout(() => {
    emit('close');
  }, 500);
};

// 마크다운 렌더링
const renderedContent = computed(() => {
  try {
    const src =
      props.summaryData && props.summaryData.length
        ? props.summaryData
        : '# 📄 요약 데이터가 없습니다.';
    return marked(src);
  } catch (error) {
    console.error('마크다운 렌더링 오류:', error);
    return marked(`
# ⚠️ 오류 발생

> 요약 내용을 처리하는 중 문제가 발생했습니다.

원본 데이터:
\`\`\`
${props.summaryData}
\`\`\`
    `);
  }
});

// 새로운 요약이 들어오면 스크롤 맨 위로(UX 보완)
watch(
  () => props.summaryData,
  async () => {
    await nextTick();
    const container = document.querySelector(
      '.pdf-summary-wrapper .summary-content'
    );
    if (container) container.scrollTop = 0;
  }
);
</script>

<style scoped>
.pdf-summary-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  width: 90%;
  height: 100%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  box-sizing: border-box;
  overflow-y: auto;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.15);
  animation: slideInFromRight 0.5s ease forwards;
  z-index: 10;
}

.pdf-summary-wrapper.closing {
  animation: slideOutToRight 0.5s ease forwards;
}

.summary-content {
  margin-top: 20px;
}

.summary-header {
  margin-bottom: 20px;
  padding-bottom: 16px;
}

.notice-title {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.3;
  text-align: left;
}

.summary-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
  font-weight: 600;
}

/* 마크다운 스타일링 */
.markdown-content {
  line-height: 1.6;
  color: #333;
  font-size: 14px;
}

.markdown-content :deep(h1) {
  font-size: 20px;
  font-weight: 700;
  margin: 20px 0 12px 0;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.markdown-content :deep(h2) {
  font-size: 18px;
  font-weight: 600;
  margin: 18px 0 10px 0;
  color: #374151;
}

.markdown-content :deep(h3) {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px 0;
  color: #4b5563;
}

.markdown-content :deep(h4) {
  font-size: 14px;
  font-weight: 600;
  margin: 14px 0 6px 0;
  color: #6b7280;
}

.markdown-content :deep(p) {
  margin: 8px 0;
  line-height: 1.6;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 8px 0;
  padding-left: 20px;
}

.markdown-content :deep(li) {
  margin: 4px 0;
  line-height: 1.5;
}

.markdown-content :deep(strong) {
  font-weight: 600;
  color: #1f2937;
}

.markdown-content :deep(em) {
  font-style: italic;
  color: #4b5563;
}

.markdown-content :deep(code) {
  background-color: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  color: #dc2626;
}

.markdown-content :deep(pre) {
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 12px;
  overflow-x: auto;
  margin: 12px 0;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
  color: #374151;
}

.markdown-content :deep(blockquote) {
  border-left: 4px solid #3b82f6;
  margin: 12px 0;
  padding: 8px 16px;
  background-color: #f8fafc;
  color: #475569;
  font-style: italic;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 8px 12px;
  text-align: left;
}

.markdown-content :deep(th) {
  background-color: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.markdown-content :deep(tr:nth-child(even)) {
  background-color: #f9fafb;
}

.markdown-content :deep(a) {
  color: #3b82f6;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

.markdown-content :deep(hr) {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 20px 0;
}

.close-btn-container {
  position: sticky;
  bottom: 20px;
  text-align: right;
  padding: 0;
  margin: 20px 0 0 0;
}

.close-btn {
  background: #ff9898;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: white;
  width: 40px;
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-weight: 600;
}

.close-btn:hover {
  background-color: #f67280;
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideOutToRight {
  from {
    opacity: 1;
    transform: translateX(0);
  }
  to {
    opacity: 0;
    transform: translateX(100%);
  }
}

/* 부트스트랩 보조 유틸 (있으면 그대로 활용됨) */
.text-center {
  text-align: center;
}
.mt-2 {
  margin-top: 0.5rem;
}
.alert {
  padding: 10px 12px;
  border-radius: 8px;
}
.alert-warning {
  background: #fff7e6;
  border: 1px solid #ffe8b3;
  color: #7a5b00;
}
.spinner-border {
  display: inline-block;
}
</style>
