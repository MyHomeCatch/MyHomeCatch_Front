<template>
  <HorizontalCardScroller
    :title="'지원 가능한 맞춤공고'"
    :cards="houses"
    :loading="loading"
    :key-field="'houseId'"
    :favorite-list="favoriteList"
    :empty-config="emptyConfig"
    @card-click="$emit('card-click', $event)"
    @toggle-favorite="$emit('toggle-favorite', $event)"
    @empty-action="$emit('refresh')"
  />
</template>

<script setup>
import HorizontalCardScroller from './HorizontalCardScroller.vue';

// Props
const props = defineProps({
  houses: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  recommendationQuery: {
    type: Object,
    default: () => ({}),
  },
  favoriteList: {
    type: Array,
    default: () => [],
  },
});

// Emits
const emit = defineEmits(['card-click', 'toggle-favorite', 'refresh']);

// Empty state 설정
const emptyConfig = {
  icon: '🔍',
  title: '추천할 주택이 없습니다',
  description:
    '현재 회원님의 조건에 맞는 주택이 없어요.<br />조건을 조정하시거나 나중에 다시 확인해보세요.',
  showButton: true,
  buttonText: '다시 찾아보기',
};
</script>
