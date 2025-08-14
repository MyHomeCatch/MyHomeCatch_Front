<template>
  <section class="pdfsum">
    <!-- 상단 고정 타이틀 바 -->
    <header class="pdfsum__topbar">
      <div class="pdfsum__topbar__left">
        <!-- ✨ 아이콘 없이 강조된 AI 칩 -->
        <span class="ai-chip" aria-label="AI 요약">
          <span class="ai-chip__ring"></span>
          <span class="ai-chip__glow"></span>
          <span class="ai-chip__text">AI&nbsp;요약</span>
        </span>

        <h2 class="pdfsum__title">공고 PDF</h2>
      </div>
    </header>

    <!-- 공고명 -->
    <div class="pdfsum__header">
      <h3 class="pdfsum__notice">{{ title || '공고 제목 없음' }}</h3>
    </div>

    <!-- 본문 -->
    <div class="pdfsum__body">
      <!-- 로딩 -->
      <div v-if="loading" class="pdfsum__loading">
        <div class="spinner-border" role="status" aria-live="polite">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p>요약을 불러오는 중입니다…</p>
      </div>

      <!-- 에러 -->
      <div v-else-if="error" class="pdfsum__alert" role="alert">
        {{ error }}
      </div>

      <!-- 내용 (Markdown → HTML) -->
      <div
        v-else
        ref="contentEl"
        class="pdfsum__markdown"
        :class="{ 'is-collapsed': !expanded && canCollapse }"
        v-html="html"
      ></div>

      <!-- 토글 버튼 (내용이 길 때만 노출) -->
      <div v-if="canCollapse" class="pdfsum__toggle">
        <button class="pdfsum__togglebtn" @click="expanded = !expanded">
          {{ expanded ? '접기' : '자세히 보기' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, nextTick, watch } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  title: String,
  summaryData: { type: String, default: '' }, // 📌 Markdown 원문
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

/** 최소 HTML 이스케이프 — 설치 없이 태그 무력화 */
const escapeHtml = (s = '') =>
  s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

/** marked 옵션 */
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
});

/** Markdown -> HTML (간단 이스케이프 후 렌더) */
const html = computed(() => {
  const src = (props.summaryData ?? '').trim().length
    ? props.summaryData
    : '### 📄 요약 데이터가 없습니다.\n원문 PDF를 확인해 주세요.';
  return marked.parse(escapeHtml(src));
});

// 접기/펼치기
const expanded = ref(false);
const canCollapse = ref(false);
const contentEl = ref(null);
const COLLAPSE_HEIGHT = 280; // px

const measureContent = async () => {
  await nextTick();
  const el = contentEl.value;
  if (!el) {
    canCollapse.value = false;
    expanded.value = true;
    return;
  }
  const needs = el.scrollHeight > COLLAPSE_HEIGHT + 12;
  canCollapse.value = needs;
  expanded.value = !needs; // 길면 접어서 시작
};

// 데이터 바뀌면 재측정 + 스크롤 상단
watch(
  () => props.summaryData,
  async () => {
    await measureContent();
    const container = document.querySelector('.pdfsum');
    if (container) container.scrollTop = 0;
  },
  { immediate: true }
);
</script>

<style scoped>
/* ===== Theme */
:root {
  --pdfsum-primary: #4caf50; /* 메인 그린 */
  --pdfsum-primary-2: #66bb6a; /* 보조 그린 */
  --pdfsum-bg: #ffffff;
  --pdfsum-border: #e5e7eb;
  --pdfsum-text: #111827;
  --pdfsum-sub: #6b7280;
}

/* ===== Card (적당히 차게: 최소~최대 사이 반응형) */
.pdfsum {
  position: relative;
  width: clamp(320px, 96vw, 1400px);
  margin: 0 auto 28px;
  background: var(--pdfsum-bg);
  border: 1px solid var(--pdfsum-border);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 36px rgba(17, 24, 39, 0.08);
}
@media (max-width: 768px) {
  .pdfsum {
    width: calc(100% - 24px);
  } /* 모바일 좌우 여백 */
}

/* ===== Topbar — #4caf50 고정 */
.pdfsum__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 22px;
  background: #4caf50;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);
}
.pdfsum__topbar__left {
  display: flex;
  align-items: center;
  gap: 12px;
}
.pdfsum__title {
  margin: 0;
  font-size: 20px;
  font-weight: 900;
  color: #fff;
  letter-spacing: 0.2px;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.08);
}

/* ===== AI 칩(아이콘 없이 강조) */
.ai-chip {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 6px 18px rgba(76, 175, 80, 0.18),
    0 1px 0 rgba(255, 255, 255, 0.6) inset;
  overflow: hidden;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.ai-chip__ring {
  /* 그라데이션 보더 링 */
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1.5px;
  background: conic-gradient(
    from 120deg,
    #9be7a6,
    var(--pdfsum-primary),
    #b2f0bb,
    var(--pdfsum-primary)
  );
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0.75;
  pointer-events: none;
}
.ai-chip__glow {
  /* 은은한 내부 글로우 */
  position: absolute;
  inset: -18px;
  border-radius: inherit;
  background: radial-gradient(
    circle at 30% 50%,
    rgba(76, 175, 80, 0.45),
    transparent 60%
  );
  filter: blur(18px);
  opacity: 0.35;
  pointer-events: none;
}
.ai-chip__text {
  /* 그라데이션 텍스트 */
  background-image: linear-gradient(90deg, #2e7d32, #66bb6a, #2e7d32);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-size: 13.5px;
  font-weight: 900;
  letter-spacing: 0.4px;
  text-transform: uppercase;
}
.ai-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(76, 175, 80, 0.26),
    0 1px 0 rgba(255, 255, 255, 0.7) inset;
}
.ai-chip::after {
  /* 하이라이트 쉬엔 */
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  height: 100%;
  width: 42%;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.85),
    rgba(255, 255, 255, 0)
  );
  transform: skewX(-20deg);
  opacity: 0;
  pointer-events: none;
}
.ai-chip:hover::after {
  animation: aiSheen 1.05s ease forwards;
}
@keyframes aiSheen {
  0% {
    left: -60%;
    opacity: 0;
  }
  25% {
    opacity: 1;
  }
  100% {
    left: 120%;
    opacity: 0;
  }
}

