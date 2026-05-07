import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { submitQuizAndUpdateStreak } from "../services/streakService";

const themeColor = '#29B6F6';

// ── API ──────────────────────────────────────────────────────────────────────

const fetchWrongWords = async (limit = 5) => {
  const res = await fetch(`/api/words/wrong?limit=${limit}`);
  if (!res.ok) throw new Error('오답 단어를 불러오지 못했습니다.');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
};

const saveWrongWord = async (word) => {
  await fetch(`/api/words/wrong`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wordId: word.id, word: word.word, meaning: word.meaning }),
  });
};

const deleteWrongWord = async (wordId) => {
  await fetch(`/api/words/wrong/${wordId}`, { method: 'DELETE' });
};

// ── 유틸 ─────────────────────────────────────────────────────────────────────

const normalize = (str) => str.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '');

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── 스타일 ────────────────────────────────────────────────────────────────────

const S = {
  page: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    minHeight: '100vh', backgroundColor: '#F9FAFB',
    fontFamily: "'Noto Sans KR', sans-serif",
    padding: '1.5rem 1rem 2.5rem', gap: '1.2rem',
  },
  center: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: '100vh', fontFamily: "'Noto Sans KR', sans-serif",
    color: '#AAA', fontSize: '14px',
  },
  topBar: {
    width: '100%', maxWidth: '560px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  iconBtn: {
    width: '36px', height: '36px', borderRadius: '50%',
    border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    cursor: 'pointer', fontSize: '16px', color: '#555',
  },
  card: {
    width: '100%', maxWidth: '560px',
    backgroundColor: '#FFFFFF',
    borderRadius: '16px', border: '1px solid #E5E7EB',
    overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
  },
  input: (submitted, isCorrect) => ({
    width: '100%', padding: '13px 16px', borderRadius: '10px',
    fontSize: '18px', fontFamily: "'Noto Sans KR', sans-serif",
    fontWeight: '500', letterSpacing: '0.5px', outline: 'none',
    boxSizing: 'border-box',
    border: submitted
      ? `2px solid ${isCorrect ? '#4CAF50' : '#EF5350'}`
      : '2px solid #E5E7EB',
    backgroundColor: submitted ? (isCorrect ? '#F1F8E9' : '#FFF8F8') : '#FAFAFA',
    color: '#111', transition: 'border-color 0.2s ease, background-color 0.2s ease',
  }),
  feedback: (isCorrect) => ({
    display: 'flex', alignItems: 'center', gap: '8px',
    padding: '12px 14px', borderRadius: '10px',
    backgroundColor: isCorrect ? '#E8F5E9' : '#FFEBEE',
  }),
  btnPrimary: {
    width: '100%', padding: '13px 0', borderRadius: '10px', border: 'none',
    backgroundColor: themeColor, color: '#FFFFFF',
    fontSize: '14px', fontWeight: '500', cursor: 'pointer',
  },
  btnSecondary: {
    flex: 1, padding: '12px 0', borderRadius: '10px',
    border: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
    fontSize: '14px', cursor: 'pointer', color: '#555',
  },
  resultRow: (bg, borderColor) => ({
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: bg, borderRadius: '10px', border: `1px solid ${borderColor}`,
    padding: '12px 16px', marginBottom: '6px',
  }),
};

// ── 점수 박스 ─────────────────────────────────────────────────────────────────

function ScoreBox({ count, label, color, bg }) {
  return (
    <div style={{ textAlign: 'center', backgroundColor: bg, borderRadius: '12px', padding: '16px 32px' }}>
      <div style={{ fontSize: '28px', fontWeight: '600', color }}>{count}</div>
      <div style={{ fontSize: '12px', color, opacity: 0.8, marginTop: '4px' }}>{label}</div>
    </div>
  );
}

// ── 결과 화면 ─────────────────────────────────────────────────────────────────

