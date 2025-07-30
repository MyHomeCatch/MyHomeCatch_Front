<template>
  <div>
    <h2 class="text-xl font-bold mb-4">단지별 소통게시판</h2>
    <div class="space-y-3">
      <div
        v-for="i in 3"
        :key="i"
        class="bg-green-100 p-4 rounded-lg flex justify-between items-start"
      >
        <div>
          <div class="font-semibold text-sm text-green-800">펌로봇사</div>
          <div class="text-xs text-gray-600 mb-1">2025년 7월 21일</div>
          <p class="text-sm text-gray-800">
            분양권리에 대한 감상평 입지에 대한 평가 시행사에 대한 평가 평가
            분양가격에 대한 평가 등 등등등등
          </p>
        </div>
        <button class="text-xs text-gray-500 hover:text-red-500">삭제</button>
      </div>
    </div>
  </div>
</template>

<script setup></script>
