import React, { useState, useEffect } from 'react';

const themeColor = '#29B6F6';

const fetchWords = async () => {
  const response = await fetch('/api/words/daily?limit=10');
  if (!response.ok) throw new Error('단어를 불러오지 못했습니다.');
  return response.json();
};

const DifficultyStars = ({ difficulty }) => {
  const level = difficulty + 1;
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ fontSize: '16px', color: i <= level ? '#FFB300' : '#E0E0E0', lineHeight: 1 }}>★</span>
      ))}
    </div>
  );
};

// 점 네비게이터
const DotNav = ({ total, current, results }) => (
  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
    {Array.from({ length: total }).map((_, i) => {
      const result = results[i];
      let bg = '#E0E0E0';
      if (i === current) bg = themeColor;
      else if (result === 'correct') bg = '#4CAF50';
      else if (result === 'wrong') bg = '#EF5350';
      return (
        <div key={i} style={{
          width: i === current ? '10px' : '8px',
          height: i === current ? '10px' : '8px',
          borderRadius: '50%',
          backgroundColor: bg,
          transition: 'all 0.2s ease',
        }} />
      );
    })}
  </div>
);

// 홈 화면
function HomeScreen({ onStart }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', backgroundColor: '#F9FAFB',
      fontFamily: "'Noto Sans KR', sans-serif", gap: '2rem', padding: '2rem',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>📖</div>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#111', margin: '0 0 8px' }}>WordTower</h1>
        <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>오늘의 단어 10개를 학습해보세요</p>
      </div>
      <button
        onClick={onStart}
        style={{
          backgroundColor: themeColor, color: '#FFFFFF',
          border: 'none', borderRadius: '12px',
          padding: '14px 48px', fontSize: '16px', fontWeight: '500',
          cursor: 'pointer',
        }}
      >
        시작하기
      </button>
    </div>
  );
}

// 결과 화면
function ResultScreen({ words, results, onRestart, onHome }) {
  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const wrongCount = Object.values(results).filter(r => r === 'wrong').length;
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh', backgroundColor: '#F9FAFB',
      fontFamily: "'Noto Sans KR', sans-serif", padding: '2rem 1rem', gap: '1.5rem',
    }}>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎉</div>
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111', margin: '0 0 8px' }}>학습 완료!</h2>
        <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>오늘의 단어 {words.length}개를 모두 학습했어요</p>
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ textAlign: 'center', backgroundColor: '#E8F5E9', borderRadius: '12px', padding: '16px 28px' }}>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#388E3C' }}>{correctCount}</div>
          <div style={{ fontSize: '12px', color: '#66BB6A', marginTop: '4px' }}>알고 있어요</div>
        </div>
        <div style={{ textAlign: 'center', backgroundColor: '#FFEBEE', borderRadius: '12px', padding: '16px 28px' }}>
          <div style={{ fontSize: '28px', fontWeight: '600', color: '#C62828' }}>{wrongCount}</div>
          <div style={{ fontSize: '12px', color: '#EF5350', marginTop: '4px' }}>모르겠어요</div>
        </div>
      </div>
      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {words.map((w, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            backgroundColor: '#FFFFFF', borderRadius: '10px',
            border: `1px solid ${results[i] === 'correct' ? '#A5D6A7' : results[i] === 'wrong' ? '#EF9A9A' : '#E5E7EB'}`,
            padding: '12px 16px',
          }}>
            <div>
              <span style={{ fontWeight: '500', color: '#111', fontSize: '15px' }}>{w.word}</span>
              <span style={{ color: '#AAA', fontSize: '13px', marginLeft: '10px' }}>{w.meaning}</span>
            </div>
            <span style={{ fontSize: '16px' }}>
              {results[i] === 'correct' ? '✅' : results[i] === 'wrong' ? '❌' : ''}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '560px' }}>
        <button onClick={onHome} style={{ flex: 1, padding: '12px 0', borderRadius: '10px', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '14px', cursor: 'pointer', color: '#555' }}>
          홈으로
        </button>
        <button onClick={onRestart} style={{ flex: 1, padding: '12px 0', borderRadius: '10px', border: 'none', backgroundColor: themeColor, color: '#FFFFFF', fontSize: '14px', cursor: 'pointer', fontWeight: '500' }}>
          다시 학습
        </button>
      </div>
    </div>
  );
}

