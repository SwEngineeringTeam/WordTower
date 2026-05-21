
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 페이지 컴포넌트들 (위치에 맞게 import)
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import UserMainPage from "./pages/UserMainPage";
import MiniGamePage from "./pages/MiniGamePage"; // ✅ 추가

// 기존 관리자 컴포넌트
import WordManager from './components/WordManager';
import MemoryCard from './components/MemoryCard';
import DailyQuiz from "./components/DailyQuiz";
import WrongWordReviewPage from "./pages/WrongWordReviewPage"; // ← 추가



function App() {
  return (
    <Router>
      <Routes>


        {/* 1. 메인 홈페이지: 이제 외부 파일(pages/Homepage.jsx)을 사용합니다 */}
        <Route path="/" element={<Homepage />} />

        {/* 2. 로그인 페이지 */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. 일반 유저 메인 대시보드 */}
        <Route path="/user" element={<UserMainPage />} />
        <Route path="/quiz/:unitId" element={<DailyQuiz />} />

        {/* 4. 관리자 페이지 */}
        <Route path="/admin" element={<WordManager />} />
        <Route path="/memory-card" element={<MemoryCard />} />
        <Route path="/wrong-word-review" element={<WrongWordReviewPage />} /> 
        <Route path="/mini-game" element={<MiniGamePage />} />
      </Routes>
    </Router>
  );
}

export default App;
