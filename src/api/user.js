import axios from 'axios';
import { setupInterceptors } from './commonApi';

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
  // 유저정보 조회
  async getUserInfo() {
    const { data } = await api.get('/user');
    return data;
  },
  // 자가진단 정보 조회
  async getHouseholdInfo() {
    const { data } = await api.get('/self-check/content');
    return data;
  },
  // 자가진단 결과 조회
  async getSupportableList() {
    const { data } = await api.get('/self-check/results');
    return data;
  },
  // 가점 정보 업데이트
  async updateAdditionalPoint(body) {
    const { data } = await api.put('/user/additionalPoint', body);
    return data;
  },
};
