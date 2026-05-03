import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WordManager from './components/WordManager';
import MemoryCard from './components/MemoryCard';

const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
    <h1 style={{ fontSize: '3rem', color: '#2563eb' }}>Word Tower 🗼</h1>
    <p>토익 정복을 위한 똑똑한 단어장</p>
    <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'center', gap: '15px' }}>
      {/* 1. 메모리카드 학습 버튼 (새로 추가됨) */}
      <Link to="/memory">
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
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<WordManager />} />
        <Route path="/memory" element={<MemoryCard />} />
      </Routes>
    </Router>
  );
}

export default App;