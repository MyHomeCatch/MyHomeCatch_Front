import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default {
  // 카카오 로그인
  async kakaoLogin(code) {
    let body = { code: code };
    const { data } = await api.post('/auth/kakao', body);
    return data;
  },

  // 구글 로그인
  async googleLogin(code) {
    const body = { code };
    const { data } = await api.post('/auth/login/google', body);
    return data;
  },

  // 이메일 중복 확인
  async checkEmail(email) {
    const { data } = await api.get('/auth/check-email', { params: { email } });
    return data;
  },

  // 닉네임 중복 확인
  async checkNickname(nickname) {
    const { data } = await api.get('/auth/check-nickname', {
      params: { nickname },
    });
    return data;
  },

  // 회원가입
  async signup(payload) {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  },
  // 인증 이메일 전송
  async sendToEmail(payload) {
    const { data } = await api.post('/email/send', payload);
    return data;
  },

  // 이메일 인증번호 검증
  async checkEmailCode(payload) {
    const { data } = await api.post('/email/check', payload);
    return data;
  },

  // 비밀번호 재설정
  async resetPassword(payload) {
    const { data } = await api.post('/auth/password/reset', payload);
    return data;
  },

  // 유저정보 조회
  async getUserInfo() {
    const { data } = await axios.get('/user');
    return data;
  },
};

export const loginRequest = (payload) => {
  return api.post('/auth/login', payload);
};
