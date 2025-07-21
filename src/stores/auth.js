import { defineStore } from 'pinia';
import { loginRequest } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    isLoggedIn: false,
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await loginRequest(credentials);
        this.token = response.data.token;
        this.isLoggedIn = true;
        return true;
      } catch (err) {
        console.error('로그인 실패:', err.response?.data || err.message);
        return false;
      }
    },
  },
});
