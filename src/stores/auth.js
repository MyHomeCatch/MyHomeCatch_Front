import { defineStore } from 'pinia';
import { loginRequest } from '../api/auth';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),

    id: '',
    nickname: '',
    email: '',
    profile: '',
    birthday: '',
  }),
  actions: {
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
