<template>
  <div
    v-if="danziInfo"
    class="info-panel-container"
  >
    <!-- 조회수 (API에 없으므로 일단 제거 또는 가상 데이터 사용) -->
    <h3 class="view-count">
      지금까지 <span class="highlight">{{primaryNotice.allCnt || 3}}명</span>이 이 공고를 봤어요.
    </h3>

    <!-- 즐겨찾기와 접수상태 -->
    <div class="status-wrapper">
      <!-- 즐겨찾기 (API에 없으므로 가상 데이터) -->
      <span class="favorite-status">
        즐겨찾기: 5명
      </span>

      <!-- 접수상태: API의 notices[0].panSs 값 사용 -->
      <span
        class="apply-status"
        :style="applyStatusStyle"
      >
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
        <!-- API 응답의 notices 배열 첫 번째 요소의 aisTpCdNm 사용 -->
        <div>{{ primaryNotice.aisTpCdNm }}</div>
      </div>
      <div class="info-item alternate-bg">
        <div>공급면적</div>
        <div>{{ danziInfo.minMaxRsdnDdoAr }} ㎡</div>
      </div>
      <div class="info-item">
        <div>접수방법</div>
        <!-- API 응답의 applies 배열 첫 번째 요소의 rmk 사용, 없으면 '-' -->
        <div>{{ primaryApply.rmk || '-' }}</div>
      </div>
      <div class="info-item alternate-bg">
        <div>접수기간</div>
        <div>{{ formatDateRange(primaryApply.sbscAcpStDt, primaryApply.sbscAcpClsgDt) }}</div>
      </div>
      <div class="info-item">
        <div>당첨발표일</div>
        <div>{{ formatSingleDate(primaryApply.pzwrAncDt) }}</div>
      </div>
      <div class="info-item alternate-bg">
        <div>당첨자 서류제출</div>
        <div>{{ formatDateRange(primaryApply.pzwrPprSbmStDt, primaryApply.pzwrPprSbmEdDt) }}</div>
      </div>
      <div class="info-item">
        <div>입주예정</div>
        <div>{{ formatYearMonth(danziInfo.mvinXpcYm) }}</div>
      </div>
      <div class="info-item alternate-bg">
        <div>난방</div>
        <!-- API에 없으므로 가상 데이터 또는 제거 -->
        <div>{{ danziInfo.htnFmlaDeCoNm || '지역난방' }}</div>
      </div>
    </div>

    <!-- 버튼 -->
    <div class="button-group">
      <button @click="openLink(primaryNotice.dtlUrl)" class="action-button">
        공고 상세 바로가기
      </button>
      <button @click="openLink(pdfAttachmentUrl)" class="action-button" :disabled="!pdfAttachmentUrl">
        공고 PDF 다운로드
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue';

const props = defineProps({
  danziInfo: {
    type: Object,
    default: () => ({}),
  },
  applyInfo: {
    type: Array,
    default: () => [],
  },
  // notices는 danziInfo 안에 포함되어 있지 않으므로 별도로 받거나, DetailPage에서 가공해서 내려줘야 합니다.
  // 여기서는 DetailPage에서 houseData.notices를 넘겨준다고 가정합니다.
  notices: {
    type: Array,
    default: () => [],
  }
});

// 가장 대표적인 공고와 청약 정보를 사용하기 위한 computed 속성
const primaryNotice = computed(() => props.notices && props.notices.length > 0 ? props.notices[0] : {});
const primaryApply = computed(() => props.applyInfo && props.applyInfo.length > 0 ? props.applyInfo[0] : {});

// PDF 공고문 첨부파일 URL 찾기
const pdfAttachmentUrl = computed(() => {
  if (primaryNotice.value && primaryNotice.value.noticeAttachments) {
    const pdfFile = primaryNotice.value.noticeAttachments.find(file => file.cmnAhflNm.toLowerCase().endsWith('.pdf'));
    return pdfFile ? pdfFile.ahflUrl : null;
  }
  return null;
});

// 접수상태 텍스트
const applyStatusText = computed(() => primaryNotice.value.panSs || '정보 없음');

// 상태별 스타일 계산
const applyStatusStyle = computed(() => {
  switch (applyStatusText.value) {
    case '접수중':
    case '공고중':
      return { backgroundColor: '#F6B9AE', color: '#7B3E32', fontWeight: '600' };
    case '접수마감':
      return { backgroundColor: '#D9D9D9', color: '#4B4B4B', fontWeight: '600' };
    default:
      return { backgroundColor: '#F7F0E0', color: '#736C4A', fontWeight: '600' };
  }
});

// 날짜 포맷팅 헬퍼 함수
const formatSingleDate = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR');
};

const formatDateRange = (start, end) => {
  if (!start) return '-';
  const startDate = formatSingleDate(start);
  const endDate = end ? formatSingleDate(end) : '';
  return endDate && startDate !== endDate ? `${startDate} ~ ${endDate}` : startDate;
};

const formatYearMonth = (timestamp) => {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

// 외부 링크 열기
const openLink = (url) => {
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('제공된 링크가 없습니다.');
  }
};

</script>

<style scoped>
.info-panel-container {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  font-size: 14px;
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
.favorite-status, .apply-status {
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
  display: grid;
  gap: 10px;
}
.action-button {
  width: 100%;
  padding: 12px;
  background-color: #ff9898;
  color: white;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}
.action-button:hover {
  background-color: #f67280;
}
.action-button:disabled {
  background-color: #e5e7eb;
  cursor: not-allowed;
}
</style>