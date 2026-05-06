import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트들 (위치에 맞게 import)
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import WordManager from "./components/WordManager"; // 기존 관리자 컴포넌트

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 메인 홈페이지: 이제 외부 파일(pages/Homepage.jsx)을 사용합니다 */}
        <Route path="/" element={<Homepage />} />

        {/* 2. 로그인 페이지: 새로 추가 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. 관리자 페이지: 기존 WordManager 연결 */}
        <Route path="/admin" element={<WordManager />} />

        {/* 4. (선택) 일반 유저용 대시보드가 있다면 추가 */}
        {/* <Route path="/user" element={<UserDashboard />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
