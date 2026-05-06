/**
 * 사용자의 현재 스트릭을 조회합니다.
 * @param {number} userId - 사용자 ID
 * @returns {Promise<number>} 현재 스트릭 값
 */
export const getUserStreak = async (userId) => {
  try {
    const response = await fetch(`/api/streak/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch streak');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user streak:', error);
    throw error;
  }
};

/**
 * 퀴즈 제출 및 스트릭 갱신을 요청합니다.
 * @param {number} userId - 사용자 ID
 * @param {number} solvedCount - 푼 문제 수
 */
export const submitQuizAndUpdateStreak = async (userId, solvedCount) => {
  try {
    const response = await fetch(`/api/streak/${userId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ solvedCount: solvedCount }), 
    });

    if (!response.ok) {
      throw new Error('Failed to update streak');
    }
    return await response.text(); 
  } catch (error) {
    console.error('Error updating streak after quiz:', error);
    throw error;
  }
};