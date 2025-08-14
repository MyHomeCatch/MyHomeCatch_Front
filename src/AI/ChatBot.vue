<template>
  <div>
    <!-- 챗봇 버튼 -->

    <button class="chatbot-button" @click="isOpen = !isOpen">
      <img src="../assets/images/chatbot.png" alt="챗봇 로고 이미지" />
    </button>

    <!-- 챗봇 모달 -->
    <div
      v-if="isOpen"
      class="chatbot-modal"
      :style="{ width: modalWidth + 'px', height: modalHeight + 'px' }"
    >
      <div class="chatbot-header">
        <span>MHC 챗봇</span>
        <button @click="isOpen = false">✖</button>
      </div>

      <div class="chatbot-body" ref="chatBody">
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

      <div
        v-if="
          isOpen &&
          (!isGuide8Active ||
            (messages.length === 1 && messages[0].sender === 'Bot'))
        "
        class="quick-reply-buttons"
      >
        <button
          v-for="(reply, index) in quickReplies"
          :key="index"
          @click="sendQuickReply(reply.value)"
          class="quick-reply-button"
        >
          {{ reply.label }}
        </button>
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
import { ref, nextTick, watch, onMounted } from 'vue';

import axios from 'axios';

const isOpen = ref(false);
const userInput = ref('');
const messages = ref([]);
const chatBody = ref(null);
const isGuide8Active = ref(false);

const modalWidth = ref(320); // Initial width
const modalHeight = ref(500); // Initial height

const quickReplies = ref([
  { label: '자주 묻는 질문', value: '자주 묻는 질문' },
  { label: '인기 공고 추천', value: '인기 공고 추천' },
  { label: '최신 공고 추천', value: '최신 공고 추천' },
]);

const guide8Faqs = [
  {
    id: 1,
    question: 'Q. 청약 신청은 어디서 하나요?',
    answer:
      'A. 대부분의 청약은 청약홈에서 온라인으로 신청할 수 있습니다. 공공임대, 도시개발 관련 청약은 LH, SH 등 해당 기관 사이트에서 진행됩니다.',
  },
  {
    id: 2,
    question: 'Q. 청약통장이 꼭 있어야 하나요?',
    answer:
      'A. 네. 대부분의 일반/특별공급 청약은 주택청약종합저축 등 청약통장이 필수입니다. 단, 일부 임대주택의 경우 청약통장이 없어도 가능합니다.',
  },
  {
    id: 3,
    question: 'Q. 무주택이어야만 청약이 가능한가요?',
    answer:
      'A. 무주택자가 우선되지만, 일부 유형(추첨제, 일부 임대청약 등)은 유주택자도 가능할 수 있습니다. 단, 당첨 가능성이 매우 낮습니다.',
  },
  {
    id: 4,
    question: 'Q. 청약 가점은 어떻게 계산되나요?',
    answer:
      'A. 가점제는 무주택 기간 + 부양가족 수 + 청약통장 가입기간으로 총 84점 만점입니다. 청약홈에서 자동 계산기 서비스를 이용할 수 있어요.',
  },
  {
    id: 5,
    question: 'Q. 청약통장에 돈은 얼마나 넣어야 하나요?',
    answer:
      'A. 민영주택의 경우 면적에 따라 최대 1,500만 원까지 인정됩니다. 다달이 10만 원 이상 넣는 것이 일반적이며, 지역에 따라 최소 납입금도 다릅니다.',
  },
  {
    id: 6,
    question: 'Q. 1순위 조건은 어떻게 되나요?',
    answer:
      'A. 기본적으로 청약통장 가입기간 2년 이상 + 지역·주택유형별 납입 조건 충족 + 무주택 요건을 만족해야 1순위가 됩니다.',
  },
  {
    id: 7,
    question: 'Q. 1인 가구도 청약이 가능한가요?',
    answer:
      'A. 가능합니다. 다만 가점에서 부양가족 수가 적어 불리할 수 있습니다. 생애최초나 추첨제 청약을 노리는 것이 좋습니다.',
  },
  {
    id: 8,
    question: 'Q. 당첨되면 자동으로 계약이 되나요?',
    answer:
      'A. 아닙니다. 당첨 후 별도로 분양계약을 체결해야 하며, 일정 내 서류 제출과 계약금 납입도 필요합니다.',
  },
  {
    id: 9,
    question: 'Q. 청약을 여러 곳 동시에 신청할 수 있나요?',
    answer:
      'A. 동일 기간 내 1개 단지에만 신청 가능합니다. 여러 군데 신청하면 모두 무효 처리됩니다.',
  },
  {
    id: 10,
    question: 'Q. 청약 당첨되면 청약통장은 없어지나요?',
    answer:
      'A. 일반적으로 당첨되어 계약까지 진행하면 통장이 효력을 잃고 재사용 불가합니다. 하지만 낙첨되면 계속 사용 가능합니다.',
  },
  {
    id: 11,
    question: 'Q. 가점이 낮으면 청약해도 의미 없나요?',
    answer:
      'A. 아닙니다. 가점제 외에도 추첨제 물량이 존재합니다. 특히 전용 85㎡ 초과 주택은 추첨제 비율이 높은 편입니다.',
  },
  {
    id: 12,
    question: 'Q. 신혼부부 특별공급은 언제까지 신혼으로 인정되나요?',
    answer:
      'A. 혼인신고 후 7년 이내면 신혼부부 특별공급 신청이 가능합니다. 임신 중이거나 아이가 있는 예비부부도 조건을 만족하면 가능해요.',
  },
  {
    id: 13,
    question: 'Q. 위장전입이나 허위서류 제출하면 어떻게 되나요?',
    answer:
      'A. 당첨 취소 및 향후 최대 10년간 청약 제한 등의 강한 제재를 받습니다. 실거주 조건도 반드시 확인하세요.',
  },
  {
    id: 14,
    question: 'Q. 당첨되고 계약 안 하면 불이익 있나요?',
    answer:
      'A. 있습니다. 일반적으로 1년간 청약 자격이 제한되며, 무순위 청약은 2년 제한을 받을 수 있습니다.',
  },
  {
    id: 15,
    question: 'Q. 청약 결과는 어디서 확인하나요?',
    answer:
      'A. 청약홈 > 당첨자 발표조회 메뉴에서 발표일에 확인 가능합니다. 문자로도 안내가 오기도 합니다.',
  },
];

