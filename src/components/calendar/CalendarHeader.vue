<!-- CalendarHeader.vue -->
<template>
  <div class="calendar-header">
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
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import calendarFilterBar from './calendarFilterBar.vue';

const emit = defineEmits(['update:calendar']);

const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);

const years = Array.from({ length: 11 }, (_, i) => 2020 + i);

const calendarGrid = computed(() => {
  const year = selectedYear.value;
  const month = selectedMonth.value - 1;

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDay = firstDay.getDay();

  const days = [];

  // 이전 달 날짜 채우기
  const prevLastDate = new Date(year, month, 0).getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({
      date: new Date(year, month - 1, prevLastDate - i),
      isCurrentMonth: false,
    });
  }

  // 이번 달 날짜 채우기
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // 다음 달 날짜 채우기 (최대 35칸)
  const nextDays = 35 - days.length;
  for (let i = 1; i <= nextDays; i++) {
    days.push({
      date: new Date(year, month + 1, i),
      isCurrentMonth: false,
    });
  }

  const weeks = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }

  return weeks;
});

// selectedYear, selectedMonth 바뀔 때마다 emit
watch(
  [selectedYear, selectedMonth],
  () => {
    const year = selectedYear.value;
    const month = String(selectedMonth.value).padStart(2, '0');
    const yearMonth = `${year}.${month}`;

    emit('update:calendar', calendarGrid.value, yearMonth);
  },
  { immediate: true }
);
</script>
