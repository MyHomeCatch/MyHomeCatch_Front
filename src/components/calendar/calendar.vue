<template>
  <div class="calendar">
    <calendar-header
      @update:calendar="onCalendarUpdate"
      @update:filters="onFilterUpdate"
    />

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

              <div v-if="day.events && day.events.length" class="cal-events">
                <div
                  class="cal-event"
                  v-for="event in day.events.slice(0, 5)"
                  :key="event.danzi_id"
                  :style="getEventStyle(event.noticeTypeCode)"
                >
                  <span class="dot"></span>
                  <span class="event-text">{{ event.danziName }}</span>
                </div>
                <span class="cal-all-btn" @click="openModal(day.events, day)">
                  전체 보기
                </span>
                <DailyModal
                  v-if="showModal"
                  :events="selectedEvents"
                  :title="`${selectedDate} 모집 중인 청약`"
                  @close="showModal = false"
                />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import calendarHeader from './calendarHeader.vue';
import './calendar.css';
import api from '@/api/calendarApi.js';
import DailyModal from './DailyModal.vue'; // 모달 컴포넌트
import { calendarColorMap } from '@/assets/calendarColorMap.js'; // 코드-색상-라벨 매핑

// 모달 상태
const showModal = ref(false);
const selectedEvents = ref([]);
const selectedDate = ref('');

// 주간 요일
const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

// 캘린더 상태
const calendarGrid = ref([]);
const selectedYearMonth = ref('');
const dailyEvents = ref([]);
const totalCount = ref(0); // 전체 건수 저장용

// 필터 상태
const filters = ref({
  type: [],
  region: [],
});

// 날짜를 'YYYY-MM-DD' 형식 문자열로 변환
function formatDateKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// 이벤트를 날짜별로 매핑
function matchEventsToCalendar(grid, events) {
  const grouped = groupEventsByDate(events);

  return grid.map((week) =>
    week.map((day) => {
      const key = formatDateKey(day.date);
      return {
        ...day,
        events: grouped[key] || [],
      };
    })
  );
}

// 날짜 기준으로 이벤트를 그룹화
function groupEventsByDate(events) {
  const map = {};

  events.forEach((item) => {
    if (!item.startDate) return;

    const dateKey = item.startDate.split(' ')[0]; // '2025-08-05 00:00:00' 형식

    if (!map[dateKey]) {
      map[dateKey] = [];
    }

    const exists = map[dateKey].some((e) => e.danzi_id === item.danzi_id);
    if (!exists) {
      map[dateKey].push({
        danzi_id: item.danzi_id,
        danziName: item.danziName,
        address: item.address,
        noticeTypeCode: item.noticeTypeCode,
        noticeTypeName: item.noticeTypeName,
        startDate: item.startDate,
        endDate: item.endDate,
        region: item.region,
        typeOption: item.typeOption,
      });
    }
  });

  return map;
}

// 유형 별 색상 설정
const getEventStyle = (code) => {
  const color = calendarColorMap[code]?.color || '#86A788'; // 기본색
  return {
    border: `1.7px solid ${color}`,
    '--dot-color': color,
  };
};

// 날짜 클릭 시 모달 오픈
function openModal(events, dateObj) {
  selectedEvents.value = events;
  selectedDate.value = dateObj.date.toISOString().split('T')[0];
  showModal.value = true;
}

// 필터가 비어있으면 무조건 true (전체 허용)
function filterCheck(array) {
  return array.length === 0;
}

// 필터 적용된 이벤트 목록 계산
const filteredEvents = computed(() => {
  return dailyEvents.value.filter((event) => {
    const { type, region } = filters.value;

    // 필터 선택 없으면 모두 true
    const typeMatch = filterCheck(type) || type.includes(event.noticeTypeCode);
    const regionMatch =
      filterCheck(region) ||
      region.includes('전체') ||
      region.includes(event.region);

    return typeMatch && regionMatch;
  });
});

// 캘린더 헤더에서 날짜 갱신 시 호출됨
async function onCalendarUpdate(grid, yearMonth) {
  selectedYearMonth.value = yearMonth;
  calendarGrid.value = grid;

  try {
    const { dataList, totalCount: count } = await api.getCalendar(yearMonth);
    dailyEvents.value = dataList;
    totalCount.value = count;
    calendarGrid.value = matchEventsToCalendar(grid, filteredEvents.value);
  } catch (error) {
    console.error('달력 API 오류:', error);
  }
}

// 필터 변경 이벤트 처리
function onFilterUpdate(newFilters) {
  filters.value = newFilters;
  calendarGrid.value = matchEventsToCalendar(
    calendarGrid.value,
    filteredEvents.value
  );
}

// 필터 변경시 캘린더 다시 매핑
watch(
  filters,
  () => {
    calendarGrid.value = matchEventsToCalendar(
      calendarGrid.value,
      filteredEvents.value
    );
  },
  { deep: true }
);
</script>
