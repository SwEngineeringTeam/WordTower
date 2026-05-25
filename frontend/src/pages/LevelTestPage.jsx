import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/axiosConfig";

const shuffle = (items) => {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

/**
 * 해당 티어의 5개 유닛 단어를 모아 레벨테스트 단어를 만듭니다.
 */
const fetchTierWords = async (tier) => {
  const startUnit = (tier - 1) * 5 + 1;
  const requests = Array.from({ length: 5 }, (_, index) => {
    const unitId = startUnit + index;
    return API.get(`/api/words/unit?unitId=${unitId}&limit=10&t=${Date.now()}`);
  });
  const responses = await Promise.all(requests);
  return responses.flatMap((res) => (Array.isArray(res.data) ? res.data : []));
};

/**
 * LevelTestPage: 15문제 중 10개 이상 정답 시 다음 티어를 엽니다.
 */
const LevelTestPage = () => {
  const navigate = useNavigate();
  const { tier: tierParam } = useParams();
  const tier = Number(tierParam) || 1;
  const userId = localStorage.getItem("userId");

  const [words, setWords] = useState([]);
  const [current, setCurrent] = useState(0);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTierWords(tier)
      .then((data) => setWords(shuffle(data).slice(0, 15)))
      .catch(() => setError("레벨테스트 단어를 불러오지 못했습니다."))
      .finally(() => setLoading(false));
  }, [tier]);

  const question = words[current];
  const isDone = words.length > 0 && results.length === words.length;
  const correctCount = results.filter((item) => item.correct).length;
  const passed = isDone && correctCount >= 10;

  const choices = useMemo(() => {
    if (!question) return [];
    const wrongMeanings = words
      .filter((word) => word.id !== question.id)
      .map((word) => word.meaning);
    return shuffle([question.meaning, ...shuffle(wrongMeanings).slice(0, 3)]);
  }, [question, words]);

  /**
   * 선택한 뜻을 채점하고 다음 문제로 넘어갑니다.
   */
  const handleChoice = (meaning) => {
    if (selected || !question) return;

    const correct = meaning === question.meaning;
    setSelected(meaning);
    setResults((prev) => [
      ...prev,
      { word: question.word, meaning: question.meaning, userAnswer: meaning, correct },
    ]);

    setTimeout(() => {
      setSelected(null);
      setCurrent((prev) => prev + 1);
    }, 450);
  };

  /**
   * 통과 시 서버와 로컬 진행도를 다음 티어로 갱신합니다.
   */
  const handlePass = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    try {
      const res = await API.post(`/api/users/${userId}/level-test/pass?tier=${tier}`);
      const nextTierUnit = tier * 5 + 1;
      const openedUnit = Math.max(Number(res.data) || 1, nextTierUnit);
      localStorage.setItem(`levelTestPassed_tier_${tier}`, "true");
      localStorage.setItem("unlockedUnits", String(openedUnit));
      navigate("/user");
    } catch (e) {
      setError("다음 티어 오픈에 실패했습니다.");
    }
  };

  if (loading) return <div style={styles.center}>레벨테스트 준비 중...</div>;
  if (error) return <div style={styles.center}>{error}</div>;
  if (words.length < 4) return <div style={styles.center}>레벨테스트 단어가 부족합니다.</div>;

  if (isDone) {
    return (
      <div style={styles.page}>
        <section style={styles.card}>
          <h1 style={styles.title}>{passed ? "레벨테스트 통과" : "레벨테스트 실패"}</h1>
          <p style={styles.score}>{correctCount} / {words.length}</p>
          {passed ? (
            <button style={styles.primaryBtn} onClick={handlePass}>다음 티어로 이동</button>
          ) : (
            <button style={styles.primaryBtn} onClick={() => navigate("/user")}>현재 티어 유지</button>
          )}
        </section>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <section style={styles.card}>
        <div style={styles.top}>
          <span>Tier {tier} Level Test</span>
          <span>{current + 1} / {words.length}</span>
        </div>
        <h1 style={styles.word}>{question.word}</h1>
        <div style={styles.choiceGrid}>
          {choices.map((meaning, index) => {
            const isSelected = selected === meaning;
            const isAnswer = meaning === question.meaning;
            return (
              <button
                key={`${meaning}-${index}`}
                style={{
                  ...styles.choiceBtn,
                  ...(isSelected && isAnswer ? styles.correctBtn : {}),
                  ...(isSelected && !isAnswer ? styles.wrongBtn : {}),
                }}
                onClick={() => handleChoice(meaning)}
              >
                {meaning}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#F4F7FB",
    padding: "24px",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#555",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    background: "#FFFFFF",
    border: "1px solid #E5E7EB",
    borderRadius: "8px",
    padding: "28px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
  },
  top: {
    display: "flex",
    justifyContent: "space-between",
    color: "#6B7280",
    fontSize: "14px",
    marginBottom: "28px",
  },
  title: {
    margin: "0 0 12px",
    fontSize: "28px",
    color: "#111827",
    textAlign: "center",
  },
  word: {
    margin: "0 0 28px",
    fontSize: "42px",
    color: "#111827",
    textAlign: "center",
  },
  score: {
    textAlign: "center",
    fontSize: "22px",
    color: "#374151",
    marginBottom: "24px",
  },
  choiceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },
  choiceBtn: {
    minHeight: "64px",
    padding: "14px",
    border: "1px solid #CBD5E1",
    borderRadius: "8px",
    background: "#F8FAFC",
    color: "#111827",
    fontSize: "16px",
    cursor: "pointer",
  },
  correctBtn: {
    background: "#DCFCE7",
    borderColor: "#22C55E",
  },
  wrongBtn: {
    background: "#FEE2E2",
    borderColor: "#EF4444",
  },
  primaryBtn: {
    width: "100%",
    minHeight: "48px",
    border: "none",
    borderRadius: "8px",
    background: "#2563EB",
    color: "#FFFFFF",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default LevelTestPage;
