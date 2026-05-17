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
    }

    return response.data;
  } catch (error) {
    // 3. 에러 처리
    // axiosConfig에서 인터셉터를 설정했다면 여기서 공통 에러 처리가 가능합니다.
    throw error.response?.data?.message || "로그인 서버 연결 실패";
  }
};

// 💡 [PBI-17 수정] 매개변수 맨 뒤에 toeicScore를 받아오도록 추가했습니다!
export const register = async (email, password, nickname, toeicScore) => {
  try {
    // 로그인과 마찬가지로 설정파일(API)을 사용하여 엔드포인트만 적어줍니다.
    // 자동으로 http://localhost:8080/api/register 로 요청이 날아갑니다.
    const response = await API.post("/api/register", {
      email,
      password,
      nickname,
      toeicScore, // 이제 화면에서 입력받은 값이 정상적으로 담겨 날아갑니다.
    });

    return response.data;
  } catch (error) {
    // 에러 처리 규칙도 로그인과 일치시킵니다.
    throw error.response?.data?.message || "회원가입 서버 연결 실패";
  }
};
