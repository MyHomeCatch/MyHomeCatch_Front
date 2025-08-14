<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-content">
      <h3>약관 동의</h3>

      <div class="checkbox">
        <input
          type="checkbox"
          id="allAgree"
          v-model="allAgree"
          @change="toggleAll"
        />
        <label for="allAgree">
          이용약관, 개인정보 수집 및 이용, 프로모션 정보 수신에 모두 동의합니다.
        </label>
      </div>

      <div class="checkbox">
        <input
          type="checkbox"
          id="terms"
          v-model="termsAgreed"
          @change="checkAllState"
        />
        <label for="terms">
          이용약관 동의 <span class="required">(필수)</span>
        </label>
      </div>
      <div class="terms-box">
        제1조 (목적)<br />
        본 약관은 회사와 이용자 간에 서비스 이용에 관한 권리, 의무 및 책임사항,
        기타 필요한 사항을 규정함을 목적으로 합니다.<br /><br />
        제2조 (용어의 정의)<br />
        1. "서비스"란 회사가 제공하는 모든 온라인 서비스 일체를 의미합니다.<br />
        2. "이용자"란 본 약관에 따라 회사가 제공하는 서비스를 받는 회원 및
        비회원을 말합니다.<br /><br />
        제3조 (약관의 게시와 개정)<br />
        회사는 약관의 내용을 이용자가 쉽게 알 수 있도록 서비스 초기 화면에
        게시하며, 필요한 경우 약관을 변경할 수 있습니다.<br />
        약관 변경 시 회사는 최소 7일 전부터 공지합니다.
      </div>

      <div class="checkbox">
        <input
          type="checkbox"
          id="privacy"
          v-model="privacyAgreed"
          @change="checkAllState"
        />
        <label for="privacy">
          개인정보 수집 및 이용 동의 <span class="required">(필수)</span>
        </label>
      </div>
      <div class="terms-box">
        회사는 회원 가입 시 아래와 같은 개인정보를 수집합니다.<br /><br />
        수집 항목: 이름, 이메일, 주소, 연락처 등<br /><br />
        수집 목적: 서비스 제공 및 회원관리, 고객문의 대응, 마케팅 및 광고에
        활용<br /><br />
        개인정보는 법령에 따라 안전하게 보관하며, 회원의 동의 없이 제3자에게
        제공하지 않습니다.<br />
        회원은 언제든지 개인정보 열람, 수정, 삭제를 요청할 수 있습니다.
      </div>

      <div class="checkbox">
        <input
          type="checkbox"
          id="promo"
          v-model="promoAgreed"
          @change="checkAllState"
        />
        <label for="promo">
          프로모션 정보 수신 동의 <span class="optional">(선택)</span>
        </label>
      </div>
      <div class="terms-box">
        회원님께 다양한 이벤트, 할인, 신상품 소식 등 프로모션 정보를 이메일이나
        SMS를 통해 발송할 수 있습니다.<br /><br />
        선택 동의 항목으로, 동의하지 않아도 서비스 이용에 제한이 없습니다.<br /><br />
        언제든지 수신 거부가 가능하며, 수신 거부 시 즉시 적용됩니다.
      </div>

      <div class="modal-actions">
        <button class="cancel-btn" @click="$emit('close')">취소</button>
        <button class="confirm-btn" @click="confirmAgreement">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['close', 'confirmed']);

const allAgree = ref(false);
const termsAgreed = ref(false);
const privacyAgreed = ref(false);
const promoAgreed = ref(false);

const toggleAll = () => {
  termsAgreed.value = allAgree.value;
  privacyAgreed.value = allAgree.value;
  promoAgreed.value = allAgree.value;
};

const checkAllState = () => {
  allAgree.value =
    termsAgreed.value && privacyAgreed.value && promoAgreed.value;
};

const confirmAgreement = () => {
  if (!termsAgreed.value || !privacyAgreed.value) {
    alert('필수 약관에 모두 동의해야 합니다.');
    return;
  }
  emit('confirmed', {
    terms: termsAgreed.value,
    privacy: privacyAgreed.value,
    promo: promoAgreed.value,
  });
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(30, 30, 30, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.18);
}

.modal-content h3 {
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 10px 0;
}

.checkbox input[type='checkbox'] {
  accent-color: #8ab191;
  width: 16px;
  height: 16px;
}

.checkbox label {
  font-size: 14px;
  color: #444;
  cursor: pointer;
}

.required {
  color: #e74c3c;
  font-weight: 500;
}

.optional {
  color: #888;
}

.terms-box {
  background: #f5f6f7;
  padding: 10px 12px;
  font-size: 13px;
  color: #555;
  margin: 6px 0 12px 24px; /* 체크박스 라벨 아래 들여쓰기 */
  border-radius: 6px;
  line-height: 1.4;
  max-height: 120px;
  overflow-y: auto;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 18px;
}

.cancel-btn,
.confirm-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}

.confirm-btn {
  background: #8ab191;
  color: #fff;
  font-weight: 500;
}

.confirm-btn:hover {
  background: #7aa481;
}
</style>
