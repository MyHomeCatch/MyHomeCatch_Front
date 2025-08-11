<template>
  <div class="pdf-summary-wrapper" :class="{ 'closing': isClosing }">
    <button class="close-btn" @click="handleClose">
      ✕
    </button>
    <!-- 요약 내용 보여주기 -->
    <div class="summary-content">
      <h3>공고 요약</h3>
      <div class="markdown-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  summaryData: String,
});

const isClosing = ref(false);

const handleClose = () => {
  isClosing.value = true;
  setTimeout(() => {
    emit('close');
  }, 500);
};

const emit = defineEmits(['close']);

// 마크다운 렌더링
const renderedContent = computed(() => {
  if (!props.summaryData) {
    return marked(`
# 📋 공고 요약

## 현재 상태
> 요약 내용이 준비되지 않았습니다.

### 안내사항
- 공고 상세 정보를 확인해주세요
- PDF 다운로드를 통해 전체 내용을 확인할 수 있습니다
- 잠시 후 다시 시도해보세요

---
*요약 기능은 공고 내용을 분석하여 제공됩니다*
    `);
  }
  
  try {
    // 마크다운을 HTML로 변환
    return marked(props.summaryData);
  } catch (error) {
    console.error('마크다운 렌더링 오류:', error);
    return marked(`
# ⚠️ 오류 발생

## 문제 상황
> 요약 내용을 처리하는 중 오류가 발생했습니다.

### 원본 내용
\`\`\`
${props.summaryData}
\`\`\`

---
*기술적인 문제로 인해 요약이 표시되지 않습니다*
    `);
  }
});
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

.summary-content h3 {
  margin-bottom: 16px;
  color: #333;
  font-size: 18px;
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

.markdown-content :deep(ul), .markdown-content :deep(ol) {
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

.markdown-content :deep(th), .markdown-content :deep(td) {
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

.close-btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: #ff9898;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: white;
  width: 40px;
  height: 40px;
  display: flex;
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
</style>
