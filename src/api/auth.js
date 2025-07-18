import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth', // 테스트 백엔드 연결용 8080 포트 나중에 dist copy해서 넘겨줄거임
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginRequest = (payload) => {
  return api.post('/login', payload);
};
