import axios from 'axios';
import {
  setupInterceptors,
  startTokenRefresh,
  stopTokenRefresh,
  refreshToken,
} from './commonApi';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 인터셉터 설정
setupInterceptors(api);

export default {
  async kakaoLogin(code) {
    let body = { code: code };
    const { data } = await api.post('/auth/kakao', body);

    if (data.token) {
      localStorage.setItem('token', data.token);
      startTokenRefresh(api);
      console.log('카카오 로그인 성공, 토큰 갱신 스케줄링 시작');
    }

    return data;
  },

  async googleLogin(code) {
    const body = { code };
    const { data } = await api.post('/auth/login/google', body);

    if (data.token) {
      localStorage.setItem('token', data.token);
      startTokenRefresh(api);
      console.log('구글 로그인 성공, 토큰 갱신 스케줄링 시작');
    }

    return data;
  },

  async checkEmail(email) {
    const { data } = await api.get('/auth/check-email', { params: { email } });
    return data;
  },

  async checkNickname(nickname) {
    const { data } = await api.get('/auth/check-nickname', {
      params: { nickname },
    });
    return data;
  },

  async signup(payload) {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  },

  async sendToEmail(payload) {
    const { data } = await api.post('/email/send', payload);
    return data;
  },

  async checkEmailCode(payload) {
    const { data } = await api.post('/email/check', payload);
    return data;
  },

  async resetPassword(payload) {
    const { data } = await api.post('/auth/password/reset', payload);
    return data;
  },

  // 유저정보 조회
  async getMypageUserInfo() {
    const { data } = await axios.get('/user');
    return data;
  },
  async logout() {
    try {
      const { data } = await api.post('/auth/logout');

      stopTokenRefresh();
      localStorage.removeItem('token');
      console.log('로그아웃 완료, 토큰 갱신 타이머 정리');

      return data;
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
      stopTokenRefresh();
      localStorage.removeItem('token');
      throw error;
    }
  },

  async refreshToken() {
    return await refreshToken(api);
  },

  startTokenRefresh() {
    startTokenRefresh(api);
  },

  stopTokenRefresh() {
    stopTokenRefresh();
  },

  async getUserInfo(token) {
    const response = await axios.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export const loginRequest = (payload) => {
  return api.post('/auth/login', payload);
};
