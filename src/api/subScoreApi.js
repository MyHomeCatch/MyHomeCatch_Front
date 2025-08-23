/**
 * 지역별 가점 낮은 아파트 5곳 조회
 * {string} region - 조회할 지역
 * 리턴 값 : {Promise<axios.AxiosResponse<any>>}
 */
import axios from 'axios';

// /**
//  * 지역별 가점 낮은 아파트 5곳 조회
//  * {string} region - 조회할 지역
//  * 리턴 값 : {Promise<axios.AxiosResponse<any>>}
//  */
// export const getApartmentSubScore = (regionCode) => {
//   return axios.get('/api/winner-stats/low-popular', {
//     params: { region: regionCode },
//   });
// };

/**
 * 지역별 가점 낮은 아파트 5곳 조회 (테스트용)
 * 리턴 값 : {Promise<axios.AxiosResponse<any>>}
 */
export const getApartmentSubScore = () => {
  // 테스트를 위해 지역 번호를 "01"로 고정
  return axios.get('/api/winner-stats/low-score', {
    params: { region: '01' },
  });
};
