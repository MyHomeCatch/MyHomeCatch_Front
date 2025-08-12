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
  padding: 20px;
}

.page-button {
  padding: 10px 18px;
  border: 2px solid #b7c7b7;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #4d6b4d;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(166, 191, 160, 0.1);
}

.page-button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  background: #f8faf7;
  color: #7fa87f;
  box-shadow: none;
}

.page-button:not(:disabled):hover {
  background: #eaf5e6;
  border-color: #a6bfa0;
  color: #234123;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(166, 191, 160, 0.2);
}

.page-button:not(:disabled):active {
  transform: translateY(0);
}

.page-numbers {
  display: flex;
  gap: 6px;
}

.page-number {
  width: 42px;
  height: 42px;
  border: 2px solid #b7c7b7;
  background: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #4d6b4d;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(166, 191, 160, 0.1);
}

.page-number:hover {
  background: #eaf5e6;
  border-color: #a6bfa0;
  color: #234123;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(166, 191, 160, 0.2);
}

.page-number.active {
  background: linear-gradient(135deg, #a6bfa0 0%, #8baa7f 100%);
  color: white;
  border-color: #7fa87f;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(166, 191, 160, 0.3);
}

.page-number.active:hover {
  background: linear-gradient(135deg, #8baa7f 0%, #7fa87f 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(166, 191, 160, 0.4);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .pagination {
    margin-top: 40px;
    padding: 16px;
  }

  .page-button {
    padding: 8px 16px;
    font-size: 13px;
  }

  .page-number {
    width: 38px;
    height: 38px;
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .pagination {
    margin-top: 32px;
    padding: 14px;
    gap: 6px;
  }

  .page-numbers {
    flex-wrap: wrap;
    gap: 4px;
  }

  .page-button {
    padding: 8px 14px;
    font-size: 12px;
  }

  .page-number {
    width: 36px;
    height: 36px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .pagination {
    margin-top: 24px;
    padding: 12px;
    gap: 4px;
    border-radius: 12px;
  }

  .page-button {
    padding: 6px 12px;
    font-size: 11px;
    border-radius: 8px;
  }

  .page-number {
    width: 32px;
    height: 32px;
    font-size: 11px;
    border-radius: 8px;
  }
}
</style>
