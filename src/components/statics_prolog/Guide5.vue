<script setup></script>

<template>
  <div class="section">
    <h2>5. 청약 신청 (청약홈)</h2>

    <div class="subsection">
      <h3>🔹 로그인 후 모집공고 검색</h3>
      <ul>
        <li>
          청약홈 (<a
            href="https://www.applyhome.co.kr/"
            target="_blank"
            rel="noopener noreferrer"
            >applyhome.co.kr</a
          >) 접속
        </li>
        <li>관심 단지 모집공고 → ‘청약신청’ 클릭</li>
      </ul>
    </div>

    <div class="subsection">
      <h3>🔹 공급유형 및 신청 정보 입력</h3>
      <ul>
        <li>일반/특별공급, 우선공급 등 선택</li>
        <li>본인 정보, 가족 관계, 무주택 여부 등 입력</li>
      </ul>
    </div>

    <div class="subsection">
      <h3>🔹 청약금 납부 확인</h3>
      <ul>
        <li>일부 유형은 청약금 납부 필요</li>
        <li>가상계좌 안내 시 <strong>신청 마감일 전까지 입금</strong></li>
      </ul>
    </div>

    <div class="subsection">
      <h3>🔹 신청 완료 확인</h3>
      <ul>
        <li>신청 후 ‘청약내역’에서 접수 여부 확인 가능</li>
      </ul>
    </div>
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
