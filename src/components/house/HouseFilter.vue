<template>
  <div class="filter-section">
    <div class="filter-header">
      <div class="header-content">
        <h2 class="filter-title">
          <i class="bi bi-funnel"></i>
          주택 검색 필터
        </h2>
        <!-- <p class="filter-subtitle">
          원하는 조건을 선택하여 맞춤형 주택을 찾아보세요
        </p> -->
      </div>
      <button
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="clear-button"
        title="모든 필터 초기화"
      >
        <i class="bi bi-arrow-clockwise"></i>
        전체 초기화
      </button>
    </div>

    <div class="filter-grid">
      <!-- 지역 필터 -->
      <div class="filter-item">
        <div class="filter-item-header">
          <label class="filter-label">
            <i class="bi bi-geo-alt"></i>
            지역
          </label>
          <span class="filter-hint">다중 선택 가능</span>
        </div>
        <div class="dropdown-container">
          <button
            class="dropdown-button"
            @click="toggleDropdown('region')"
            type="button"
          >
            <span class="dropdown-text">{{
              getSelectedText('region', '전체 지역')
            }}</span>
            <i
              class="dropdown-icon bi bi-chevron-down"
              :class="{ rotated: isDropdownOpen.region }"
            ></i>
          </button>
          <div v-show="isDropdownOpen.region" class="dropdown-content">
            <div class="dropdown-options">
              <!-- 전체 선택 옵션 -->
              <label
                class="dropdown-option select-all-option"
                :class="{ checked: filters.region.length === 0 }"
                @click="selectAll('region')"
              >
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="filters.region.length === 0"
                  @change="selectAll('region')"
                />
                <span class="option-label">전체 지역</span>
              </label>
              <!-- 구분선 -->
              <div class="dropdown-divider"></div>
              <!-- 개별 지역 옵션들 -->
              <label
                v-for="region in filterOptions.regions"
                :key="region.code"
                class="dropdown-option"
                :class="{ checked: filters.region.includes(region.code) }"
              >
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="filters.region.includes(region.code)"
                  @change="toggleFilter('region', region.code)"
                />
                <span class="option-label">{{ region.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 공고유형 필터 -->
      <div class="filter-item">
        <div class="filter-item-header">
          <label class="filter-label">
            <i class="bi bi-house"></i>
            공고유형
          </label>
          <span class="filter-hint">다중 선택 가능</span>
        </div>
        <div class="dropdown-container">
          <button
            class="dropdown-button"
            @click="toggleDropdown('noticeType')"
            type="button"
          >
            <span class="dropdown-text">{{
              getSelectedText('noticeType', '전체 유형')
            }}</span>
            <i
              class="dropdown-icon bi bi-chevron-down"
              :class="{ rotated: isDropdownOpen.noticeType }"
            ></i>
          </button>
          <div v-show="isDropdownOpen.noticeType" class="dropdown-content">
            <div class="dropdown-options">
              <!-- 전체 선택 옵션 -->
              <label
                class="dropdown-option select-all-option"
                :class="{ checked: filters.noticeType.length === 0 }"
                @click="selectAll('noticeType')"
              >
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="filters.noticeType.length === 0"
                  @change="selectAll('noticeType')"
                />
                <span class="option-label">전체 유형</span>
              </label>
              <!-- 구분선 -->
              <div class="dropdown-divider"></div>
              <!-- 개별 유형 옵션들 -->
              <label
                v-for="type in filterOptions.noticeTypes"
                :key="type.code"
                class="dropdown-option"
                :class="{ checked: filters.noticeType.includes(type.code) }"
              >
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="filters.noticeType.includes(type.code)"
                  @change="toggleFilter('noticeType', type.code)"
                />
                <span class="option-label">{{ type.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 공고상태 필터 -->
      <div class="filter-item">
        <div class="filter-item-header">
          <label class="filter-label">
            <i class="bi bi-info-circle"></i>
            공고상태
          </label>
          <span class="filter-hint">다중 선택 가능</span>
        </div>
        <div class="dropdown-container">
          <button
            class="dropdown-button"
            @click="toggleDropdown('noticeStatus')"
            type="button"
          >
            <span class="dropdown-text">{{
              getSelectedText('noticeStatus', '전체')
            }}</span>
            <i
              class="dropdown-icon bi bi-chevron-down"
              :class="{ rotated: isDropdownOpen.noticeStatus }"
            ></i>
          </button>
          <div v-show="isDropdownOpen.noticeStatus" class="dropdown-content">
            <div class="dropdown-options">
              <!-- 전체 선택 옵션 -->
              <label
                class="dropdown-option select-all-option"
                :class="{ checked: filters.noticeStatus.length === 0 }"
                @click="selectAll('noticeStatus')"
              >
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="filters.noticeStatus.length === 0"
                  @change="selectAll('noticeStatus')"
                />
                <span class="option-label">전체</span>
              </label>
              <!-- 구분선 -->
              <div class="dropdown-divider"></div>
              <!-- 개별 상태 옵션들 -->
              <label
                v-for="status in filterOptions.noticeStatuses"
                :key="status.code"
                class="dropdown-option"
                :class="{ checked: filters.noticeStatus.includes(status.code) }"
              >
                <input
                  type="checkbox"
                  class="checkbox-input"
                  :checked="filters.noticeStatus.includes(status.code)"
                  @change="toggleFilter('noticeStatus', status.code)"
                />
                <span class="option-label">{{ status.name }}</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- 검색 버튼 -->
      <!-- <div class="filter-item search-button-container">
        <button
          @click="search"
          class="search-button"
          :disabled="!hasActiveFilters"
        >
          <i class="bi bi-search"></i>
          <span>검색하기</span>
          <span v-if="totalSelectedFilters > 0" class="filter-count">
            ({{ totalSelectedFilters }})
          </span>
        </button>
      </div> -->
    </div>

    <!-- 활성 필터 태그 -->
    <div v-if="hasActiveFilters" class="active-filters">
      <div class="active-filter-header">
        <span class="active-filter-label">
          <i class="bi bi-tags"></i>
          적용된 필터
        </span>
        <!-- <span class="filter-count-badge">{{ totalSelectedFilters }}개</span> -->
      </div>
      <div class="filter-tags">
        <!-- 지역 태그들 -->
        <span
          v-for="regionCode in filters.region"
          :key="`region-${regionCode}`"
          class="filter-tag region-tag"
          @click="removeFilter('region', regionCode)"
        >
          <i class="bi bi-geo-alt"></i>
          {{ getFilterDisplayName('regions', regionCode) }}
          <i class="bi bi-x remove-tag"></i>
        </span>

        <!-- 공고유형 태그들 -->
        <span
          v-for="typeCode in filters.noticeType"
          :key="`type-${typeCode}`"
          class="filter-tag type-tag"
          @click="removeFilter('noticeType', typeCode)"
        >
          <i class="bi bi-house"></i>
          {{ getFilterDisplayName('noticeTypes', typeCode) }}
          <i class="bi bi-x remove-tag"></i>
        </span>

        <!-- 공고상태 태그들 -->
        <span
          v-for="statusCode in filters.noticeStatus"
          :key="`status-${statusCode}`"
          class="filter-tag status-tag"
          @click="removeFilter('noticeStatus', statusCode)"
        >
          <i class="bi bi-info-circle"></i>
          {{ getFilterDisplayName('noticeStatuses', statusCode) }}
          <i class="bi bi-x remove-tag"></i>
        </span>
      </div>
    </div>

    <!-- 선택된 항목 수 표시 -->
    <!-- <div v-if="hasActiveFilters" class="filter-summary">
      <div class="summary-card">
        <i class="bi bi-funnel-fill"></i>
        <span class="summary-text">
          총 <strong>{{ totalSelectedFilters }}개</strong> 조건으로 검색됩니다
        </span>
      </div>
    </div> -->
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';

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

// Dropdown 상태 관리
const isDropdownOpen = ref({
  region: false,
  noticeType: false,
  noticeStatus: false,
});

// Computed
const hasActiveFilters = computed(() => {
  return (
    props.filters.region?.length > 0 ||
    props.filters.noticeType?.length > 0 ||
    props.filters.noticeStatus?.length > 0
  );
});

const totalSelectedFilters = computed(() => {
  return (
    (props.filters.region?.length || 0) +
    (props.filters.noticeType?.length || 0) +
    (props.filters.noticeStatus?.length || 0)
  );
});

// Methods
const toggleDropdown = (key) => {
  // 다른 드롭다운들 닫기
  Object.keys(isDropdownOpen.value).forEach((dropdownKey) => {
    if (dropdownKey !== key) {
      isDropdownOpen.value[dropdownKey] = false;
    }
  });

  // 현재 드롭다운 토글
  isDropdownOpen.value[key] = !isDropdownOpen.value[key];
};

const closeAllDropdowns = () => {
  Object.keys(isDropdownOpen.value).forEach((key) => {
    isDropdownOpen.value[key] = false;
  });
};

const getSelectedText = (key, defaultText) => {
  const selectedValues = props.filters[key] || [];
  if (selectedValues.length === 0) {
    return defaultText;
  }

  const options =
    props.filterOptions[
      key === 'region'
        ? 'regions'
        : key === 'noticeType'
        ? 'noticeTypes'
        : 'noticeStatuses'
    ] || [];
  const selectedNames = selectedValues.map((code) => {
    const option = options.find((opt) => opt.code === code);
    return option ? option.name : code;
  });

  if (selectedNames.length === 1) {
    return selectedNames[0];
  } else if (selectedNames.length <= 2) {
    return selectedNames.join(', ');
  } else {
    return `${selectedNames[0]} 외 ${selectedNames.length - 1}개`;
  }
};

const handleClickOutside = (event) => {
  const dropdowns = document.querySelectorAll('.dropdown-container');
  let clickedInside = false;

  dropdowns.forEach((dropdown) => {
    if (dropdown.contains(event.target)) {
      clickedInside = true;
    }
  });

  if (!clickedInside) {
    closeAllDropdowns();
  }
};

const toggleFilter = (key, value) => {
  const currentValues = [...(props.filters[key] || [])];
  const index = currentValues.indexOf(value);

  if (index > -1) {
    // 이미 선택된 경우 제거
    currentValues.splice(index, 1);
  } else {
    // 선택되지 않은 경우 추가
    currentValues.push(value);
  }

  emit('update-filter', { key, value: currentValues });

  // 옵션 선택 후 드롭다운 닫기
  isDropdownOpen.value[key] = false;
};

// 전체 선택 메소드
const selectAll = (key) => {
  emit('update-filter', { key, value: [] });

  // 전체 선택 후 드롭다운 닫기
  isDropdownOpen.value[key] = false;
};

// 필터 태그 삭제 전용 메소드 (toggleFilter와 동일하지만 명확성을 위해 분리)
const removeFilter = (key, value) => {
  const currentValues = [...(props.filters[key] || [])];
  const index = currentValues.indexOf(value);

  if (index > -1) {
    currentValues.splice(index, 1);
    emit('update-filter', { key, value: currentValues });
  }
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
  const options = props.filterOptions[optionType] || [];
  const option = options.find((opt) => opt.code === code);
  return option ? option.name : code;
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
/* CSS 변수 정의 */
:root {
  --primary-color: #a6bfa0;
  --primary-hover: #8baa7f;
  --primary-light: #b7c7b7;
  --primary-dark: #7fa87f;
  --secondary-color: #3d6650;
  --text-primary: #234123;
  --text-secondary: #4d6b4d;
  --text-light: #7fa87f;
  --bg-primary: #fffdfa;
  --bg-secondary: #f8faf7;
  --bg-tertiary: #eaf5e6;
  --border-color: #b7c7b7;
  --border-hover: #7fa87f;
  --shadow-sm: 0 1px 2px 0 rgba(166, 191, 160, 0.1);
  --shadow-md: 0 4px 6px -1px rgba(166, 191, 160, 0.15),
    0 2px 4px -1px rgba(166, 191, 160, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(166, 191, 160, 0.2),
    0 4px 6px -2px rgba(166, 191, 160, 0.1);
  --radius-sm: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  --transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 메인 컨테이너 */
.filter-section {
  background: rgba(255, 253, 250, 0.95);
  backdrop-filter: blur(10px);
  /* border-radius: var(--radius-xl); */
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-color);
  transition: var(--transition);
  position: relative;
}

.filter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(166, 191, 160, 0.05) 0%,
    rgba(255, 253, 250, 0.95) 100%
  );
  /* border-radius: var(--radius-xl); */
  border-radius: 16px;
  z-index: -1;
}

.filter-section:hover {
  box-shadow: var(--shadow-lg);
  background: rgba(255, 253, 250, 0.98);
}

/* 헤더 섹션 */
.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  /* margin-bottom: 1.5rem; */
  gap: 1rem;
}

.header-content {
  flex: 1;
}

.filter-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-title i {
  color: var(--primary-color);
  font-size: 1.125rem;
}

.filter-subtitle {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

.clear-button {
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  /* padding: 0.5rem 0.75rem; */
  border-radius: var(--radius-md);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  /* gap: 0.375rem; */
  white-space: nowrap;
}

.clear-button:hover {
  background: var(--border-hover);
  color: var(--text-primary);
  transform: translateY(-1px);
}

.clear-button i {
  font-size: 0.8125rem;
}

/* 필터 그리드 */
.filter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  align-items: start;
}

/* 필터 아이템 */
.filter-item {
  display: flex;
  flex-direction: column;
  background: var(--bg-secondary);
  border-radius: 20px;
  padding: 1rem;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.filter-item:hover {
  border-color: var(--border-hover);
  box-shadow: var(--shadow-sm);
}

.filter-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.filter-label {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin: 0;
}

.filter-label i {
  color: var(--primary-color);
  font-size: 0.875rem;
}

.filter-hint {
  font-size: 0.6875rem;
  color: var(--text-light);
  background: var(--bg-tertiary);
  padding: 0.1875rem 0.375rem;
  border-radius: var(--radius-sm);
}

/* 드롭다운 컨테이너 */
.dropdown-container {
  position: relative;
  width: 100%;
}

.dropdown-button {
  background: var(--bg-primary);
  border: 2px solid var(--border-color);
  border-radius: 16px;
  padding: 0.625rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.375rem;
  width: 100%;
  text-align: left;
  /* box-shadow: var(--shadow-sm); */
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(166, 191, 160, 0.2);
}

.dropdown-button:hover {
  background: var(--bg-tertiary);
  border-color: var(--border-hover);
  border-width: 2px;
  /* box-shadow: var(--shadow-md); */
}

.dropdown-button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(166, 191, 160, 0.2);
}

.dropdown-text {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-primary);
}

.dropdown-icon {
  transition: transform 0.3s ease;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.dropdown-button.rotated .dropdown-icon {
  transform: rotate(180deg);
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #ffffff;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 10;
  max-height: 200px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  margin-top: 0.25rem;
}

.dropdown-content::-webkit-scrollbar {
  width: 4px;
}

.dropdown-content::-webkit-scrollbar-track {
  background: transparent;
}

.dropdown-content::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.dropdown-content::-webkit-scrollbar-thumb:hover {
  background: var(--border-hover);
}

.dropdown-options {
  padding: 0.625rem;
}

.dropdown-option {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition);
  user-select: none;
  border: 2px solid transparent;
  background: #ffffff;
}

.dropdown-option:hover {
  background: #f0f0f0;
  border-color: #b7c7b7;
}

.dropdown-option.checked {
  background: #e0e0e0;
  /* border-color: #7fa87f; */
  color: var(--text-primary);
  font-weight: 600;
  /* box-shadow: 0 2px 4px rgba(166, 191, 160, 0.2); */
}

.dropdown-option.checked:hover {
  background: #d0d0d0;
  border-color: #7fa87f;
}

.dropdown-option.checked .option-label {
  color: var(--text-primary);
  font-weight: 600;
}

/* 전체 선택 옵션 스타일 */
.select-all-option {
  background: var(--bg-tertiary) !important;
  font-weight: 600;
}

.select-all-option:hover {
  background: var(--border-hover) !important;
}

.select-all-option.checked {
  background: var(--primary-color) !important;
  color: white !important;
}

.select-all-option.checked:hover {
  background: var(--primary-hover) !important;
}

.select-all-option.checked .option-label {
  color: white !important;
}

/* 구분선 */
.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
  opacity: 0.5;
}

.option-label {
  font-size: 0.8125rem;
  color: var(--text-primary);
  cursor: pointer;
  flex: 1;
  transition: var(--transition);
}

.checkbox-input {
  display: none; /* Hide default checkbox */
}

/* 사용하지 않는 custom-checkbox 스타일 제거됨 */

/* 검색 버튼 */
.search-button-container {
  display: flex;
  align-items: end;
}

.search-button {
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 0.625rem 1rem;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: auto;
  min-width: 120px;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.search-button:hover:not(:disabled) {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.search-button:disabled {
  background: var(--bg-tertiary);
  color: var(--text-light);
  cursor: not-allowed;
  transform: none;
}

.search-button i {
  font-size: 0.8125rem;
}

.filter-count {
  font-size: 0.75rem;
  opacity: 0.9;
}

/* 활성 필터 섹션 */
.active-filters {
  margin-top: 1rem;
  /* padding-top: 1rem; */
  border-top: 1px solid var(--border-color);
  padding-left: 1rem;
}

.active-filter-header {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 0.5rem;
}

.active-filter-label {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-weight: 500;
}

.active-filter-label i {
  color: var(--primary-color);
}

.filter-count-badge {
  background: var(--primary-color);
  color: white;
  padding: 0.1875rem 0.375rem;
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 600;
}

/* 필터 태그 */
.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.filter-tag {
  background: var(--primary-color);
  color: white;
  padding: 0.375rem 0.625rem;
  border-radius: 16px;
  font-size: 0.6875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.25rem;
  border: none;
  user-select: none;
}

.filter-tag:hover {
  background: var(--primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.filter-tag.region-tag {
  background: #7fa87f;
}

.filter-tag.region-tag:hover {
  background: #6b8f6b;
}

.filter-tag.type-tag {
  background: #8baa7f;
}

.filter-tag.type-tag:hover {
  background: #7a9a6e;
}

.filter-tag.status-tag {
  background: #9bbf8f;
}

.filter-tag.status-tag:hover {
  background: #8aae7e;
}

.filter-tag i {
  font-size: 0.6875rem;
}

.remove-tag {
  font-size: 0.8125rem;
  font-weight: bold;
  margin-left: 0.1875rem;
}

/* 필터 요약 */
.filter-summary {
  margin-top: 0.75rem;
}

.summary-card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.625rem;
  justify-content: center;
}

.summary-card i {
  color: var(--primary-color);
  font-size: 1rem;
}

.summary-text {
  font-size: 0.8125rem;
  color: var(--text-secondary);
  text-align: center;
}

.summary-text strong {
  color: var(--primary-color);
  font-weight: 600;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .filter-section {
    padding: 1.25rem;
  }

  .filter-grid {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 0.875rem;
  }

  .filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.875rem;
  }

  .clear-button {
    align-self: flex-end;
  }
}

@media (max-width: 768px) {
  .filter-section {
    padding: 1rem;
    margin-bottom: 1rem;
  }

  .filter-grid {
    grid-template-columns: 1fr;
    gap: 0.875rem;
  }

  .filter-title {
    font-size: 1.125rem;
  }

  .dropdown-content {
    max-height: 160px;
  }

  .filter-tags {
    justify-content: center;
  }

  .active-filter-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.375rem;
  }

  .filter-count-badge {
    align-self: flex-start;
  }

  .search-button {
    padding: 0.5rem 0.875rem;
    font-size: 0.75rem;
    min-width: 100px;
  }
}

@media (max-width: 480px) {
  .filter-section {
    padding: 0.75rem;
    border-radius: var(--radius-lg);
  }

  .filter-title {
    font-size: 1rem;
  }

  .filter-subtitle {
    font-size: 0.75rem;
  }

  .filter-item {
    padding: 0.875rem;
  }

  .search-button {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
    min-width: 90px;
  }

  .filter-tag {
    font-size: 0.625rem;
    padding: 0.3125rem 0.5rem;
  }

  .summary-card {
    padding: 0.625rem;
  }

  .summary-text {
    font-size: 0.75rem;
  }
}

/* 다크 모드 지원 (선택적) */
@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #2d2d2d;
    --bg-tertiary: #3a3a3a;
    --text-primary: #ffffff;
    --text-secondary: #a0a0a0;
    --text-light: #666666;
    --border-color: #404040;
    --border-hover: #505050;
  }
  .dropdown-content {
    background: #2d2d2d;
  }

  .dropdown-option {
    background: #2d2d2d;
  }

  .dropdown-option:hover {
    background: #404040;
  }

  .dropdown-option.checked {
    background: #505050;
  }

  .dropdown-option.checked:hover {
    background: #606060;
  }
}

/* 접근성 개선 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}

/* 포커스 스타일 */
.search-button:focus-visible,
.clear-button:focus-visible,
.filter-tag:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
</style>
