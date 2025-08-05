import axios from 'axios';
import { setupInterceptors } from './commonApi';

// 새 axios 인스턴스 생성
const commentApi = axios.create({
  baseURL: 'http://localhost:8080/api/detail/comments', // 댓글 API 기본 URL
});

// 공통 인터셉터 설정
setupInterceptors(commentApi);

/**
 * 특정 단지의 댓글 목록을 가져옵니다.
 * @param {number} danziId - 단지 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const getCommentsByDanziId = (danziId) => {
  return commentApi.get(`/${danziId}`);
};

/**
 * 새 댓글을 등록합니다.
 * @param {object} commentData - 댓글 데이터 (예: { danziId, content, userId })
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const addComment = (commentData) => {
  return commentApi.post('/', commentData);
};

/**
 * 특정 댓글을 삭제합니다.
 * @param {string | number} commentId - 댓글 ID
 * @returns {Promise<axios.AxiosResponse<any>>}
 */
export const deleteComment = (commentId) => {
  return commentApi.delete(`/${commentId}`);
};
