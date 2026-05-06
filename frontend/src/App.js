import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트들 (위치에 맞게 import)
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserMainPage from "./pages/UserMainPage";
import QuizPage from "./pages/QuizPage";
import WordManager from "./components/WordManager"; // 기존 관리자 컴포넌트

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 메인 홈페이지 */}
        <Route path="/" element={<Homepage />} />

        {/* 2. 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. 일반 유저 메인 대시보드 */}
        <Route path="/user" element={<UserMainPage />} />
        <Route path="/quiz/:unitId" element={<QuizPage />} />

        {/* 4. 관리자 페이지 */}
        <Route path="/admin" element={<WordManager />} />
      </Routes>
    </Router>
  );
}

export default App;
