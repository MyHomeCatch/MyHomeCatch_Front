// api/bookmarkService.js
import axios from 'axios';

const BOOKMARK_API_URL = 'http://localhost:8080/api/bookmark';

// 즐겨찾기 목록 조회
export const getBookmarks = async (token) => {
  try {
    const response = await axios.get(BOOKMARK_API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 목록 조회 실패:', error);
    throw error;
  }
};

// 즐겨찾기 추가
export const addBookmark = async (bookmarkData, token) => {
  try {
    const response = await axios.post(BOOKMARK_API_URL, bookmarkData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 추가 실패:', error);
    throw error;
  }
};

// 즐겨찾기 삭제
export const removeBookmark = async (bookmarkData, token) => {
  try {
    const response = await axios.delete(BOOKMARK_API_URL, {
      data: bookmarkData,
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('즐겨찾기 삭제 실패:', error);
    throw error;
  }
};

// 즐겨찾기 토글 (추가/삭제 자동 판별)
export const toggleBookmark = async (
  danziId,
  userId,
  token,
  currentFavorites
) => {
  const bookmarkData = { userId, danziId };
  const isCurrentlyFavorited = currentFavorites.some(
    (fav) => fav.danziId === danziId
  );

  try {
    if (isCurrentlyFavorited) {
      return await removeBookmark(bookmarkData, token);
    } else {
      return await addBookmark(bookmarkData, token);
    }
  } catch (error) {
    console.error('즐겨찾기 토글 실패:', error);
    throw error;
  }
};
