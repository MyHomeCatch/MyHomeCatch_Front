import axios from 'axios';
import { setupInterceptors } from './commonApi';

// 새 axios 인스턴스 생성
const detailApi = axios.create({
  baseURL: 'http://localhost:8080/api', // API 기본 경로
});

// 인터셉터 설정
setupInterceptors(detailApi);

/**
 * 특정 ID의 주택 상세 정보를 가져오는 함수
 * @param {string | number} danziId - 단지의 고유 ID
 * @returns {Promise<object>} - 주택 상세 정보
 */
export const getHouseDetailById = (danziId) => {
  if (!danziId) {
    return Promise.reject(new Error('danziId가 제공되지 않았습니다.'));
  }
  // API 명세에 따라 /house/{danziId} 형태로 요청
  return detailApi.get(`/house/${danziId}`);
};

export const getHouseCardById = (danziId) => {
  if (!danziId) {
    return Promise.reject(new Error('danziId가 제공되지 않았습니다.'));
  }
  // API 명세에 따라 /house/card/{danziId} 형태로 요청
  return detailApi.get(`/house/card/${danziId}`);
};
