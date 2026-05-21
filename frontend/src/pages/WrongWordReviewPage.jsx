import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

/**
 * 틀린 단어 복습 페이지
 * - UnitResultModal에서 wrongWords 데이터를 state로 받아서 표시
 */
const WrongWordReviewPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // UnitResultModal에서 navigate 시 state로 전달받은 틀린 단어 목록
  const wrongWords = location.state?.wrongWords || [];
  const unitName = location.state?.unitName || "Unit";

  return (
    <div style={styles.page}>

      {/* 상단 바 */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>
          ← 뒤로가기
        </button>
        <h2 style={styles.title}>{unitName} 틀린 단어 복습</h2>
      </div>

      {/* 틀린 단어 없을 때 */}
      {wrongWords.length === 0 ? (
        <div style={styles.emptyBox}>
          <p>🎉 틀린 단어가 없어요! 완벽해요!</p>
        </div>
      ) : (
        <>
          <p style={styles.subtitle}>
            총 <strong>{wrongWords.length}개</strong>의 단어를 틀렸어요. 다시 확인해보세요!
          </p>

          {/* 틀린 단어 목록 */}
          <div style={styles.list}>
            {wrongWords.map((word, index) => (
              <div key={index} style={styles.wordCard}>
                <div style={styles.wordLeft}>
                  <span style={styles.wordIndex}>{index + 1}</span>
                  <div>
                    <p style={styles.english}>{word.english}</p>
                    <p style={styles.korean}>{word.korean}</p>
                  </div>
                </div>
                <span style={styles.wrongBadge}>❌</span>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F9FAFB",
    fontFamily: "'Noto Sans KR', sans-serif",
    padding: "24px 20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px",
  },
  backBtn: {
    padding: "8px 14px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    color: "#555",
  },
  title: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: 0,
  },
  subtitle: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "16px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "60px 0",
    color: "#888",
    fontSize: "16px",
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  wordCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: "12px",
    border: "1px solid #FFCDD2",
    padding: "16px 20px",

  },
  wordLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  wordIndex: {
    fontSize: "13px",
    color: "#aaa",
    minWidth: "20px",
  },
  english: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#111",
    margin: 0,
  },
  korean: {
    fontSize: "13px",
    color: "#888",
    margin: "4px 0 0 0",
  },
  wrongBadge: {
    fontSize: "20px",
  },
};

export default WrongWordReviewPage;