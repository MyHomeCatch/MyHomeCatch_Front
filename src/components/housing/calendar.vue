<template>
  <div class="calendar">
    <div class="schelDate">
      <div class="year">
        <button @click="prevYear" class="nav-btn">&lt;</button>
        <select v-model="selectedYear" class="year-select">
          <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
        </select>
        <button @click="nextYear" class="nav-btn">&gt;</button>
      </div>
      <div class="months">
        <div
          v-for="m in 12"
          :key="m"
          :class="['month', { active: m === selectedMonth }]"
          @click="selectedMonth = m"
        >
          {{ m }}월
        </div>
      </div>
    </div>
    <calendar-filter-bar />
    <div class="scheduler">
      <table>
        <thead>
          <tr>
            <th v-for="day in weekDays" :key="day">{{ day }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(week, index) in calendarGrid" :key="index">
            <td
              v-for="(day, idx) in week"
              :key="idx"
              :class="{ outside: !day.isCurrentMonth }"
            >
              <div class="date">{{ day.date.getDate() }}</div>
              <div class="cal-event"><span class="dot"></span>event</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import './calendar.css';
import calendarFilterBar from './calendarFilterBar.vue';

// 연도 리스트 2020~2030
const years = [];
for (let y = 2020; y <= 2030; y++) {
  years.push(y);
}

// 선택된 연도와 월 (월은 1~12로 관리)
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);

// 연도 변경 함수
const prevYear = () => {
  if (selectedYear.value > 2020) selectedYear.value--;
};
const nextYear = () => {
  if (selectedYear.value < 2030) selectedYear.value++;
};

// 달력에 필요한 요일 배열
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

// 달력 그리드 계산 (6주 × 7일 배열)
const calendarGrid = computed(() => {
  // month는 1~12이므로, Date 객체에 맞게 0-based 인덱스로 변환
  const year = selectedYear.value;
  const month = selectedMonth.value - 1;

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  const startDay = firstDayOfMonth.getDay();

  const days = [];

  // 이전 달 날짜 채우기
  const prevLastDate = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevLastDate - i),
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // 다음 달 날짜 채우기 (총 35칸)
  const nextDays = 35 - days.length;
  for (let i = 1; i <= nextDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  // 7일씩 끊어 2차원 배열로 변환
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
});
</script>
