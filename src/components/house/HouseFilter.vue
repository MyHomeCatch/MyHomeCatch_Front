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
        <label class="filter-label">지역</label>
        <select
          :value="filters.region"
          @change="updateFilter('region', $event.target.value)"
          class="filter-select"
        >
          <option value="">전체 지역</option>
          <option
            v-for="region in filterOptions.regions"
            :key="region.code"
            :value="region.code"
          >
            {{ region.name }}
          </option>
        </select>
      </div>

      <!-- 공고유형 필터 -->
      <div class="filter-item">
        <label class="filter-label">공고유형</label>
        <select
          :value="filters.noticeType"
          @change="updateFilter('noticeType', $event.target.value)"
          class="filter-select"
        >
          <option value="">전체 유형</option>
          <option
            v-for="type in filterOptions.noticeTypes"
            :key="type.code"
            :value="type.code"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- 공고상태 필터 -->
      <div class="filter-item">
        <label class="filter-label">공고상태</label>
        <select
          :value="filters.noticeStatus"
          @change="updateFilter('noticeStatus', $event.target.value)"
          class="filter-select"
        >
          <option value="">전체 상태</option>
          <option
            v-for="status in filterOptions.noticeStatuses"
            :key="status.code"
            :value="status.code"
          >
            {{ status.name }}
          </option>
        </select>
      </div>

      <!-- 검색 버튼 -->
      <div class="filter-item">
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
        <span
          v-if="filters.region"
          class="filter-tag"
          @click="clearFilter('region')"
        >
          지역: {{ getFilterDisplayName('regions', filters.region) }}
          <span class="remove-tag">×</span>
        </span>
        <span
          v-if="filters.noticeType"
          class="filter-tag"
          @click="clearFilter('noticeType')"
        >
          유형: {{ getFilterDisplayName('noticeTypes', filters.noticeType) }}
          <span class="remove-tag">×</span>
        </span>
        <span
          v-if="filters.noticeStatus"
          class="filter-tag"
          @click="clearFilter('noticeStatus')"
        >
          상태:
          {{ getFilterDisplayName('noticeStatuses', filters.noticeStatus) }}
          <span class="remove-tag">×</span>
        </span>
      </div>
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
    props.filters.region ||
    props.filters.noticeType ||
    props.filters.noticeStatus
  );
});

// Methods
const updateFilter = (key, value) => {
  emit('update-filter', { key, value });
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
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  align-items: end;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #222222;
  margin-bottom: 8px;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #ff385c;
}

.search-button {
  background: #ff385c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-button:hover {
  background: #e31c5f;
  transform: translateY(-1px);
}

.active-filters {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #e0e0e0;
}

.active-filter-label {
  font-size: 14px;
  color: #717171;
  margin-right: 12px;
}

.filter-tags {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  background: #ff385c;
  color: white;
  padding: 6px 12px;
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
}

.remove-tag {
  font-size: 16px;
  font-weight: bold;
}

@media (max-width: 768px) {
  .filter-section {
    padding: 16px;
  }

  .filter-grid {
    grid-template-columns: 1fr;
  }
}
</style>
