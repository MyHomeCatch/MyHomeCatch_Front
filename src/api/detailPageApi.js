import axios from 'axios';
import { setupInterceptors } from './commonApi';

const detailApi = axios.create({
  baseURL: 'http://localhost:8080/api', // API 기본 경로
    headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 포함하여 요청
});

// 인터셉터 설정
setupInterceptors(detailApi);

/**
 * 특정 ID의 주택 상세 정보를 가져오는 함수
 * @param {string | number} danziId - 단지의 고유 ID
 * @returns {Promise<object>} - 주택 상세 정보
 */
export const getHouseDetailById = (danziId, selfCheckResult = null) => {
  if (!danziId) {
    return Promise.reject(new Error('danziId가 제공되지 않았습니다.'));
  }
  // API 명세에 따라 /house/{danziId} 형태로 요청
  return detailApi.get(`/house/${danziId}`);
};

/**
 * 특정 ID의 houseCard 가져오는 함수
 * @param {string | number} danziId - 단지의 고유 ID
 * @returns {Promise<object>} - 단지의 houseCard
 */
export const getHouseCardById = (danziId) => {
  if (!danziId) {
    return Promise.reject(new Error('danziId가 제공되지 않았습니다.'));
  }
  // API 명세에 따라 /house/card/{danziId} 형태로 요청
  return detailApi.get(`/house/card/${danziId}`);
};

export const getHouseDetailByIdWithSelfCheck = async (
  userId,
  selfCheckResult,
  danziId
) => {
  if (!danziId) {
    return Promise.reject(new Error('danziId가 제공되지 않았습니다.'));
  }
  try {
    // API 명세에 따라 /house/{danziId} 형태로 요청
    const requestBody = {
      userId: userId, // 사용자 ID
      selfCheckResult: selfCheckResult,
    };
    console.log('API 요청 본문:', requestBody);
    // API 요청
    return detailApi.post(`/house/${danziId}`, requestBody);
  } catch (error) {
    console.error('주택 상세 정보 가져오기 실패:', error);
    throw error;
  }
};

export const getBookmarksByHouseId = (houseId) => {
  if (!houseId) {
    return Promise.reject(new Error('houseId가 제공되지 않았습니다.'));
  }
  // API 명세에 따라 /bookmark/house/{houseId} 형태로 요청
  return detailApi.get(`/bookmark/${houseId}`);
};

