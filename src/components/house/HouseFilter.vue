<template>
  <div class="filter-section">
    <div class="filter-header">
      <h2 class="filter-title">주택 검색</h2>
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="clear-button"
      >
        전체 초기화
      </button>
    </div>

    <div class="filter-grid">
      <!-- 지역 필터 -->
      <div class="filter-item">
        <label class="filter-label">지역 (다중 선택 가능)</label>
        <div class="checkbox-group">
          <label
            v-for="region in filterOptions.regions"
            :key="region.code"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="region.code"
              :checked="filters.region.includes(region.code)"
              @change="toggleFilter('region', region.code)"
              class="checkbox-input"
            />
            <span class="checkbox-label">{{ region.name }}</span>
          </label>
        </div>
      </div>

      <!-- 공고유형 필터 -->
      <div class="filter-item">
        <label class="filter-label">공고유형 (다중 선택 가능)</label>
        <div class="checkbox-group">
          <label
            v-for="type in filterOptions.noticeTypes"
            :key="type.code"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="type.code"
              :checked="filters.noticeType.includes(type.code)"
              @change="toggleFilter('noticeType', type.code)"
              class="checkbox-input"
            />
            <span class="checkbox-label">{{ type.name }}</span>
          </label>
        </div>
      </div>

      <!-- 공고상태 필터 -->
      <div class="filter-item">
        <label class="filter-label">공고상태 (다중 선택 가능)</label>
        <div class="checkbox-group">
          <label
            v-for="status in filterOptions.noticeStatuses"
            :key="status.code"
            class="checkbox-item"
          >
            <input
              type="checkbox"
              :value="status.code"
              :checked="filters.noticeStatus.includes(status.code)"
              @change="toggleFilter('noticeStatus', status.code)"
              class="checkbox-input"
            />
            <span class="checkbox-label">{{ status.name }}</span>
          </label>
        </div>
      </div>

      <!-- 검색 버튼 -->
      <div class="filter-item search-button-container">
        <button @click="search" class="search-button">
          <span>🔍</span>
          검색
        </button>
      </div>
    </div>

    <!-- 활성 필터 태그 -->
    <div v-if="hasActiveFilters" class="active-filters">
      <span class="active-filter-label">적용된 필터:</span>
      <div class="filter-tags">
        <!-- 지역 태그들 -->
        <span
          v-for="regionCode in filters.region"
          :key="`region-${regionCode}`"
          class="filter-tag"
          @click="toggleFilter('region', regionCode)"
        >
          지역: {{ getFilterDisplayName('regions', regionCode) }}
          <span class="remove-tag">×</span>
        </span>

        <!-- 공고유형 태그들 -->
        <span
          v-for="typeCode in filters.noticeType"
          :key="`type-${typeCode}`"
          class="filter-tag"
          @click="toggleFilter('noticeType', typeCode)"
        >
          유형: {{ getFilterDisplayName('noticeTypes', typeCode) }}
          <span class="remove-tag">×</span>
        </span>

        <!-- 공고상태 태그들 -->
        <span
          v-for="statusCode in filters.noticeStatus"
          :key="`status-${statusCode}`"
          class="filter-tag"
          @click="toggleFilter('noticeStatus', statusCode)"
        >
          상태: {{ getFilterDisplayName('noticeStatuses', statusCode) }}
          <span class="remove-tag">×</span>
        </span>
      </div>
    </div>

    <!-- 선택된 항목 수 표시 -->
    <div v-if="hasActiveFilters" class="filter-summary">
      <span class="summary-text">
        총 {{ totalSelectedFilters }}개 조건으로 검색
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

// Props
const props = defineProps({
  filters: {
    type: Object,
    required: true,
    // 예상 구조: { region: [], noticeType: [], noticeStatus: [] }
  },
  filterOptions: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits([
  'update-filter',
  'clear-filter',
  'clear-all',
  'search',
]);

// Computed
const hasActiveFilters = computed(() => {
  return (
    props.filters.region.length > 0 ||
    props.filters.noticeType.length > 0 ||
    props.filters.noticeStatus.length > 0
  );
});

const totalSelectedFilters = computed(() => {
  return (
    props.filters.region.length +
    props.filters.noticeType.length +
    props.filters.noticeStatus.length
  );
});

// Methods
const toggleFilter = (key, value) => {
  const currentValues = [...props.filters[key]];
  const index = currentValues.indexOf(value);

  if (index > -1) {
    // 이미 선택된 경우 제거
    currentValues.splice(index, 1);
  } else {
    // 선택되지 않은 경우 추가
    currentValues.push(value);
  }

  emit('update-filter', { key, value: currentValues });
};

const clearFilter = (key) => {
  emit('clear-filter', key);
};

const clearAllFilters = () => {
  emit('clear-all');
};

const search = () => {
  emit('search');
};

const getFilterDisplayName = (optionType, code) => {
  const options = props.filterOptions[optionType];
  const option = options.find((opt) => opt.code === code);
  return option ? option.name : code;
};
</script>

<style scoped>
.filter-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 20px;
  font-weight: 600;
  color: #222222;
  margin: 0;
}

.clear-button {
  background: #f0f0f0;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  color: #717171;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #e0e0e0;
  color: #222222;
}

.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  align-items: start;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #222222;
  margin-bottom: 12px;
}

.checkbox-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 200px;
  overflow-y: auto;
  padding: 8px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.checkbox-item:hover {
  background: #f0f0f0;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #ff385c;
}

.checkbox-label {
  font-size: 14px;
  color: #222222;
  cursor: pointer;
  user-select: none;
}

.search-button-container {
  display: flex;
  align-items: end;
}

.search-button {
  background: #ff385c;
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  justify-content: center;
}

.search-button:hover {
  background: #e31c5f;
  transform: translateY(-1px);
}

.active-filters {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.active-filter-label {
  font-size: 14px;
  color: #717171;
  margin-right: 12px;
  display: block;
  margin-bottom: 8px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background: #ff385c;
  color: white;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tag:hover {
  background: #e31c5f;
  transform: scale(1.05);
}

.remove-tag {
  font-size: 16px;
  font-weight: bold;
}

.filter-summary {
  margin-top: 12px;
  text-align: center;
}

.summary-text {
  font-size: 14px;
  color: #717171;
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  display: inline-block;
}

@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .checkbox-group {
    max-height: 150px;
  }

  .filter-tags {
    justify-content: center;
  }
}
</style>
