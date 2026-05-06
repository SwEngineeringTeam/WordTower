
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// 페이지 컴포넌트들 (위치에 맞게 import)
import Homepage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import WordManager from './components/WordManager';
import MemoryCard from './components/MemoryCard';
import DailyQuiz from "./components/DailyQuiz";


const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
    <h1 style={{ fontSize: '3rem', color: '#2563eb' }}>Word Tower 🗼</h1>
    <p>토익 정복을 위한 똑똑한 단어장</p>
    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
      {/* 1. 메모리카드 학습 버튼 (새로 추가됨) */}
      <Link to="/user">
        <button style={{
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          backgroundColor: '#29B6F6', // 원하셨던 하늘색 포인트
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          오늘의 단어 학습하기 🎴
        </button>
      </Link>
      <Link to="/admin">
        <button style={{
          padding: '12px 24px',
          fontSize: '1rem',
          cursor: 'pointer',
          backgroundColor: '#2563eb',
          color: 'white',
          border: 'none',
          borderRadius: '8px'
        }}>
          관리자 페이지 (단어 입력)
        </button>
      </Link>
    </div>
  </div>
);


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

        <Route path="/user" element={<MemoryCard />} />

        <Route path="/DailyQuiz" element={<DailyQuiz />} />
      </Routes>
    </Router>
  );
}

export default App;
