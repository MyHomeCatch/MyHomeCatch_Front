<template>
  <div class="info-panel-container-wrapper">
    <div class="info-panel-container">
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
          <div>공고유형</div>
          <div>{{ getMapUppAisName(primaryNotice) || '-' }}</div>
        </div>
        <div class="info-item alternate-bg">
          <div>공급정보</div>
          <div>{{ getMapTypeCodeName(primaryNotice) || '-' }}</div>
        </div>
        <div class="info-item">
          <div>주택유형</div>
          <div>{{ primaryNotice.aisTpCdNm }}</div>
        </div>
        <div class="info-item alternate-bg">
          <div>공급면적</div>
          <div>{{ danziInfo.minMaxRsdnDdoAr }} ㎡</div>
        </div>
        <div class="info-item">
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
        <div class="info-item alternate-bg">
          <div>서류 접수기간</div>
          <div>
            {{
              formatDateRange(
                primaryApply.pprAcpStDt,
                primaryApply.pprSbmOpeAncDt
              )
            }}
          </div>
        </div>
        <div class="info-item">
          <div>당첨발표일</div>
          <div>{{ formatSingleDate(primaryApply.pzwrAncDt) }}</div>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

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

const emit = defineEmits(['request-summary']);

const hasPdf = computed(() => !!pdfAttachmentUrl.value);

const handleShowSummary = () => {
  if (!hasPdf.value) {
    alert('공고 PDF를 찾을 수 없습니다.');
    return;
  }
  emit('request-summary');
};

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

function formatSingleDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return date.toLocaleDateString('ko-KR');
}

function formatDateRange(start, end) {
  if (!start) return '-';
  const startDate = formatSingleDate(start);
  const endDate = end ? formatSingleDate(end) : '';
  return endDate && startDate !== endDate
    ? `${startDate} ~ ${endDate}`
    : startDate;
}

function formatYearMonth(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
}

function openLink(url) {
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('제공된 링크가 없습니다.');
  }
}

const UPP_AIS_TP_CD_MAP = Object.freeze({
  '01': '토지',
  '05': '분양주택',
  '06': '임대주택',
  13: '주거복지',
  22: '상가',
  39: '신혼희망타운',
});

const SPL_INF_TP_MAP = Object.freeze({
  '010': '토지',
  '050': '분양주택',
  '051': '분양주택-분양전환',
  '060': '공공임대(5년·10년·분납임대)',
  '061': '50년공공임대',
  '062': '국민임대/장기전세/신축다세대/영구임대',
  '063': '행복주택',
  '064': '가정어린이집',
  130: '청년신혼부부매입임대리츠',
  131: '청년매입임대',
  1315: '청년매입임대(수시)',
  132: '신혼부부매입임대',
  1325: '신혼부부매입임대(수시)',
  133: '집주인리모델링',
  134: '기숙사형매입임대',
  135: '다가구매입임대',
  136: '매입임대-장기미임대',
  137: '청년전세임대',
  138: '신혼부부전세임대',
  139: '기존주택전세임대',
  140: '다자녀전세임대',
  141: '다자녀매입임대',
  143: '전세형매입임대',
  144: '공공전세주택',
  390: '신혼희망타운',
});

function getMapUppAisName(p) {
  if (!p) return null;
  const upp = p.uppAisTpCd != null ? String(p.uppAisTpCd).trim() : null;
  const typeName = upp ? UPP_AIS_TP_CD_MAP[upp] ?? null : null;

  return typeName;
}

function getMapTypeCodeName(p) {
  if (!p) return null;
  const spl = p.splInfTpCd != null ? String(p.splInfTpCd).trim() : null;
  const typeName = spl ? SPL_INF_TP_MAP[spl] ?? null : null;
  return typeName;
}
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
  box-sizing: border-box;
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
  height: 50px;
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
