<template>
  <router-link
    :to="`/subscription/${item.id}`"
    class="text-decoration-none text-dark"
  >
    <div
      class="subscription-card position-relative"
      :class="{ closed: item.status === 'closed' }"
    >
      <!-- 상태 뱃지 -->
      <span
        v-if="item.status === 'upcoming'"
        class="badge bg-secondary position-absolute top-0 start-0 m-2"
      >
        예정
      </span>
      <span
        v-else-if="item.status === 'active'"
        class="badge bg-success position-absolute top-0 start-0 m-2"
      >
        진행중
      </span>
      <span
        v-else-if="item.status === 'closed'"
        class="badge bg-dark position-absolute top-0 start-0 m-2"
      >
        마감
      </span>

      <img :src="item.image" class="card-img-top" alt="공고 이미지" />

      <div class="card-body px-3 py-2">
        <h6 class="fw-bold mb-1 text-truncate">
          {{ item.title }}
        </h6>
        <p class="text-muted small text-truncate">
          {{ item.desc }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({ item: Object });
</script>

<style scoped>
.subscription-card {
  width: 180px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  border: none; /* ✅ 테두리 제거 */
}

.subscription-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
}

/* 마감 카드 스타일 */
.subscription-card.closed {
  background-color: #f0f0f0;
  color: #999;
  filter: grayscale(0.9);
  pointer-events: none;
}

/* 이미지 스타일 */
.card-img-top {
  height: 120px;
  object-fit: contain;
  background-color: white;
  padding: 16px;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
}
</style>
