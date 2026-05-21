import api from "../api/axiosConfig";

/**
 * 유닛 관련 API 서비스
 */

/**
 * 완료된 유닛의 퀴즈 결과 요약 조회
 * @param {number} unitId - 조회할 유닛 ID
 * @returns {Promise<UnitResultDto>}
 */
export const getUnitResult = async (unitId) => {
  const userId = localStorage.getItem("userId");
  const response = await api.get(`/api/units/${unitId}/result?userId=${userId}`);
  return response.data;
};