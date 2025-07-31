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
  // 자가진단 정보 조회
  async getHouseholdInfo(getAuthConfig) {
    const { data } = await api.get('/self-check/content', getAuthConfig);
    return data;
  },
  // 자가진단 결과 조회
  async getSupportableList(getAuthConfig) {
    const { data } = await api.get('/self-check/results', getAuthConfig);
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
