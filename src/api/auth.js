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
};

export const loginRequest = (payload) => {
  return api.post('/login', payload);
};

export const checkEmailRequest = (email) => {
  return api.get('/check-email', { params: { email } });
};

export const checkNicknameRequest = (nickname) => {
  return api.get('/check-nickname', { params: { nickname } });
};

export const signupRequets = (payload) => {
  return api.post('/signup', payload);
};

export const signupRequest = (payload) => {
  return api.post('/signup', payload);
};
