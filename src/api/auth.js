import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default {
  async loginRequest(payload) {
    return await api.post('/login', payload);
  },
  // 카카오 로그인
  async kakaoLogin(code) {
    let body = { code: code };

    const { data } = await api.post('/kakao', body);

    console.log('AUTH POST: ', data);
    return data;
  },
};
