import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default {
  // 유저정보 조회
  async getUserInfo(getAuthConfig) {
    const { data } = await api.get('/user', getAuthConfig);
    return data;
  },
  // 가점 정보 업데이트
  async updateAdditionalPoint(getAuthConfig, body) {
    const { data } = await api.put(
      '/user/additionalPoint',
      body,
      getAuthConfig
    );
    return data;
  },
};