/* ===== Header (notice name) */
.pdfsum__header {
  padding: 16px 22px 8px;
  border-bottom: 1px dashed var(--pdfsum-border);
  background: #fff;
}
.pdfsum__notice {
  margin: 0;
  color: var(--pdfsum-text);
  font-size: 21px;
  font-weight: 800;
  line-height: 1.35;
}

/* ===== Body */
.pdfsum__body {
  padding: 16px 22px 18px;
}

/* Loading */
.pdfsum__loading {
  display: grid;
  place-items: center;
  gap: 8px;
  padding: 20px 0;
  color: var(--pdfsum-sub);
}

/* Error */
.pdfsum__alert {
  padding: 12px 14px;
  border: 1px solid #ffe8b3;
  background: #fff7e6;
  color: #7a5b00;
  border-radius: 10px;
  font-size: 14px;
}

/* ===== Markdown container */
.pdfsum__markdown {
  color: #374151;
  font-size: 15.5px;
  line-height: 1.78;
}

/* Collapsed preview */
.pdfsum__markdown.is-collapsed {
  max-height: 300px;
  overflow: hidden;
  position: relative;
  font-size: 14.5px;
  line-height: 1.72;
}
.pdfsum__markdown.is-collapsed::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 72px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0), #fff);
  pointer-events: none;
}

/* Toggle button */
.pdfsum__toggle {
  display: flex;
  justify-content: center;
  margin-top: 12px;
}
.pdfsum__togglebtn {
  padding: 10px 20px;
  border-radius: 9999px;
  border: 1px solid var(--pdfsum-primary);
  background: #fff;
  color: var(--pdfsum-primary);
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.12);
}
.pdfsum__togglebtn:hover {
  transform: translateY(-1px);
  background: var(--pdfsum-primary);
  color: #fff;
  box-shadow: 0 8px 22px rgba(76, 175, 80, 0.24);
}
.pdfsum__togglebtn:focus-visible {
  outline: 2px solid rgba(76, 175, 80, 0.35);
  outline-offset: 2px;
}

/* ===== Markdown Typography */
.pdfsum__markdown :deep(h1) {
  font-size: 21px;
  font-weight: 800;
  margin: 20px 0 10px;
  color: var(--pdfsum-text);
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 8px;
}
.pdfsum__markdown :deep(h2) {
  font-size: 19px;
  font-weight: 800;
  margin: 18px 0 8px;
  color: var(--pdfsum-text);
}
.pdfsum__markdown :deep(h3) {
  font-size: 17px;
  font-weight: 700;
  margin: 14px 0 6px;
  color: #1f2937;
}
.pdfsum__markdown :deep(h4) {
  font-size: 15px;
  font-weight: 700;
  margin: 12px 0 6px;
  color: #374151;
}

.pdfsum__markdown :deep(p) {
  margin: 9px 0;
}
.pdfsum__markdown :deep(ul),
.pdfsum__markdown :deep(ol) {
  margin: 8px 0;
  padding-left: 22px;
}
.pdfsum__markdown :deep(li) {
  margin: 4px 0;
}

.pdfsum__markdown :deep(blockquote) {
  border-left: 3px solid #a5d6a7;
  margin: 12px 0;
  padding: 10px 16px;
  background: #f2fbf3;
  color: #2e7d32;
  font-style: italic;
  border-radius: 8px;
}

.pdfsum__markdown :deep(code) {
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, Menlo, Monaco, Consolas, 'Courier New', monospace;
  font-size: 12.5px;
  color: #b91c1c;
}
.pdfsum__markdown :deep(pre) {
  background: #0b1021;
  color: #e5e7eb;
  border-radius: 12px;
  padding: 14px;
  overflow-x: auto;
  margin: 12px 0;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
}
.pdfsum__markdown :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.pdfsum__markdown :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13.5px;
}
.pdfsum__markdown :deep(th),
.pdfsum__markdown :deep(td) {
  border: 1px solid var(--pdfsum-border);
  padding: 9px 12px;
  text-align: left;
}
.pdfsum__markdown :deep(th) {
  background: #f9fafb;
  font-weight: 800;
  color: #374151;
}
.pdfsum__markdown :deep(tr:nth-child(even)) {
  background: #fcfcfc;
}

.pdfsum__markdown :deep(a) {
  color: #1e6f2d;
  text-decoration: none;
  font-weight: 600;
  border-bottom: 1px dashed rgba(30, 111, 45, 0.25);
}
.pdfsum__markdown :deep(a:hover) {
  text-decoration: underline;
  border-bottom-color: transparent;
}
</style>
