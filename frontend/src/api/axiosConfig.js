import axios from "axios";

// 1. axios 인스턴스 생성
const API = axios.create({
  // 백엔드 서버의 기본 주소 (나중에 배포 시에는 환경 변수로 관리하는 게 좋습니다)
  baseURL: "http://localhost:8080",

  // 요청 타임아웃 설정 (5초)
  timeout: 5000,

  headers: {
    "Content-Type": "application/json",
  },
});

// 2. [선택] 요청 인터셉터 (Request Interceptor)
// 서버로 요청을 보내기 직전에 실행됩니다.
API.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 꺼내 헤더에 넣어줍니다.
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 3. [선택] 응답 인터셉터 (Response Interceptor)
// 서버로부터 응답을 받은 직후에 실행됩니다.
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // 만약 토큰이 만료되어 401 에러가 났다면 로그아웃 처리를 하거나 페이지 이동
    if (error.response && error.response.status === 401) {
      console.error("인증이 만료되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("token");
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default API;
