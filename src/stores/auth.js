import { defineStore } from 'pinia';
import authApi, { loginRequest } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 인증 상태
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),

    // 사용자 정보
    user: {
      id: '',
      name: '',
      nickname: '',
      email: '',
      profile: '',
      birthday: '',
      address: '',
    },

    // 회원가입/로그인 입력값
    password: '',

    // 소셜 로그인 구분
    socialType: '', // 'kakao' | 'google' | ''

    // UI 상태
    showAddressModal: false,
    selectedDo: '',
    selectedSigugun: '',

    // 검증 상태
    emailChecked: false,
    nicknameChecked: false,
    emailChecking: false,
    nicknameChecking: false,
    emailCheckMessage: '',
    nicknameCheckMessage: '',

    // 기타
    loading: false,
    errorMessage: '',
    successMessage: '',
    emailVerified: false, // 이메일 인증 상태 추가
  }),

  actions: {
    // 로그인
    async login({ email, password }) {
      try {
        const response = await loginRequest({ email, password });
        this.setToken(response.data.token);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || '로그인 실패',
        };
      }
    },

    logout() {
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      this.resetAll();
    },

    setToken(token) {
      this.token = token;
      this.isLoggedIn = true;
      localStorage.setItem('token', token);
    },

    // 소셜 로그인 정보 세팅
    setSocialInfo({ id, name, nickname, email, profile, birthday, type }) {
      this.user = {
        ...this.user,
        id,
        name,
        nickname,
        email,
        profile,
        birthday,
      };
      this.socialType = type || '';
      this.emailChecked = true;
      // 소셜 로그인 시 비밀번호 자동 세팅
      if (type === 'kakao') this.password = `KAKAO ${id}`;
      else if (type === 'google') this.password = `GOOGLE ${id}`;
    },

    // 회원가입 입력값 세팅
    setUserField(field, value) {
      this.user[field] = value;
    },

    // 상태 초기화
    resetAll() {
      this.user = {
        id: '',
        name: '',
        nickname: '',
        email: '',
        profile: '',
        birthday: '',
        address: '',
      };
      this.password = '';
      this.socialType = '';
      this.selectedDo = '';
      this.selectedSigugun = '';
      this.showAddressModal = false;
      this.emailChecked = false;
      this.nicknameChecked = false;
      this.emailChecking = false;
      this.nicknameChecking = false;
      this.emailCheckMessage = '';
      this.nicknameCheckMessage = '';
      this.loading = false;
      this.errorMessage = '';
      this.successMessage = '';
      this.emailVerified = false; // 초기화 시 이메일 인증 상태도 초기화
    },

    // 이메일/닉네임 중복확인
    async checkEmail(email) {
      this.emailChecking = true;
      this.emailCheckMessage = '';
      try {
        const response = await authApi.checkEmail(email);
        this.emailChecked = response.available;
        this.emailCheckMessage =
          response.message ||
          (response.available
            ? '사용 가능한 이메일입니다.'
            : '이미 사용 중인 이메일입니다.');
      } catch (error) {
        this.emailChecked = false;
        this.emailCheckMessage =
          error.response?.data?.message || '이메일 중복 확인에 실패했습니다.';
      } finally {
        this.emailChecking = false;
      }
    },

    async checkNickname(nickname) {
      this.nicknameChecking = true;
      this.nicknameCheckMessage = '';
      try {
        const response = await authApi.checkNickname(nickname);
        this.nicknameChecked = response.available;
        this.nicknameCheckMessage =
          response.message ||
          (response.available
            ? '사용 가능한 닉네임입니다.'
            : '이미 사용 중인 닉네임입니다.');
      } catch (error) {
        this.nicknameChecked = false;
        this.nicknameCheckMessage =
          error.response?.data?.message || '닉네임 중복 확인에 실패했습니다.';
      } finally {
        this.nicknameChecking = false;
      }
    },

    async sendEmail(email) {
      try {
        const response = await authApi.sendToEmail({ email }); // 👈 이렇게 JSON으로!
        console.log(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        // any cleanup
      }
    },

    async checkEmailCode(email, code) {
      try {
        const response = await authApi.checkEmailCode({ email, code });
        console.log('응답은??');
        console.log(response);
        console.log('응답은??');

        if (response.success) {
          console.log('✅ 이메일 인증 성공');
          this.emailVerified = true; // <-- 인증 성공 시 상태 저장
          this.emailCheckMessage = ''; // 인증 성공 시 메시지 제거
          // 추가 성공 로직
        } else {
          console.warn('❌ 이메일 인증 실패:', response.data.message);
          this.emailVerified = false; // 인증 실패 시 false
          // 실패 처리 (예: 사용자에게 메시지 보여주기)
        }
      } catch (error) {
        console.error('🚨 서버 에러 발생', error);
        this.emailVerified = false; // 에러 시 false
        // 네트워크 오류나 예외 처리
      } finally {
        // any cleanup
      }
    },
    // 주소 모달
    openAddressModal() {
      this.showAddressModal = true;
    },
    onSelectDo(doName) {
      this.selectedDo = doName;
      this.selectedSigugun = '';
      this.user.address = doName;
    },
    onSelectSigugun(sigugunName) {
      this.selectedSigugun = sigugunName;
      this.user.address = `${this.selectedDo} ${sigugunName}`;
      this.showAddressModal = false;
    },

    // 회원가입
    async signup() {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await authApi.signup({
          ...this.user,
          password: this.password,
        });
        this.successMessage = response.message || '회원가입이 완료되었습니다!';
        return { success: true };
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || '회원가입에 실패했습니다.';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },
  },
});
