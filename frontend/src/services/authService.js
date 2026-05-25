import API from "../api/axiosConfig"; // axios 대신 우리가 만든 설정파일 임포트

export const login = async (email, password) => {
  try {
    // 1. 주소를 다 적을 필요 없이 엔드포인트만 적습니다.
    // axiosConfig에서 baseURL을 http://localhost:8080으로 잡았다면
    // 아래 경로는 자동으로 http://localhost:8080/api/login 이 됩니다.
    const response = await API.post("/api/login", { email, password });

    // 2. 성공 시 데이터 저장
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role); // 'ADMIN' 또는 'USER'
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("nickname", response.data.nickname || "");
      localStorage.setItem("currentStreak", response.data.currentStreak || 0);
      localStorage.setItem("streakFreezeCount", response.data.streakFreezeCount || 0);
      if (response.data.lastActivityDate) {
        localStorage.setItem("lastActivityDate", response.data.lastActivityDate);
      }
      // store email locally so UI can perform conditional rendering for test accounts
      if (response.data.email) {
        localStorage.setItem("email", response.data.email);
      } else {
        // fallback: store the login email argument if backend does not return it
        localStorage.setItem("email", email);
      }
    }

    return response.data;
  } catch (error) {
    // 3. 에러 처리
    // axiosConfig에서 인터셉터를 설정했다면 여기서 공통 에러 처리가 가능합니다.
    throw error.response?.data?.message || "로그인 서버 연결 실패";
  }
};
