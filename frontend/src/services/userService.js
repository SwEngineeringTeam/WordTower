import API from "../api/axiosConfig";

/**
 * 현재 사용자의 스트릭 방어권 보유 개수를 조회
 * @param {number|string} userId
 * @returns {Promise<number>}
 */
export const getStreakFreezeCount = async (userId) => {
  const response = await API.get(`/api/users/${userId}/streak-freeze`);
  return response.data;
};

/**
 * 경험치 증가 시 스트릭 방어권을 지급
 * @param {number|string} userId
 * @param {number} oldExp
 * @param {number} newExp
 * @returns {Promise<number>} 최신 스트릭 방어권 개수
 */
export const rewardStreakFreezeForExp = async (userId, oldExp, newExp) => {
  const response = await API.post(`/api/users/${userId}/streak-freeze/reward`, {
    oldExp,
    newExp,
  });
  return response.data;
};

export const addTestExp = async (userId, addedExp) => {
  try {
    const response = await API.post(`/api/test/add-exp`, { userId, addedExp });
    return response.data;
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 403) {
        throw new Error(`🔒 접근 불가: ${data}`);
      } else if (status === 400) {
        throw new Error(`❌ 잘못된 요청: ${data}`);
      }
      throw new Error(`서버 오류: ${data}`);
    }
    throw new Error(`네트워크 오류: ${error.message}`);
  }
};

/**
 * 테스트/디버깅용: 사용자의 마지막 학습일 조회
 */
export const getLastActivityDate = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8080/api/users/${userId}/last-activity`);
    if (!response.ok) {
      throw new Error("마지막 학습일을 불러오는데 실패했습니다.");
    }
    const data = await response.json();
    return data.lastActivityDate;
  } catch (error) {
    console.error("getLastActivityDate error:", error);
    throw error;
  }
};


/**
 * 테스트: 특정 사용자의 lastActivityDate를 과거 또는 미래로 설정 (Time Travel Cheat API)
 * 보안: user@test.com 계정만 허용
 * 
 * @param {number|string} userId
 * @param {number} days - 이동할 일수 (항상 0 이상의 양수)
 * @param {string} direction - "PAST" 또는 "FUTURE"
 * @returns {Promise<any>} 서버 응답
 * @throws {Error} 권한 없음(403) 또는 사용자 미존재(400) 등의 오류
 */
export const timeTravelLastActivity = async (userId, days, direction) => {
  try {
    const response = await API.post(`/api/test/time-travel`, { userId, days, direction });
    console.log("✅ Time travel successful:", response.data);
    return {
      success: true,
      message: response.data,
      status: response.status,
    };
  } catch (error) {
    if (error.response) {
      const { status, data } = error.response;
      console.error(`❌ Time travel failed (${status}):`, data);
      
      if (status === 403) {
        throw new Error(`🔒 Access Denied: ${data}`);
      } else if (status === 400) {
        throw new Error(`❌ Invalid Request: ${data}`);
      } else {
        throw new Error(`Server Error: ${data}`);
      }
    } else {
      console.error("❌ Network error:", error.message);
      throw new Error(`Network error: ${error.message}`);
    }
  }
};
