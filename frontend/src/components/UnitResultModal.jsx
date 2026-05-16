import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUnitResult } from "../services/unitService";
import "../style/UnitResultModal.css";

/**
 * 완료된 유닛 클릭 시 보여주는 결과 요약 모달
 * - 퀴즈 정답률 표시
 * - [단어 다시 보기] [틀린 단어 복습] [퀴즈 다시 풀기] [뒤로가기] 버튼
 *
 * @param {number}   unitId   - 조회할 유닛 ID
 * @param {string}   unitName - 유닛 표시명 (ex. "Unit 3")
 * @param {Function} onClose  - 모달 닫기 콜백
 */
const UnitResultModal = ({ unitId, unitName, onClose }) => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 해당 유닛의 결과 데이터 불러오기
  useEffect(() => {
    const fetchResult = async () => {
      try {
        const data = await getUnitResult(unitId);
        setResult(data);
      } catch (error) {
        console.error("유닛 결과 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [unitId]);

  // 정답률에 따른 색상 결정
  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 80) return "#4caf50"; // 초록 (우수)
    if (accuracy >= 50) return "#ff9800"; // 주황 (보통)
    return "#f44336";                     // 빨강 (미흡)
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      {/* 클릭 이벤트 버블링 방지 */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>

        {loading ? (
          <div className="modal-loading">결과 불러오는 중...</div>
        ) : (
          <>
            {/* 유닛 제목 */}
            <h2 className="modal-title">{unitName} 학습 결과</h2>

            {/* 퀴즈 정답률 */}
            <div className="accuracy-section">
              <span className="accuracy-label">퀴즈 정답률</span>
              <span
                className="accuracy-value"
                style={{ color: getAccuracyColor(result?.quizAccuracy) }}
              >
                {result?.quizAccuracy ?? 0}%
              </span>
              <span className="accuracy-detail">
                ({result?.correctCount ?? 0} / {result?.totalQuestions ?? 0} 문제)
              </span>
            </div>

            {/* 틀린 단어 수 요약 */}
            {result?.wrongWords?.length > 0 && (
              <p className="wrong-word-summary">
                ⚠️ 틀린 단어 <strong>{result.wrongWords.length}개</strong>가 있어요. 복습해보세요!
              </p>
            )}

            <div className="modal-buttons">

              <button
                className="modal-btn btn-review"
                onClick={() => navigate(`/memory-card?unitId=${unitId}`)}
              >
                📖 단어 다시 보기
              </button>

              <button
                className="modal-btn btn-wrong"
                onClick={() =>
                  navigate(`/wrong-word-review`, {
                    state: {
                      wrongWords: result.wrongWords,
                      unitName: unitName
                    }
                  })
                }
                disabled={!result?.wrongWords?.length}
              >
                ❌ 틀린 단어 복습
              </button>

              {/* 뒤로가기 → 전체 너비 */}
              <button className="modal-btn btn-back" onClick={onClose}>
                뒤로가기
              </button>

            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UnitResultModal;