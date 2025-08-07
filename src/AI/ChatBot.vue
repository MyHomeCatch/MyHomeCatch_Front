<template>
  <div>
    <!-- Chatbot 버튼 (오른쪽 아래 고정) -->
    <button class="chatbot-button" @click="isOpen = !isOpen">💬</button>

    <!-- Chatbot 모달 -->
    <div v-if="isOpen" class="chatbot-modal">
      <div class="chatbot-header">
        <span>MHC 챗봇</span>
        <button @click="isOpen = false">✖</button>
      </div>

      <div class="chatbot-body">
        <div
          v-for="(msg, idx) in messages"
          :key="idx"
          :class="[
            'message',
            msg.sender === 'User' ? 'user-message' : 'bot-message',
          ]"
        >
          {{ msg.text }}
        </div>
      </div>

      <div class="chatbot-input">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          placeholder="메시지를 입력하세요"
        />
        <button @click="sendMessage">전송</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const isOpen = ref(false);
const userInput = ref('');
const messages = ref([]);

const sendMessage = async () => {
  if (!userInput.value.trim()) return;

  const userMsg = userInput.value;
  messages.value.push({ sender: 'User', text: userMsg });
  userInput.value = '';

  try {
    const res = await axios.post('/api/chat', { message: userMsg });
    messages.value.push({ sender: 'Gemini', text: res.data.reply });
  } catch (e) {
    messages.value.push({ sender: 'Gemini', text: '에러가 발생했습니다.' });
  }
};
</script>

<style scoped>
.chatbot-button {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 60px;
  height: 60px;
  background-color: rgba(134, 167, 136, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: background-color 0.2s ease;
}

.chatbot-button:hover {
  background-color: rgba(95, 126, 97, 0.8);
}

.chatbot-modal {
  position: fixed;
  bottom: 100px;
  right: 24px;
  width: 320px;
  height: 500px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.chatbot-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(134, 167, 136, 0.8);
  color: white;
  font-weight: bold;
}

.chatbot-header button {
  background: none;
  border: none;
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.chatbot-body {
  flex: 1;
  padding: 16px;
  font-size: 14px;
  color: #333;
  overflow-y: auto;
}

.chatbot-input {
  display: flex;
  border-top: 1px solid #ddd;
  padding: 10px;
  gap: 8px;
}

.chatbot-input input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.chatbot-input button {
  background-color: rgba(134, 167, 136, 0.8);
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.message {
  margin-bottom: 8px;
  max-width: 70%;
  padding: 8px 12px;
  border-radius: 12px;
  word-wrap: break-word;
  display: inline-block;
}

/* 사용자 메시지 (오른쪽 정렬, 배경색 연한 초록색) */
.user-message {
  background-color: #daf8cb;
  color: #2d572c;
  align-self: flex-end;
  text-align: right;
  margin-left: auto;
  border-bottom-right-radius: 0;
}

/* 봇 메시지 (왼쪽 정렬, 회색 배경) */
.bot-message {
  background-color: #f1f0f0;
  color: #333;
  align-self: flex-start;
  text-align: left;
  margin-right: auto;
  border-bottom-left-radius: 0;
}

.chatbot-body {
  flex: 1;
  padding: 16px;
  font-size: 14px;
  color: #333;
  overflow-y: auto;

  display: flex;
  flex-direction: column;
}
</style>