function ResultScreen({ results, quizWords, onRetry, onHome }) {
  const correctCount = results.filter(r => r.correct).length;
  const wrongCount = results.length - correctCount;

  return (
    <div style={S.page}>
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
          {correctCount === results.length ? '🏆' : '📝'}
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#111', margin: '0 0 8px' }}>
          퀴즈 완료!
        </h2>
        <p style={{ fontSize: '14px', color: '#888', margin: 0 }}>
          {results.length}문제 중 {correctCount}개 정답
        </p>
      </div>

      {/* 점수 요약 */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <ScoreBox count={correctCount} label="정답" color="#388E3C" bg="#E8F5E9" />
        <ScoreBox count={wrongCount}   label="오답" color="#C62828" bg="#FFEBEE" />
      </div>

      {/* 오답 목록 */}
      {wrongCount > 0 && (
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>오답 목록</p>
          {results.filter(r => !r.correct).map((r, i) => (
            <div key={i} style={S.resultRow('#FFF8F8', '#FFCDD2')}>
              <div>
                <span style={{ fontWeight: '500', color: '#111', fontSize: '15px' }}>{r.word}</span>
                <span style={{ color: '#AAA', fontSize: '13px', marginLeft: '10px' }}>{r.meaning}</span>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#C62828' }}>
                내 답: {r.userAnswer || '(미입력)'}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 전체 결과 */}
      <div style={{ width: '100%', maxWidth: '560px' }}>
        <p style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>전체 결과</p>
        {results.map((r, i) => (
          <div key={i} style={S.resultRow(r.correct ? '#F1F8E9' : '#FFF8F8', r.correct ? '#C5E1A5' : '#FFCDD2')}>
            <div>
              <span style={{ fontWeight: '500', color: '#111', fontSize: '15px' }}>{r.word}</span>
              <span style={{ color: '#AAA', fontSize: '13px', marginLeft: '10px' }}>{r.meaning}</span>
            </div>
            <span style={{ fontSize: '16px' }}>{r.correct ? '✅' : '❌'}</span>
          </div>
        ))}
      </div>

      {/* 버튼 */}
      <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '560px', paddingBottom: '2rem' }}>
        <button
            onClick={onHome}
            style={{ ...S.btnSecondary, flex: 1 }}
        >
            홈으로
        </button>

        <button
            onClick={onRetry}
            style={{ ...S.btnPrimary, flex: 3 }}
        >
            다시 풀기
        </button>
    </div>
    </div>
  );
}

// ── 메인 퀴즈 컴포넌트 ───────────────────────────────────────────────────────

export default function DailyQuiz() {
  const navigate = useNavigate();
  const location = useLocation();
  const { unitId } = useParams();

  const userId = localStorage.getItem("userId") || "1";
  const todayWords = location.state?.words ?? [];

  const [quizWords, setQuizWords] = useState([]);
  const [loading, setLoading]     = useState(true);

  const [current,   setCurrent]   = useState(0);
  const [input,     setInput]     = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [results,   setResults]   = useState([]);
  const [showResult, setShowResult] = useState(false);

  const inputRef = useRef(null);

  // 퀴즈 단어 로딩 (오늘 단어 + 오답 5개)
  const loadQuiz = (baseWords) => {
    fetchWrongWords(5)
      .then((wrongWords) => {
        const solvedIds = JSON.parse(localStorage.getItem("solvedWrongIds") || "[]");
        const filtered = wrongWords.filter(w => !solvedIds.includes(w.id)); // 맞힌 단어 제외
        setQuizWords(shuffle([...baseWords, ...filtered]));
      })
      .catch(()          => setQuizWords(shuffle([...baseWords])))
      .finally(()        => setLoading(false));
  };

  useEffect(() => { loadQuiz(todayWords); }, []); // eslint-disable-line

  useEffect(() => {
    if (!loading && !showResult) inputRef.current?.focus();
  }, [current, loading, showResult]);

  // 다시 풀기
  const handleRetry = () => {
    setCurrent(0); setInput(''); setSubmitted(false);
    setIsCorrect(null); setResults([]); setShowResult(false);
    setLoading(true);
    loadQuiz(todayWords);
  };

  if (loading) return <div style={S.center}>퀴즈를 준비하는 중...</div>;
  if (quizWords.length === 0) return <div style={S.center}>퀴즈에 사용할 단어가 없습니다.</div>;

  if (showResult) return (
    <ResultScreen
      results={results}
      quizWords={quizWords}
      onRetry={handleRetry}
      onHome={() => navigate('/user')}
    />
  );

  const q = quizWords[current];
  const progress = (current / quizWords.length) * 100;

  // 제출
  const handleSubmit = async () => {
    if (!input.trim() || submitted) return;
    const correct = normalize(input) === normalize(q.word);
    setIsCorrect(correct);
    setSubmitted(true);
    setResults(prev => [...prev, { word: q.word, meaning: q.meaning, userAnswer: input.trim(), correct }]);

    if (!correct) {
      saveWrongWord(q).catch(() => {});
    } else if (q.id) {
      deleteWrongWord(q.id).catch(() => {});
      // 맞힌 단어를 다음 퀴즈 로딩 시 제외하기 위해 로컬에 기록
      const solved = JSON.parse(localStorage.getItem("solvedWrongIds") || "[]");
      if (!solved.includes(q.id)) {
        localStorage.setItem("solvedWrongIds", JSON.stringify([...solved, q.id]));
      }
    }
  };

  // 다음 문제
  const handleNext = async () => {
    if (current < quizWords.length - 1) {
      setCurrent(c => c + 1);
      setInput('');
      setSubmitted(false);
      setIsCorrect(null);
      return;
    }

    if (!userId) {
      navigate("/login");
      return;
    }

    // 프론트 화면 반영용: 다음 유닛 열기
    const nextUnit = Number(unitId) + 1;
    localStorage.setItem("unlockedUnits", String(nextUnit));

    // 프론트 화면 반영용: 스트릭 1 증가
    const currentLocalStreak = Number(localStorage.getItem("streak")) || 0;
    localStorage.setItem("streak", String(currentLocalStreak + 1));

    try {
      const result = await submitQuizAndUpdateStreak(Number(userId), Number(unitId));
      console.log("퀴즈 완료 → unit/streak 갱신 성공:", result);
    } catch (error) {
      console.error("백엔드 갱신 실패. 프론트에는 임시 반영됨:", error);
    }

    setShowResult(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { submitted ? handleNext() : handleSubmit(); }
  };

  return (
    <div style={S.page}>

      {/* 상단 바 */}
      <div style={S.topBar}>
        <button onClick={() => navigate('/user')} style={S.iconBtn}>⌂</button>
        <div style={{ fontSize: '14px', color: '#888' }}>
          <span style={{ fontWeight: '500', color: '#111' }}>{current + 1}</span>
          <span> / {quizWords.length}</span>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* 프로그레스 바 */}
      <div style={{ width: '100%', maxWidth: '560px', height: '4px', backgroundColor: '#E5E7EB', borderRadius: '2px' }}>
        <div style={{
          height: '100%', borderRadius: '2px', backgroundColor: themeColor,
          width: `${progress}%`, transition: 'width 0.3s ease',
        }} />
      </div>

      {/* 문제 카드 */}
      <div style={S.card}>
        {/* 뜻 표시 */}
        <div style={{
          padding: '40px 28px 32px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px',
          borderBottom: '1px solid #F3F4F6',
        }}>
          <div style={{ fontSize: '11px', letterSpacing: '0.1em', color: '#AAAAAA', textTransform: 'uppercase' }}>
            한국어 → 영어
          </div>
          <div style={{
            fontSize: '36px', fontWeight: '600', color: '#111',
            textAlign: 'center', lineHeight: 1.3, letterSpacing: '-0.5px',
          }}>
            {q.meaning}
          </div>
        </div>

        {/* 입력 영역 */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => !submitted && setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="영어 단어를 입력하세요"
            disabled={submitted}
            style={S.input(submitted, isCorrect)}
          />

          {/* 피드백 */}
          {submitted && (
            <div style={S.feedback(isCorrect)}>
              <span style={{ fontSize: '20px' }}>{isCorrect ? '✅' : '❌'}</span>
              {isCorrect
                ? <span style={{ fontSize: '14px', color: '#388E3C', fontWeight: '500' }}>정답이에요!</span>
                : <span style={{ fontSize: '14px', color: '#C62828', fontWeight: '500' }}>
                    정답: <span style={{ letterSpacing: '0.5px' }}>{q.word}</span>
                  </span>
              }
            </div>
          )}

          {/* 버튼 */}
          {!submitted ? (
            <button
              onClick={handleSubmit}
              disabled={!input.trim()}
              style={{ ...S.btnPrimary, opacity: input.trim() ? 1 : 0.4, cursor: input.trim() ? 'pointer' : 'not-allowed' }}
            >
              확인
            </button>
          ) : (
            <button onClick={handleNext} style={S.btnPrimary}>
              {current < quizWords.length - 1 ? '다음 문제 > ' : '결과 보기'}
            </button>
          )}

          <p style={{ textAlign: 'center', fontSize: '12px', color: '#CCC', margin: 0 }}>
            Enter 키로도 제출 가능해요
          </p>
        </div>
      </div>

      {/* 점 네비게이터 */}
      <div style={{ display: 'flex', gap: '5px', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', maxWidth: '560px' }}>
        {quizWords.map((_, i) => {
          const r = results[i];
          let bg = '#E0E0E0';
          if (i === current)      bg = themeColor;
          else if (r?.correct)    bg = '#4CAF50';
          else if (r && !r.correct) bg = '#EF5350';
          return (
            <div key={i} style={{
              width: i === current ? '10px' : '8px',
              height: i === current ? '10px' : '8px',
              borderRadius: '50%', backgroundColor: bg,
              transition: 'all 0.2s ease',
            }} />
          );
        })}
      </div>

    </div>
  );
}