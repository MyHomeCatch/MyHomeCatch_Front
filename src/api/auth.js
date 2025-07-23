import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  // 카카오 로그인
  async kakaoLogin(code) {
    let body = { code: code };
    const { data } = await api.post('/kakao', body);
    console.log('AUTH POST: ', data);
    return data;
  },

  // 구글 로그인
  async googleLogin(code) {
    const body = { code };
    const { data } = await api.post('/login/google', body);
    console.log('AUTH POST (Google): ', data);
    return data;
  },

  // 이메일 중복 확인
  async checkEmail(email) {
    const { data } = await api.get('/check-email', { params: { email } });
    return data;
  },

  // 닉네임 중복 확인
  async checkNickname(nickname) {
    const { data } = await api.get('/check-nickname', { params: { nickname } });
    return data;
  },

  // 회원가입
  async signup(payload) {
    const { data } = await api.post('/signup', payload);
    return data;
  },
};

export const loginRequest = (payload) => {
  return api.post('/login', payload);
};
