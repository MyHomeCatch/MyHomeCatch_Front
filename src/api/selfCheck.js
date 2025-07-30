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

  // 진단 내용 저장
  async saveContent(diagnosisData) {
    const { data } = await api.post('/self-check/content/save', diagnosisData);
    return data;
  },

  // 진단 내용 삭제
  async deleteContent() {
    const { data } = await api.delete('/self-check/content/delete');
    return data;
  },

};
