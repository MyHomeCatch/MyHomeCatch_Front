import { defineStore } from 'pinia';
import { loginRequest } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await loginRequest(credentials);
        this.token = response.data.token;
        this.isLoggedIn = true;
        localStorage.setItem('token', response.data.token); // 토큰 저장
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
    }
  }
});
