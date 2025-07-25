<template>
  <div class="card w-100 mt-5 shadow-sm">
    <div class="card-header bg-white border-0 fw-bold">
      {{ 지원가능갯수 }}개 지원가능 <br />
      <small class="text-muted">2025-07-18일 기준</small>
    </div>
    <ul class="list-group list-group-flush">
      <li
        v-for="item in list"
        :key="item.name"
        class="list-group-item d-flex justify-content-between"
      >
        {{ item.name }}
        <span
          class="badge"
          :class="item.available ? 'bg-success' : 'bg-danger'"
        >
          {{ item.available ? '지원가능' : '지원불가' }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({ list: Array });

const 지원가능갯수 = computed(
  () => props.list.filter((item) => item.available).length
);
</script>

<style scoped>
.card {
  border-radius: 12px;
}
.card-header {
  font-size: 0.95rem;
  padding: 0.75rem 1rem;
}
.list-group-item {
  font-size: 0.9rem;
}
.badge {
  font-size: 0.75rem;
  padding: 0.4em 0.6em;
  border-radius: 0.5rem;
}
</style>
