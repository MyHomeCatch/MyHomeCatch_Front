import { defineStore } from 'pinia';
import { loginRequest } from '../api/auth';
import authApi from '../api/auth';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Authentication state
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
    
    // User info for social login
    id: '',
    nickname: '',
    email: '',
    profile: '',
    birthday: '',
    name: '',
    
    // Join page state
    address: '',
    password: '',
    selectedDo: '',
    selectedSigugun: '',
    showAddressModal: false,
    
    // Validation state
    emailChecked: false,
    nicknameChecked: false,
    emailChecking: false,
    nicknameChecking: false,
    emailCheckMessage: '',
    nicknameCheckMessage: '',
    
    // UI state
    loading: false,
    errorMessage: '',
    successMessage: '',
  }),
  
  actions: {
    // Login methods
    async login(credentials) {
      try {
        const response = await loginRequest(credentials);
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
    },
    
    setToken(token) {
      this.token = token;
      this.isLoggedIn = true;
      localStorage.setItem('token', token);
    },
    
    // Social login info methods
    setInfo(payload) {
      this.id = payload.id || '';
      this.nickname = payload.nickname || '';
      this.email = payload.email || '';
      this.profile = payload.profile || '';
      this.birthday = payload.birthday || '';
      this.name = payload.name || '';
    },
    
    resetInfo() {
      this.id = '';
      this.nickname = '';
      this.email = '';
      this.profile = '';
      this.birthday = '';
      this.name = '';
    },
    
    // Join page methods
    resetJoinLoginState() {
      this.address = '';
      this.password = '';
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
    
    // Email validation methods
    resetEmail() {
      this.email = '';
      this.emailChecked = false;
      this.emailCheckMessage = '';
    },
    
    async checkEmail(email) {
      this.emailChecking = true;
      this.emailCheckMessage = '';
      
      try {
        const response = await authApi.checkEmail(email);
        this.emailChecked = response.available;
        this.emailCheckMessage = response.message || (response.available ? '사용 가능한 이메일입니다.' : '이미 사용 중인 이메일입니다.');
      } catch (error) {
        console.error('이메일 중복 확인 실패:', error);
        this.emailChecked = false;
        this.emailCheckMessage = error.response?.data?.message || '이메일 중복 확인에 실패했습니다.';
      } finally {
        this.emailChecking = false;
      }
    },
    
    // Nickname validation methods
    resetNickname() {
      this.nickname = '';
      this.nicknameChecked = false;
      this.nicknameCheckMessage = '';
    },
    
    async checkNickname(nickname) {
      this.nicknameChecking = true;
      this.nicknameCheckMessage = '';
      
      try {
        const response = await authApi.checkNickname(nickname);
        this.nicknameChecked = response.available;
        this.nicknameCheckMessage = response.message || (response.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.');
      } catch (error) {
        console.error('닉네임 중복 확인 실패:', error);
        this.nicknameChecked = false;
        this.nicknameCheckMessage = error.response?.data?.message || '닉네임 중복 확인에 실패했습니다.';
      } finally {
        this.nicknameChecking = false;
      }
    },
    
    // Address modal methods
    openAddressModal() {
      this.showAddressModal = true;
    },
    
    onSelectDo(doName) {
      this.selectedDo = doName;
      this.selectedSigugun = '';
      this.address = doName;
    },
    
    onSelectSigugun(sigugunName) {
      this.selectedSigugun = sigugunName;
      this.address = `${this.selectedDo} ${sigugunName}`;
    },
    
    // Signup method
    async signup(userData) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      
      try {
        const response = await authApi.signup(userData);
        this.successMessage = response.message || '회원가입이 완료되었습니다!';
        return { success: true };
      } catch (error) {
        console.error('회원가입 실패:', error);
        this.errorMessage = error.response?.data?.message || '회원가입에 실패했습니다.';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },
  },
});
