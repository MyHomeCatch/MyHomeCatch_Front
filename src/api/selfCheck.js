import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 요청 인터셉터 - 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore();
    const token = authStore.token;
    console.log('토큰 상태:', token ? '토큰 있음' : '토큰 없음');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Authorization 헤더 설정:', config.headers['Authorization']);
    } else {
      console.warn('토큰이 없습니다. 로그인이 필요합니다.');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // 국민임대 자체진단
  async getKookminDiagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/Kookmin', diagnosisData);
    return data;
  },

  // 행복주택 자체진단
  async getHengBokDiagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/HengBok', diagnosisData);
    return data;
  },

  // 공공임대 자체진단
  async getGongGongDiagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/GongGong', diagnosisData);
    return data;
  },

  // 09공공임대 자체진단
  async get09Diagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/09', diagnosisData);
    return data;
  },

  // 기존 자체진단 결과 초기화
  async initializeDiagnosis() {
    const { data } = await api.delete('/self-check/init');
    return data;
  },
};
