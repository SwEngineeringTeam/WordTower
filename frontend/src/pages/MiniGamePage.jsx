import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * 미니게임 페이지
 * - 해당 유닛 단어 10개로 단어-뜻 선 잇기 게임
 */
const MiniGamePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const unitId = new URLSearchParams(location.search).get("unitId") || "1";

  const [leftList, setLeftList] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [selected, setSelected] = useState({ left: null, right: null });
  const [matches, setMatches] = useState([]);
  const [wrongs, setWrongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);
  const [lines, setLines] = useState([]);

  const svgRef = useRef(null);
  const leftRefs = useRef({});
  const rightRefs = useRef({});

  // ── 단어 불러오기 ──────────────────────────────────────────────
  useEffect(() => {
    fetch(`/api/words/unit?unitId=${unitId}&limit=10`)
      .then(r => r.json())
      .then(data => {
        if (!Array.isArray(data) || data.length === 0) return;
        setLeftList([...data].sort(() => Math.random() - 0.5));
        setRightList([...data].sort(() => Math.random() - 0.5));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [unitId]);

  // ── SVG 선 좌표 계산 ───────────────────────────────────────────
  // 수정 후 (왼쪽 카드는 오른쪽 끝, 오른쪽 카드는 왼쪽 끝에서 연결)
  const getLeftEdge = (el, svgEl) => {
    if (!el || !svgEl) return null;
    const elRect  = el.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();
    return {
      x: elRect.right - svgRect.left,   // ✅ 오른쪽 끝
      y: elRect.top + elRect.height / 2 - svgRect.top,
    };
  };

  const getRightEdge = (el, svgEl) => {
    if (!el || !svgEl) return null;
    const elRect  = el.getBoundingClientRect();
    const svgRect = svgEl.getBoundingClientRect();
    return {
      x: elRect.left - svgRect.left,    // ✅ 왼쪽 끝
      y: elRect.top + elRect.height / 2 - svgRect.top,
    };
  };

  // 수정 후
  const calculateLines = useCallback(() => {
    if (!svgRef.current) return;
    const newLines = matches.map(m => {
      const leftEl  = leftRefs.current[m.leftId];
      const rightEl = rightRefs.current[m.rightId];
      const from = getLeftEdge(leftEl, svgRef.current);   // ✅ 왼쪽 카드 오른쪽 끝
      const to   = getRightEdge(rightEl, svgRef.current); // ✅ 오른쪽 카드 왼쪽 끝
      if (!from || !to) return null;
      return { ...m, x1: from.x, y1: from.y, x2: to.x, y2: to.y };
    }).filter(Boolean);
    setLines(newLines);
  }, [matches]);

  useEffect(() => {
    if (!loading) calculateLines();
  }, [loading, calculateLines]);

  useEffect(() => {
    window.addEventListener("resize", calculateLines);
    return () => window.removeEventListener("resize", calculateLines);
  }, [calculateLines]);

  // ── 선택 로직 ──────────────────────────────────────────────────
  const handleLeftClick = (item) => {
    if (matches.some(m => m.leftId === item.id)) return;
    setSelected(prev => ({ ...prev, left: item }));
  };

  const handleRightClick = (item) => {
    if (matches.some(m => m.rightId === item.id)) return;
    setSelected(prev => ({ ...prev, right: item }));
  };

  useEffect(() => {
    if (!selected.left || !selected.right) return;

    const isCorrect = selected.left.meaning === selected.right.meaning;

    if (isCorrect) {
      const newMatch = { leftId: selected.left.id, rightId: selected.right.id };
      const newMatches = [...matches, newMatch];
      setMatches(newMatches);
      setSelected({ left: null, right: null });
      if (newMatches.length === leftList.length) {
        setTimeout(() => setFinished(true), 400);
      }
    } else {
      setWrongs([selected.left.id + "_left", selected.right.id + "_right"]);
      setTimeout(() => {
        setWrongs([]);
        setSelected({ left: null, right: null });
      }, 600);
    }
  }, [selected, matches, leftList.length]);

  // ── 다시하기 ───────────────────────────────────────────────────
  const handleRetry = () => {
    setMatches([]);
    setSelected({ left: null, right: null });
    setWrongs([]);
    setLines([]);
    setFinished(false);
    setLeftList(prev => [...prev].sort(() => Math.random() - 0.5));
    setRightList(prev => [...prev].sort(() => Math.random() - 0.5));
  };

  // ── 카드 색상 결정 ─────────────────────────────────────────────
  const getLeftStyle = (item) => {
    if (matches.some(m => m.leftId === item.id))  return styles.cardMatched;
    if (wrongs.includes(item.id + "_left"))        return styles.cardWrong;
    if (selected.left?.id === item.id)             return styles.cardSelected;
    return styles.card;
  };

  const getRightStyle = (item) => {
    if (matches.some(m => m.rightId === item.id)) return styles.cardMatched;
    if (wrongs.includes(item.id + "_right"))       return styles.cardWrong;
    if (selected.right?.id === item.id)            return styles.cardSelected;
    return styles.card;
  };

  if (loading) return <div style={styles.center}>단어 불러오는 중...</div>;

  return (
    <div style={styles.page}>

      {/* 상단 바 */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← 뒤로가기</button>
        <h2 style={styles.title}>Unit {unitId} 매칭 게임</h2>
        <button style={styles.retryBtn} onClick={handleRetry}>↺ 다시하기</button>
      </div>

      <p style={styles.desc}>단어와 뜻을 클릭해서 짝을 맞춰보세요!</p>

      {/* 완료 배너 */}
      {finished && (
        <div style={styles.finishBanner}>
          🎉 완벽해요! 모두 맞췄어요!
          <button style={styles.finishBtn} onClick={handleRetry}>다시 하기</button>
          <button style={styles.finishBtn} onClick={() => navigate("/user")}>홈으로</button>
        </div>
      )}

      {/* 게임 영역 */}
      <div style={styles.gameArea} ref={svgRef}>

        {/* SVG 선 레이어 */}
        <svg style={styles.svg}>
          {lines.map((line, i) => (
            <line
              key={i}
              x1={line.x1} y1={line.y1}
              x2={line.x2} y2={line.y2}
              stroke="#4CAF50"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          ))}
        </svg>

        {/* 왼쪽: 영어 단어 */}
        <div style={styles.column}>
          {leftList.map(item => (
            <div
              key={item.id}
              ref={el => { leftRefs.current[item.id] = el; }}
              style={getLeftStyle(item)}
              onClick={() => handleLeftClick(item)}
            >
              {item.word}
            </div>
          ))}
        </div>

        {/* 오른쪽: 한국어 뜻 */}
        <div style={styles.column}>
          {rightList.map(item => (
            <div
              key={item.id}
              ref={el => { rightRefs.current[item.id] = el; }}
              style={getRightStyle(item)}
              onClick={() => handleRightClick(item)}
            >
              {item.meaning}
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh", backgroundColor: "#F9FAFB",
    fontFamily: "'Noto Sans KR', sans-serif",
    padding: "24px 20px", maxWidth: "800px", margin: "0 auto",
  },
  center: {
    display: "flex", alignItems: "center", justifyContent: "center",
    minHeight: "100vh", color: "#AAA", fontSize: "14px",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  topBar: {
    display: "flex", alignItems: "center",
    justifyContent: "space-between", marginBottom: "8px",
  },
  backBtn: {
    padding: "8px 14px", borderRadius: "8px",
    border: "1px solid #E5E7EB", backgroundColor: "#fff",
    cursor: "pointer", fontSize: "14px", color: "#555",
  },
  retryBtn: {
    padding: "8px 14px", borderRadius: "8px",
    border: "1px solid #E5E7EB", backgroundColor: "#fff",
    cursor: "pointer", fontSize: "14px", color: "#555",
  },
  title: { fontSize: "20px", fontWeight: "700", color: "#1a1a2e", margin: 0 },
  desc: { fontSize: "13px", color: "#888", marginBottom: "20px", textAlign: "center" },
  finishBanner: {
    backgroundColor: "#E8F5E9", border: "1px solid #A5D6A7",
    borderRadius: "12px", padding: "16px 24px",
    textAlign: "center", fontSize: "18px", fontWeight: "600",
    color: "#2E7D32", marginBottom: "20px",
    display: "flex", alignItems: "center", justifyContent: "center", gap: "12px",
  },
  finishBtn: {
    padding: "8px 16px", borderRadius: "8px", border: "none",
    backgroundColor: "#29B6F6", color: "#fff", fontSize: "13px", cursor: "pointer",
  },
  // 수정 후
  gameArea: {
    position: "relative", display: "flex",
    justifyContent: "space-between",
    gap: "80px",  // ✅ 가운데 여백 넓혀서 선이 지나갈 공간 확보
  },
  svg: {
    position: "absolute", top: 0, left: 0,
    width: "100%", height: "100%",
    pointerEvents: "none", overflow: "visible",
    zIndex: 0,  // ✅ 카드 뒤에 위치
  },
  column: {
    display: "flex", flexDirection: "column",
    gap: "6px",   // ✅ 카드 간격 줄임
    width: "200px",  // ✅ flex:1 대신 고정 너비
    zIndex: 1,
  },
  card: {
    padding: "8px 12px",       // ✅ 패딩 줄임
    borderRadius: "8px",
    border: "2px solid #E5E7EB", backgroundColor: "#fff",
    fontSize: "13px",           // ✅ 폰트 줄임
    fontWeight: "500", color: "#111",
    cursor: "pointer", textAlign: "center",
    transition: "all 0.15s ease", userSelect: "none",
  },
  cardSelected: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "2px solid #29B6F6", backgroundColor: "#E3F2FD",
    fontSize: "13px", fontWeight: "500", color: "#0277BD",
    cursor: "pointer", textAlign: "center",
    transition: "all 0.15s ease", userSelect: "none",
  },
  cardMatched: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "2px solid #4CAF50", backgroundColor: "#E8F5E9",
    fontSize: "13px", fontWeight: "500", color: "#2E7D32",
    cursor: "default", textAlign: "center",
    transition: "all 0.15s ease", userSelect: "none", opacity: 0.8,
  },
  cardWrong: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "2px solid #EF5350", backgroundColor: "#FFEBEE",
    fontSize: "13px", fontWeight: "500", color: "#C62828",
    cursor: "pointer", textAlign: "center",
    transition: "all 0.15s ease", userSelect: "none",
  },
};

export default MiniGamePage;