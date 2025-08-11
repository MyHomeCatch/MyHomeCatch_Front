<template>
  <div class="info-panel-container-wrapper">
    <div
      v-if="danziInfo"
      :class="['info-panel-container', { 'shift-left': showSummary }]"
    >
      <!-- 조회수 -->
      <h3 class="view-count">
        지금까지
        <span class="highlight">{{ primaryNotice.allCnt || 3 }}명</span>이 이
        공고를 봤어요.
      </h3>

      <!-- 즐겨찾기와 접수상태 -->
      <div class="status-wrapper">
        <span class="favorite-status"> 즐겨찾기: {{ bookmarkCount }}명 </span>

        <span class="apply-status" :style="applyStatusStyle">
          {{ applyStatusText }}
        </span>
      </div>

      <!-- 분양 세대수 -->
      <div class="info-item-box">
        <div>분양 세대수</div>
        <div>{{ danziInfo.sumTotHshCnt }} 세대</div>
      </div>

      <!-- 정보 항목 리스트 -->
      <div class="info-list">
        <div class="info-item">
          <div>주택유형</div>
          <div>{{ primaryNotice.aisTpCdNm }}</div>
        </div>
        <div class="info-item alternate-bg">
          <div>공급면적</div>
          <div>{{ danziInfo.minMaxRsdnDdoAr }} ㎡</div>
        </div>
        <div class="info-item">
          <div>접수방법</div>
          <div>{{ primaryApply.rmk || '-' }}</div>
        </div>
        <div class="info-item alternate-bg">
          <div>접수기간</div>
          <div>
            {{
              formatDateRange(
                primaryApply.sbscAcpStDt,
                primaryApply.sbscAcpClsgDt
              )
            }}
          </div>
        </div>
        <div class="info-item">
          <div>당첨발표일</div>
          <div>{{ formatSingleDate(primaryApply.pzwrAncDt) }}</div>
        </div>
        <div class="info-item alternate-bg">
          <div>당첨자 서류제출</div>
          <div>
            {{
              formatDateRange(
                primaryApply.pzwrPprSbmStDt,
                primaryApply.pzwrPprSbmEdDt
              )
            }}
          </div>
        </div>
        <div class="info-item">
          <div>입주예정</div>
          <div>{{ formatYearMonth(danziInfo.mvinXpcYm) }}</div>
        </div>
        <div class="info-item alternate-bg">
          <div>난방</div>
          <div>{{ danziInfo.htnFmlaDeCoNm || '지역난방' }}</div>
        </div>
      </div>

      <!-- 버튼 그룹 -->
      <div class="button-group">
        <button @click="openLink(primaryNotice.dtlUrl)" class="action-button">
          공고 상세 바로가기
        </button>

        <div class="button-row">
          <button
            @click="openLink(pdfAttachmentUrl)"
            class="action-button pdf-button"
            :disabled="!pdfAttachmentUrl"
          >
            공고 PDF 다운로드
          </button>
          <button
            @click="showSummary = true"
            class="action-button-outline summary-button"
          >
            공고 요약
          </button>
        </div>
      </div>
    </div>

    <!-- PdfSummary 컴포넌트 오른쪽 고정, showSummary 상태에 따라 표시 -->
    <PdfSummary
      v-if="showSummary"
      @close="showSummary = false"
      :summaryData="primaryNotice.summaryData"
      class="pdf-summary-wrapper"
    />
  </div>
</template>

<script setup>
import { defineProps, computed, ref } from 'vue';
import PdfSummary from './PdfSummary.vue';

const props = defineProps({
  danziInfo: {
    type: Object,
    default: () => ({}),
  },
  applyInfo: {
    type: Array,
    default: () => [],
  },
  notices: {
    type: Array,
    default: () => [],
  },
  bookmarkCount: {
    type: Number,
    default: 0,
  },
});

const showSummary = ref(false);

const primaryNotice = computed(() =>
  props.notices && props.notices.length > 0 ? props.notices[0] : {}
);
const primaryApply = computed(() =>
  props.applyInfo && props.applyInfo.length > 0 ? props.applyInfo[0] : {}
);

const pdfAttachmentUrl = computed(() => {
  if (primaryNotice.value && primaryNotice.value.noticeAttachments) {
    const pdfFile = primaryNotice.value.noticeAttachments[0];
    return pdfFile ? pdfFile.ahflUrl : null;
  }
  return null;
});

const applyStatusText = computed(
  () => primaryNotice.value.panSs || '정보 없음'
);

const applyStatusStyle = computed(() => {
  switch (applyStatusText.value) {
    case '접수중':
    case '공고중':
      return {
        backgroundColor: '#F6B9AE',
        color: '#7B3E32',
        fontWeight: '600',
      };
    case '접수마감':
      return {
        backgroundColor: '#D9D9D9',
        color: '#4B4B4B',
        fontWeight: '600',
      };
    default:
      return {
        backgroundColor: '#F7F0E0',
        color: '#736C4A',
        fontWeight: '600',
      };
  }
});

const formatSingleDate = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR');
};

const formatDateRange = (start, end) => {
  if (!start) return '-';
  const startDate = formatSingleDate(start);
  const endDate = end ? formatSingleDate(end) : '';
  return endDate && startDate !== endDate
    ? `${startDate} ~ ${endDate}`
    : startDate;
};

const formatYearMonth = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
};

const openLink = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('제공된 링크가 없습니다.');
  }
};
</script>

<style scoped>
.info-panel-container-wrapper {
  display: flex;
  gap: 16px;
  position: relative;
}

.info-panel-container {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
  width: 100%; /* 넓게 */
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.info-panel-container.shift-left {
  transform: translateX(-25%);
}

.pdf-summary-wrapper {
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 30%;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  animation: slideIn 0.3s ease forwards;
  z-index: 10;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.view-count {
  text-align: center;
  margin-bottom: 16px;
  font-weight: 600;
  font-size: 16px;
}

.highlight {
  color: #3b82f6;
}

.status-wrapper {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.favorite-status,
.apply-status {
  padding: 6px 12px;
  border-radius: 9999px;
  font-weight: 600;
}

.favorite-status {
  border: 1.5px solid #3b82f6;
  color: #3b82f6;
}

.info-item-box {
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 600;
}

.info-list {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item > div:first-child {
  font-weight: 600;
  color: #374151;
}

.info-item > div:last-child {
  color: #1f2937;
}

.alternate-bg {
  background-color: #f9fafb;
}

.button-group {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px; /* 각 줄 간격 */
}

.button-row {
  display: flex;
  gap: 10px; /* 버튼 간 간격 */
}
.button-row {
  display: flex;
  gap: 10px;
}

.button-row .pdf-button {
  flex: 8;
}

.button-row .summary-button {
  flex: 2;
}

.action-button {
  flex: 1;
  padding: 12px;
  background-color: #ff9898;
  color: white;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  text-align: center;
}

.action-button:hover {
  background-color: #f67280;
}

.action-button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}

.action-button-outline {
  flex: 1;
  padding: 12px;
  background-color: white;
  color: #ff9898;
  border: 2px solid #ff9898;
  border-radius: 50px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.action-button-outline:hover {
  background-color: #ffe6e6;
}
</style>
