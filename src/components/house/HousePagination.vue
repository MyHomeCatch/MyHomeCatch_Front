<template>
  <div v-if="pageInfo.totalPages > 1" class="pagination">
    <button
      @click="changePage(pageInfo.currentPage - 1)"
      :disabled="!pageInfo.hasPrevious"
      class="page-button"
    >
      이전
    </button>

    <div class="page-numbers">
      <button
        v-for="page in getPageNumbers()"
        :key="page"
        @click="changePage(page - 1)"
        :class="['page-number', { active: page - 1 === pageInfo.currentPage }]"
      >
        {{ page }}
      </button>
    </div>

    <button
      @click="changePage(pageInfo.currentPage + 1)"
      :disabled="!pageInfo.hasNext"
      class="page-button"
    >
      다음
    </button>
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  pageInfo: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(['page-change']);

// Methods
const changePage = (newPage) => {
  if (newPage >= 0 && newPage < props.pageInfo.totalPages) {
    emit('page-change', newPage);
  }
};

const getPageNumbers = () => {
  const current = props.pageInfo.currentPage;
  const total = props.pageInfo.totalPages;
  const pages = [];

  let start = Math.max(0, current - 2);
  let end = Math.min(total - 1, current + 2);

  if (end - start < 4) {
    if (start === 0) {
      end = Math.min(total - 1, start + 4);
    } else {
      start = Math.max(0, end - 4);
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i + 1);
  }

  return pages;
};
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 48px;
}

.page-button {
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-button:not(:disabled):hover {
  background: #f8f9fa;
  border-color: #d0d0d0;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  width: 40px;
  height: 40px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: #f8f9fa;
  border-color: #d0d0d0;
}

.page-number.active {
  background: #ff385c;
  color: white;
  border-color: #ff385c;
}

@media (max-width: 768px) {
  .pagination {
    margin-top: 32px;
  }

  .page-numbers {
    flex-wrap: wrap;
  }
}
</style>
