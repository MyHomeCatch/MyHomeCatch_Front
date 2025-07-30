<template>
  <div class="guide">
    <h2>1. 청약 기본 이해</h2>
    <p></p>
    <h3>1-1. 청약이란?</h3>
    <ul>
      <li>
        <strong>주택을 분양받기 위해 사전에 신청</strong>하고, 경쟁 시
        배정·추첨·가점제 등을 통해 당첨자를 선정하는 제도입니다.
      </li>
      <li>
        분양가격·공급세대수·신청조건은 <strong>모집공고</strong>로 확정되며,
        당첨 후 계약 체결 시 실제 분양 절차로 이어집니다.
      </li>
      <li>
        1세대(가구) 기준 신청 제한이 있는 경우가 많으니
        <strong>세대 단위 관리</strong>가 필수입니다.
      </li>
    </ul>

    <h3>1-2. 청약 유형 구분</h3>

    <h4>민영 vs 공공</h4>
    <table>
      <thead>
        <tr>
          <th>구분</th>
          <th>민영주택</th>
          <th>공공분양/공공임대</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>공급주체</td>
          <td>민간 건설사</td>
          <td>공공기관 (LH, SH 등) 또는 혼합</td>
        </tr>
        <tr>
          <td>분양가</td>
          <td>시장 영향 큼, 지역/브랜드 편차</td>
          <td>분양가상한제 적용 구간 많아 안정</td>
        </tr>
        <tr>
          <td>경쟁구조</td>
          <td>인기 단지 경쟁률 ↑</td>
          <td>공급대상 제한 및 우선순위 규칙 존재</td>
        </tr>
        <tr>
          <td>심사서류</td>
          <td>상대적으로 단순 (단지별 상이)</td>
          <td>소득·자산 등 증빙 요구 빈번</td>
        </tr>
      </tbody>
    </table>

    <blockquote>
      <strong>Tip:</strong> 실사용 목적 + 낮은 분양가 → 공공분양 유리. <br />
      브랜드/입지 선호 → 민영 주택 고려.
    </blockquote>

    <h4>특별공급 vs 일반공급</h4>
    <table>
      <thead>
        <tr>
          <th>구분</th>
          <th>대상</th>
          <th>선정방식</th>
          <th>비고</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>특별공급</td>
          <td>신혼부부, 다자녀, 생애최초, 노부모부양 등</td>
          <td>자격 충족 시 우선 배정 + 가점/추첨</td>
          <td>공급비율은 단지별 상이</td>
        </tr>
        <tr>
          <td>일반공급</td>
          <td>기본자격 충족 시 누구나</td>
          <td>가점제 + 추첨제 병행</td>
          <td>주택형/지역에 따라 다름</td>
        </tr>
      </tbody>
    </table>

    <blockquote>
      <strong>핵심:</strong> 특별공급 대상이면 경쟁이 줄어 유리. 아니라면
      가점/추첨 전략 필요.
    </blockquote>

    <h3>1-3. 청약 자격 확인 핵심 항목</h3>
    <ol>
      <li>
        <strong>무주택 여부</strong><br />
        본인 + 배우자 + 세대원 주택 보유 여부 합산.<br />
        일부 소형·지방 주택은 예외 가능 → 모집공고 필수 확인.
      </li>
      <li>
        <strong>청약통장 가입 상태</strong><br />
        주택청약종합저축 등.<br />
        가입기간, 납입 인정금액, 지역별 최소 횟수가 순위에 영향.
      </li>
      <li>
        <strong>지역 요건</strong><br />
        당해(지역 거주) vs 기타지역.<br />
        거주기간 요건 존재 가능 (예: 6개월 이상).
      </li>
      <li>
        <strong>가점 요소</strong><br />
        무주택 기간 / 부양가족 수 / 청약통장 가입기간.<br />
        → 84점 만점 가점체계.
      </li>
      <li>
        <strong>순위 판정</strong><br />
        1순위: 조건 충족 시<br />
        2순위: 조건 미충족 시 후순위 (대부분 기회 없음)
      </li>
    </ol>

    <h3>1-4. 빠른 자가진단 체크리스트</h3>
    <table>
      <thead>
        <tr>
          <th>체크</th>
          <th>질문</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>☐</td>
          <td>세대 구성원 중 누구도 주택을 소유하고 있지 않다</td>
        </tr>
        <tr>
          <td>☐</td>
          <td>청약통장 가입 완료 + 납입금액/기간 확인 완료</td>
        </tr>
        <tr>
          <td>☐</td>
          <td>거주지 기준 당해/기타지역 구분 가능</td>
        </tr>
        <tr>
          <td>☐</td>
          <td>특별공급 해당 여부 확인 (신혼, 다자녀 등)</td>
        </tr>
        <tr>
          <td>☐</td>
          <td>예상 가점 대략 계산 완료</td>
        </tr>
        <tr>
          <td>☐</td>
          <td>현재 내 순위(1순위/2순위) 파악</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.guide {
  line-height: 1.8;
  font-size: 16px;
  color: #222;
}

h2 {
  font-size: 28px;
  margin-bottom: 24px;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

h3 {
  font-size: 22px;
  margin-top: 40px;
  margin-bottom: 16px;
  color: #005b99;
  border-left: 5px solid #005b99;
  padding-left: 12px;
}

h4 {
  font-size: 18px;
  margin-top: 24px;
  margin-bottom: 10px;
  color: #333;
  font-weight: bold;
}

ul,
ol {
  padding-left: 20px;
  margin-bottom: 20px;
}

ul li,
ol li {
  margin-bottom: 8px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 15px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: left;
}

blockquote {
  background: #f9f9f9;
  padding: 14px;
  margin: 24px 0;
  border-left: 5px solid #00aaff;
  font-style: italic;
  color: #333;
}
</style>
