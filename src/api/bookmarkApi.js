import axios from 'axios';
import { setupInterceptors } from './commonApi';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 포함하여 요청
});

// 인터셉터 설정
setupInterceptors(api);

export default {
/**
   * 북마크를 추가합니다.
   * @param {object} bookmarkData - { userId, danziId }
   */
  async createBookmark(bookmarkData) {
    if (!bookmarkData.userId || !bookmarkData.danziId) {
      return Promise.reject(
        new Error('userId 또는 danziId가 제공되지 않았습니다.')
      );
    }
    // [수정] const로 requestBody 변수를 선언합니다.
    const requestBody = {
      userId: bookmarkData.userId,
      danziId: bookmarkData.danziId,
    };
    console.log('북마크 추가 요청 본문:', requestBody);
    const { data } = await api.post('/bookmark', requestBody);
    return data;
  },

  /**
   * 북마크를 삭제합니다.
   * @param {object} bookmarkData - { userId, danziId }
   */
  async deleteBookmark(bookmarkData) {
    if (!bookmarkData.userId || !bookmarkData.danziId) {
      return Promise.reject(
        new Error('userId 또는 danziId가 제공되지 않았습니다.')
      );
    }
    // [수정] const로 requestBody 변수를 선언합니다.
    const requestBody = {
      userId: bookmarkData.userId,
      danziId: bookmarkData.danziId,
    };
    console.log('북마크 삭제 요청 본문:', requestBody);
    // axios.delete 요청 시 body는 { data: ... } 객체로 감싸서 보내야 합니다.
    const { data } = await api.delete('/bookmark', { data: requestBody });
    return data;
  },
};
