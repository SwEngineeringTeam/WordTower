import API from "../api/axiosConfig";

/**
 * 사용자의 현재 스트릭을 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<number>} 현재 스트릭 값
 */
export const getUserStreak = async (userId) => {
  try {
    const response = await API.get(`/api/streak/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user streak:", error);
    throw error;
  }
};

/**
 * 사용자의 현재 진도(열린 유닛 번호)를 서버에서 가져옴
 * @param {number} userId - 사용자 ID
 * @returns {Promise<number>} 열린 유닛 번호
 */
export const getUserProgress = async (userId) => {
  try {
    const response = await API.get(`/api/users/${userId}/progress`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user progress:", error);
    throw error;
  }
};

/**
 * 퀴즈 제출, 스트릭 갱신 및 다음 유닛 오픈을 통합 요청
 * @param {number} userId - 사용자 ID
 * @param {number} completedUnit - 방금 완료한 유닛 번호 (기존 solvedCount 대신 사용)
 */
/**
 * 퀴즈 제출, 스트릭 갱신 및 다음 유닛 오픈을 통합 요청
 * @param {number} userId - 사용자 ID
 * @param {number} completedUnit - 방금 완료한 유닛 번호
 * @param {number} totalCount - 총 문제 수
 * @param {number} correctCount - 정답 수
 */
export const submitQuizAndUpdateStreak = async (userId, completedUnit, totalCount = 0, correctCount = 0, details = []) => {
  try {
    const response = await API.post(`/api/quiz/submit`, {
      userId,
      completedUnit,
      totalCount,
      correctCount,
      details  // ← 단어별 정오답 목록 추가
    });
    return response.data;
  } catch (error) {
    console.error("Error updating streak and progress after quiz:", error);
    throw error;
  }
};