// 메인 카드 화면
function CardScreen({ onHome }) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState({});  // { index: 'correct' | 'wrong' }
  const [showResult, setShowResult] = useState(false);
  const [pressedBtn, setPressedBtn] = useState(null); // 눌림 효과용

  useEffect(() => {
    fetchWords()
      .then(data => { setWords(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  const handleRestart = () => {
    setLoading(true);
    setError(null);
    setCurrent(0);
    setFlipped(false);
    setResults({});
    setShowResult(false);
    setPressedBtn(null);
    fetchWords()
      .then(data => { setWords(data); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#AAA', fontSize: '14px' }}>
      단어를 불러오는 중...
    </div>
  );

  if (error) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif", color: '#EF5350', fontSize: '14px' }}>
      {error}
    </div>
  );

  if (showResult) return (
    <ResultScreen words={words} results={results} onRestart={handleRestart} onHome={onHome} />
  );

  const word = words[current];

  const flipCard = (e) => {
    e?.stopPropagation();
    setFlipped(f => !f);
  };

  const goNext = () => {
    if (current < words.length - 1) {
      setCurrent(c => c + 1);
      setFlipped(false);
      setPressedBtn(null);
    } else {
      setShowResult(true);
    }
  };

  const handleAnswer = (result) => {
    setPressedBtn(result);
    setResults(prev => ({ ...prev, [current]: result }));
    setTimeout(() => goNext(), 500);
  };

  const cardFaceBase = {
    position: 'absolute', inset: 0,
    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
    borderRadius: '16px', border: '1px solid #E5E7EB',
    backgroundColor: '#FFFFFF',
    display: 'flex', flexDirection: 'column', overflow: 'hidden',
  };

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minHeight: '100vh', backgroundColor: '#F9FAFB',
      fontFamily: "'Noto Sans KR', sans-serif",
      padding: '1.5rem 1rem 2.5rem', gap: '1.2rem',
    }}>

      {/* 상단 홈버튼 + 카운트 */}
      <div style={{ width: '100%', maxWidth: '560px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={onHome}
          style={{
            width: '36px', height: '36px', borderRadius: '50%',
            border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', fontSize: '16px', color: '#555',
          }}
        >
          ⌂
        </button>
        <div style={{ fontSize: '14px', color: '#888' }}>
          <span style={{ fontWeight: '500', color: '#111' }}>{current + 1}</span>
          <span> / {words.length}</span>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* 점 네비게이터 */}
      <DotNav total={words.length} current={current} results={results} />

      {/* 카드 */}
      <div
        style={{ width: '100%', maxWidth: '560px', height: '320px', perspective: '1200px', cursor: 'pointer' }}
        onClick={flipCard}
      >
        <div style={{
          width: '100%', height: '100%', position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.55s cubic-bezier(0.4, 0.2, 0.2, 1)',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}>

          {/* 앞면 */}
          <div style={cardFaceBase}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
              <DifficultyStars difficulty={word.difficulty} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#AAAAAA', textTransform: 'uppercase' }}>영어</div>
              <div style={{ fontSize: '52px', fontWeight: '500', color: '#111', letterSpacing: '-1.5px', lineHeight: 1 }}>{word.word}</div>
            </div>
            <button onClick={flipCard} style={{ backgroundColor: themeColor, color: '#FFFFFF', textAlign: 'center', padding: '12px 0', fontSize: '13px', fontWeight: '500', border: 'none', width: '100%', cursor: 'pointer' }}>
              탭하여 뜻 보기
            </button>
          </div>

          {/* 뒷면 */}
          <div style={{ ...cardFaceBase, transform: 'rotateY(180deg)' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #F3F4F6' }}>
              <DifficultyStars difficulty={word.difficulty} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '20px' }}>
              <div style={{ fontSize: '11px', letterSpacing: '0.08em', color: '#AAAAAA', textTransform: 'uppercase' }}>한국어</div>
              <div style={{ fontSize: '40px', fontWeight: '500', color: '#111', letterSpacing: '-1px', lineHeight: 1, textAlign: 'center' }}>
                {word.meaning}
              </div>
            </div>
            <button onClick={flipCard} style={{ backgroundColor: '#FFFFFF', color: '#AAAAAA', textAlign: 'center', padding: '12px 0', fontSize: '13px', fontWeight: '500', border: 'none', width: '100%', cursor: 'pointer' }}>
              탭하여 앞면으로
            </button>
          </div>
        </div>
      </div>

      {/* 네비게이션 화살표 */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); if (current > 0) { setCurrent(c => c - 1); setFlipped(false); setPressedBtn(results[current - 1] || null); } }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '20px', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: '200', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}
        >
          &#8249;
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF', fontSize: '20px', fontFamily: "'Helvetica Neue', sans-serif", fontWeight: '200', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' }}
        >
          &#8250;
        </button>
      </div>

      {/* 알고/모르고 버튼 */}
      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '560px' }}>
        <button
          onClick={() => handleAnswer('wrong')}
          style={{
            flex: 1, padding: '13px 0', borderRadius: '10px', border: 'none',
            fontSize: '13px', fontWeight: '500', cursor: 'pointer',
            transition: 'all 0.15s ease',
            backgroundColor: pressedBtn === 'wrong' ? '#EF5350' : results[current] === 'wrong' ? '#FFCDD2' : '#FFFFFF',
            color: pressedBtn === 'wrong' ? '#FFFFFF' : results[current] === 'wrong' ? '#C62828' : '#C62828',
            outline: pressedBtn === 'wrong' ? 'none' : '1px solid #EF5350',
            transform: pressedBtn === 'wrong' ? 'scale(0.97)' : 'scale(1)',
            boxShadow: pressedBtn === 'wrong' ? '0 2px 8px rgba(239,83,80,0.35)' : 'none',
          }}
        >
          모르겠어요
        </button>
        <button
          onClick={() => handleAnswer('correct')}
          style={{
            flex: 1, padding: '13px 0', borderRadius: '10px', border: 'none',
            fontSize: '13px', fontWeight: '500', cursor: 'pointer',
            transition: 'all 0.15s ease',
            backgroundColor: pressedBtn === 'correct' ? '#4CAF50' : results[current] === 'correct' ? '#C8E6C9' : '#FFFFFF',
            color: pressedBtn === 'correct' ? '#FFFFFF' : results[current] === 'correct' ? '#388E3C' : '#388E3C',
            outline: pressedBtn === 'correct' ? 'none' : '1px solid #4CAF50',
            transform: pressedBtn === 'correct' ? 'scale(0.97)' : 'scale(1)',
            boxShadow: pressedBtn === 'correct' ? '0 2px 8px rgba(76,175,80,0.35)' : 'none',
          }}
        >
          알고 있어요
        </button>
      </div>
    </div>
  );
}

// 루트 앱
export default function App() {
  const [screen, setScreen] = useState('home'); // 'home' | 'card'

  if (screen === 'home') return <HomeScreen onStart={() => setScreen('card')} />;
  return <CardScreen onHome={() => setScreen('home')} />;
}