// messages 배열이 변경될 때마다 스크롤을 맨 아래로 이동
watch(
  messages,
  async () => {
    await nextTick();
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
    }
  },
  { deep: true }
);

const sendMessage = async () => {
  const text = userInput.value.trim();
  if (!text) return;

  messages.value.push({ sender: 'User', text });
  userInput.value = '';

  if (isGuide8Active.value) {
    if (text === '종료') {
      isGuide8Active.value = false;
      messages.value.push({
        sender: 'Bot',
        text: 'FAQ 모드를 종료합니다. 무엇을 도와드릴까요?',
      });
      await nextTick();
      chatBody.value.scrollTop = chatBody.value.scrollHeight;
      return; // Exit early after handling "종료"
    }

    const faqId = parseInt(text);
    if (!isNaN(faqId) && faqId >= 1 && faqId <= guide8Faqs.length) {
      const faq = guide8Faqs[faqId - 1];
      messages.value.push({
        sender: 'Bot',
        text: `${faq.question}\n${faq.answer}`,
      });
      messages.value.push({
        sender: 'Bot',
        text: '다른 궁금한 점이 있으신가요? (번호를 입력하거나 "종료"를 입력하여 FAQ 모드를 종료할 수 있습니다.)',
      });
    } else {
      // 찾기 완료 후 반복 질문
      const foundFaq = guide8Faqs.find(
        (faq) => faq.question.includes(text) || faq.answer.includes(text)
      );
      if (foundFaq) {
        messages.value.push({
          sender: 'Bot',
          text: `${foundFaq.question}\n${foundFaq.answer}`,
        });
        messages.value.push({
          sender: 'Bot',
          text: '다른 궁금한 점이 있으신가요? (번호를 입력하거나 "종료"를 입력하여 FAQ 모드를 종료할 수 있습니다.)',
        });
      } else {
        messages.value.push({
          sender: 'Bot',
          text: '죄송합니다. 해당 번호 또는 내용의 FAQ를 찾을 수 없습니다. 1부터 15까지의 번호로 다시 시도해주세요.',
        });
      }
    }
  } else {
    try {
      const response = await axios.post('/api/chat', { message: text });

      const reply = response?.data?.reply || '🤖 응답이 없습니다.';
      messages.value.push({ sender: 'Bot', text: reply });
    } catch (error) {
      console.error('❌ API 호출 오류:', error);
      messages.value.push({
        sender: 'Bot',
        text: '❌ 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      });
    }
  }

  // 스크롤 맨 아래로
  await nextTick();
  chatBody.value.scrollTop = chatBody.value.scrollHeight;
};

const sendQuickReply = (replyText) => {
  if (replyText === '자주 묻는 질문') {
    isGuide8Active.value = true;
    messages.value.push({ sender: 'User', text: replyText });
    messages.value.push({
      sender: 'Bot',
      text:
        '어떤 내용이 궁금하신가요? (1-15번 중 선택 또는 내용 입력)\n\n' +
        guide8Faqs.map((faq) => `${faq.id}. ${faq.question}\n`).join('\n'),
    });
  } else {
    userInput.value = replyText;
    sendMessage();
  }
};

onMounted(() => {
  messages.value.push({
    sender: 'Bot',
    text: '안녕하세요! MHC 챗봇입니다! 무엇을 도와드릴까요?',
  });
});
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
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  resize: both; /* Enable native resizing */
  min-width: 250px; /* Minimum width */
  min-height: 300px; /* Minimum height */
  max-width: 90vw; /* Max width relative to viewport */
  max-height: 90vh; /* Max height relative to viewport */
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

::v-deep(.chatbot-header button) {
  background: none;
  border: none;
  color: #fff !important;
  cursor: pointer;

  font-size: 18px;
  cursor: pointer;
}

.chatbot-button img {
  width: 100%;
  height: 100%;
  object-fit: contain; /* 이미지 비율 유지하면서 안에 맞춤 */
  border-radius: 50%;
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

/* 사용자 메시지 */
.user-message {
  background-color: #daf8cb;
  color: #2d572c;
  align-self: flex-end;
  text-align: right;
  margin-left: auto;
  border-bottom-right-radius: 0;
}

/* 봇 메시지 */
.bot-message {
  background-color: #f1f0f0;
  color: #333;
  align-self: flex-start;
  text-align: left;
  margin-right: auto;
  border-bottom-left-radius: 0;
}

.bot-message,
.user-message {
  white-space: pre-line;
}

.quick-reply-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  justify-content: center; /* Center the buttons */
}

.quick-reply-button {
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.quick-reply-button:hover {
  background-color: #d0d0d0;
}

.quick-reply-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid #eee;
  background-color: #f9f9f9;
  justify-content: center; /* Center the buttons */
}

.quick-reply-button {
  background-color: #e0e0e0;
  color: #333;
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.2s ease;
}

.quick-reply-button:hover {
  background-color: #d0d0d0;
}
</style>
