import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WordManager from './components/WordManager'; // 파일 위치가 다르면 경로를 꼭 확인하세요!

// 1. 대문이 될 메인 페이지 (Home)
const Home = () => (
  <div style={{ textAlign: 'center', marginTop: '100px', fontFamily: 'Arial' }}>
    <h1 style={{ fontSize: '3rem', color: '#2563eb' }}>Word Tower 🗼</h1>
    <p>토익 정복을 위한 똑똑한 단어장</p>
    <div style={{ marginTop: '30px' }}>
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

// 2. 전체 페이지 길 안내 (Routing)
function App() {
  return (
    <Router>
      <Routes>
        {/* http://localhost:3000 접속 시 */}
        <Route path="/" element={<Home />} />
        
        {/* http://localhost:3000/admin 접속 시 */}
        <Route path="/admin" element={<WordManager />} />
      </Routes>
    </Router>
  );
}

export default App;