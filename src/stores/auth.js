import { defineStore } from 'pinia';
import { loginRequest, signupRequest, checkEmailRequest, checkNicknameRequest } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),

    id: '',
    nickname: '',
    email: '',
    profile: '',
    birthday: '',
    // Join/Login page state
    name: '',
    address: '',
    password: '',
    errorMessage: '',
    successMessage: '',
    loading: false,
    // Email/Nickname check state
    emailCheckMessage: '',
    emailChecking: false,
    emailChecked: false,
    nicknameCheckMessage: '',
    nicknameChecking: false,
    nicknameChecked: false,
    // Address modal state
    showAddressModal: false,
    selectedDo: '',
    selectedSigugun: '',
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await loginRequest(credentials);
        this.token = response.data.token;
        this.isLoggedIn = true;
        localStorage.setItem('token', response.data.token);
        return { success: true };
      } catch (err) {
        return {
          success: false,
          message: err.response?.data?.message || '로그인 실패',
        };
      }
    },
    async signup(payload) {
      this.errorMessage = '';
      this.successMessage = '';
      this.loading = true;
      try {
        const response = await signupRequest(payload);
        this.successMessage = response.data.message;
        return { success: true };
      } catch (err) {
        this.errorMessage = err.response?.data?.message || '회원가입 실패';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },
    async checkEmail(email) {
      this.emailCheckMessage = '';
      this.emailChecking = true;
      try {
        const response = await checkEmailRequest(email);
        if (response.data.available) {
          this.emailCheckMessage = '사용 가능한 이메일입니다.';
          this.emailChecked = true;
        } else {
          this.emailCheckMessage = '이미 사용 중인 이메일입니다.';
          this.emailChecked = false;
        }
      } catch (err) {
        this.emailCheckMessage = '오류가 발생했습니다.';
        this.emailChecked = false;
      } finally {
        this.emailChecking = false;
      }
    },
    async checkNickname(nickname) {
      this.nicknameCheckMessage = '';
      this.nicknameChecking = true;
      try {
        const response = await checkNicknameRequest(nickname);
        if (response.data.available) {
          this.nicknameCheckMessage = '사용 가능한 닉네임입니다.';
          this.nicknameChecked = true;
        } else {
          this.nicknameCheckMessage = '이미 사용 중인 닉네임입니다.';
          this.nicknameChecked = false;
        }
      } catch (err) {
        this.nicknameCheckMessage = '오류가 발생했습니다.';
        this.nicknameChecked = false;
      } finally {
        this.nicknameChecking = false;
      }
    },
    resetEmail() {
      this.emailChecked = false;
      this.email = '';
      this.emailCheckMessage = '';
    },
    resetNickname() {
      this.nicknameChecked = false;
      this.nickname = '';
      this.nicknameCheckMessage = '';
    },
    openAddressModal() {
      this.showAddressModal = true;
      this.selectedDo = '';
      this.selectedSigugun = '';
    },
    onSelectDo(doName) {
      this.selectedDo = doName;
      this.selectedSigugun = '';
    },
    onSelectSigugun(sigugunName) {
      this.selectedSigugun = sigugunName;
      this.address = `${this.selectedDo} ${sigugunName}`;
      this.showAddressModal = false;
    },
    resetJoinLoginState() {
      this.name = '';
      this.address = '';
      this.password = '';
      this.errorMessage = '';
      this.successMessage = '';
      this.loading = false;
      this.emailCheckMessage = '';
      this.emailChecking = false;
      this.emailChecked = false;
      this.nicknameCheckMessage = '';
      this.nicknameChecking = false;
      this.nicknameChecked = false;
      this.showAddressModal = false;
      this.selectedDo = '';
      this.selectedSigugun = '';
    },
    logout() {
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
    },
    setInfo(payload) {
      this.id = payload.id;
      this.nickname = payload.nickname;
      this.email = payload.email;
      this.profile = payload.profile;
      this.birthday = payload.birthday;
    },
    resetInfo() {
      this.nickname = '';
      this.email = '';
      this.profile = '';
      this.birthday = '';
    },
  },
});
