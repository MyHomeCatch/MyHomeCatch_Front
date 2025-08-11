<template>
  <div class="pdf-summary-wrapper" :class="{ 'closing': isClosing }">
    <!-- 요약 내용 보여주기 -->
    <div class="summary-content">
      <div class="summary-header">
        <h2 class="notice-title">{{ title || '공고 제목 없음' }}</h2>
      </div>
      <div class="markdown-content" v-html="renderedContent"></div>
    </div>
    
    <!-- 닫기 버튼 영역 -->
    <div class="close-btn-container">
      <button class="close-btn" @click="handleClose">
        ✕
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { marked } from 'marked';

const props = defineProps({
  summaryData: String,
  title: String,
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
# 공고 요약

## 개요
- 화성동탄지구 내 행복주택 입주자격 완화 대기자 모집 공고
- 대상 블록: 동탄2 C26, A82, A77-1, A4-1, 지원6-2, A53, A54, A57-1 블록 (총 773호)
- 동호 지정 계약, 소득 및 총자산 배제, 선 계약 후 검증 방식 적용

## 주요 내용
- **자격 완화 내용**
    - 소득 및 총자산 기준은 적용하지 않으나, 자동차가액(3,803만원 이하)은 적용
    - 원하는 블록 및 동호 지정 가능
    - 선 계약 후 자격 검증 방식으로 진행 (무주택, 차량가액 3,803만원 이하)
    - 부적격자 확정 시 계약 해지 및 계약금 반환 (이자 없음)
- **신청 자격**
    - 공고일(2025-07-31) 현재 화성시 또는 화성시 연접지역(수원시, 오산시, 용인시, 안산시, 평택시) 거주자
    - 계층별 자격을 충족하는 성년(만 19세) 이상인 무주택 세대구성원 (대학생, 청년은 무주택자)
    - 1인 중복 신청 불가
    - 입주자격 제한(불법양도/전대)에 해당되지 않는 자
- **최대 거주 기간**

| 입주자격                 | 최대 거주기간 |
| :----------------------- | :------------ |
| 대학생, 청년 계층         | 10년           |
| 신혼부부 · 한부모가족 계층 | 무자녀(10년), 자녀 1명 이상(14년) |
| 고령자, 주거급여수급자     | 20년           |

- **계약 체결 장소**
    - 1차 ~ 3차 계약: 화성동부권주거복지지사 (경기도 화성시 메타폴리스로 53 스타프라자 4층)
    - 4차 계약부터: 이전한 화성동부권주거복지지사 (경기도 화성시 도시첨단산업1로 18 스마트주차장 건물 3층)
- **모집 대상 건설 위치 및 공급 계획**

| 단지명        | 주소                               | 입주개시 |
| :------------ | :--------------------------------- | :------- |
| C26블록(26단지) | 경기도 화성시 동탄기흥로 277번길 12(오산동 1017) | 2017-02  |
| A82블록(28단지) | 경기도 화성시 동탄순환대로2길 13(장지동 913)   | 2019-05  |
| A77-1블록(35단지) | 경기도 화성시 동탄순환대로10길 42(산척동 747)  | 2020-07  |
| A4-1블록(2단지)  | 경기도 화성시 동탄영천로 108-21(영천동)          | 2020-08  |
| 지원6-2(1단지)   | 경기도 화성시 동탄첨단산업1로 57(영천동 197)     | 2022-09  |
| A53블록(38단지) | 경기도 화성시 동탄신리천로5길 90(신동 116)     | 2023-04  |
| A54블록(38단지) | 경기도 화성시 동탄신리천로5가길 35(신동 111-1)  | 2023-11  |
| A57-1블록(40단지) | 경기도 화성시 동탄신리천로8길 15(신동 512)     | 2022-06  |

- **신청 방법**
    - 접수 장소: LH 오산동탄사업본부 내 화성동탄신도시 홍보관 (화성시 노작로10)
    - 접수 기간: 2025-08-12(화) ~ 2025-08-13(수) (10:00~16:00, 12:00~13:00 제외)
    - 현장 접수만 가능
- **선정 절차**
    - 청약 접수 (현장 접수만 가능)
    - 대기 순번 발표 후 확인
    - 동호 지정 및 계약 체결 안내에 따라 진행
    - 자격 검증 후 적격자 입주

## 추진 일정

| 구분           | 일시            | 비고                                                                                              |
| :------------- | :-------------- | :------------------------------------------------------------------------------------------------ |
| 모집공고       | 2025-07-31     | LH 청약플러스 (apply.lh.or.kr)                                                                   |
| 청약접수       | 2025-08-12 ~ 13 | LH 오산동탄사업본부 내 화성동탄신도시 홍보관 (화성시 노작로10) (10:00~16:00, 12:00~13:00 제외) |
| 대기순번 추첨   | 2025-09-02 (10:00) | 화성동부권주거복지지사 (경기도 화성시 메타폴리스로53 4층)                                                         |
| 대기순번 발표   | 2025-09-02 (15:00) | LH 청약플러스 (apply.lh.or.kr)-공지사항                                                                 |
| 1차 안내문 발송 | 2025-09-04     | 대기순번 1번부터 773번까지                                                                         |
| 동호지정 및 계약 | 2025-09-16 ~ 24 | LH 화성동부권주거복지지사 (10:00~17:00) 대기순번별 상이                                                              |
| 2차 안내문 발송 | 2025-09-30     | 대기순번 774번부터 ~ (미정) * 추후 계약 현황에 따라 개별 안내문 송부 예정                                                      |
| 동호지정 및 계약 | 2025-10-14 ~ 15 | LH 화성동부권주거복지지사 (10:00~17:00)                                                              |
| 3차 안내문 발송 | 2025-10-16     | 추후 계약 현황에 따라 계약 대상자에게 개별 안내문 송부예정                                                                |
| 동호지정 및 계약 | 2025-10-28 ~ 29 | LH 화성동부권주거복지지사 (13:30~17:00)                                                              |

## 참고 링크
- LH 청약플러스: apply.lh.or.kr
- LH 콜센터: 1600-1004, 031-831-2435, 2439
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
</style>
