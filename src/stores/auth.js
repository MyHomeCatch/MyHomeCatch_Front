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
      this.user = { ...this.user, id, name, nickname, email, profile, birthday };
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
    },

    // 이메일/닉네임 중복확인
    async checkEmail(email) {
      this.emailChecking = true;
      this.emailCheckMessage = '';
      try {
        const response = await authApi.checkEmail(email);
        this.emailChecked = response.available;
        this.emailCheckMessage = response.message || (response.available ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.');
      } catch (error) {
        this.emailChecked = false;
        this.emailCheckMessage = error.response?.data?.message || '이메일 중복 확인에 실패했습니다.';
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
        this.nicknameCheckMessage = response.message || (response.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
      } catch (error) {
        this.nicknameChecked = false;
        this.nicknameCheckMessage = error.response?.data?.message || '닉네임 중복 확인에 실패했습니다.';
      } finally {
        this.nicknameChecking = false;
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
        this.errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },
  },
});
