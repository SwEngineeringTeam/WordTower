import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserStreak, getUserProgress } from "../services/streakService";
import { getUnitProgress, markUnitAsDone } from "../services/unitProgressService";
import UnitResultModal from "../components/UnitResultModal";
import "../style/UserMainPage.css";


const UserMainPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const nickname = localStorage.getItem("nickname") || "Tower Learner";

  const [streak, setStreak] = useState(0);
  // 열려있는 가장 높은 유닛 번호 (테스트를 위해 로컬 스토리지 우선 사용, 추후 DB 연동 필요)
  const [unlockedUnits, setUnlockedUnits] = useState(
    parseInt(localStorage.getItem("unlockedUnits")) || 1
  ); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStudyDone, setIsStudyDone] = useState(false); // ✅ 추가
  const [isQuizDone, setIsQuizDone] = useState(false);   // ✅ 추가
  const [resultModal, setResultModal] = useState(null); // ← 이 줄 추가

  // 드롭다운 열림/닫힘 상태 관리 (예: { 1: true, 2: false })
  const [expandedTiers, setExpandedTiers] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // 1. 스트릭 가져오기
        const currentStreak = await getUserStreak(Number(userId));
        setStreak(currentStreak);

        // 2. DB에서 유닛 진도 가져오기
        const progress = await getUserProgress(Number(userId));

        const localProgress = parseInt(localStorage.getItem("unlockedUnits")) || 1;
        const finalProgress = Math.max(Number(progress) || 1, localProgress);

        setUnlockedUnits(finalProgress);

        // ✅ 추가: 현재 유닛 완료 상태 조회
        const unitProgress = await getUnitProgress(Number(userId), finalProgress);
        setIsStudyDone(unitProgress.isStudyDone);
        setIsQuizDone(unitProgress.isQuizDone);
        
      } catch (err) {
        console.error("데이터 조회 오류:", err);
        setError("서버에서 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userId]);

  // 수정 후

  const onUnitClick = (unitNum) => {
    if (unitNum > unlockedUnits) return;

    if (unitNum < unlockedUnits) {
      // Number()로 확실하게 숫자 변환
      setResultModal({ unitId: Number(unitNum), unitName: `Unit ${unitNum}` });
    } else {
      navigate(`/memory-card?unitId=${unitNum}`);
    }
  };

  // 드롭다운 토글 함수
  const toggleTier = (tier) => {
    setExpandedTiers((prev) => ({
      ...prev,
      [tier]: !prev[tier],
    }));
  };

  // 현재 층 계산 (1~5유닛 = 1층, 6~10유닛 = 2층...)
  const currentTier = Math.ceil(unlockedUnits / 5) || 1;

  // 특정 층(Tier)의 5개 유닛 버튼을 렌더링하는 함수
  const renderUnits = (tier, isCompletedTier = false) => {
    const startUnit = (tier - 1) * 5 + 1;
    const units = Array.from({ length: 5 }, (_, i) => startUnit + i);

    return (
      <div className="unit-row">
        {units.map((unitNum) => {
          const locked = unitNum > unlockedUnits;
          // 현재 진행 유닛보다 작으면 완료된 유닛
          const isCompleted = unitNum < unlockedUnits;

          return (
            <button
              key={`unit-${unitNum}`}
              className={`unit-card ${locked ? "locked" : isCompleted ? "completed" : "unlocked"}`}
              onClick={() => onUnitClick(unitNum)}
              disabled={locked}
            >
              <span>Unit {unitNum}</span>
              <strong>
                {locked ? "LOCKED" : isCompleted ? "✅ DONE" : "PLAY"}
              </strong>
              {locked && <span className="lock-icon">🔒</span>}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="user-main-page">
      <div className="dashboard-shell">
        <aside className="sidebar">
          <div className="sidebar-logo">Word Tower</div>
          <button className="sidebar-button" onClick={() => navigate("/user")}>대시보드</button>
          <button className="sidebar-button">설정</button>
          <button className="sidebar-button">나의 단어장</button>
          <button className="sidebar-button">복습하기</button>
          <button className="sidebar-button">내 프로필</button>
        </aside>

        <main className="main-panel">
          <section className="top-status">
            <div className="streak-card">
              <div className="streak-icon">🔥</div>
              <div>
                <p className="status-label">연속 학습일</p>
                <h2>{loading ? "..." : streak}</h2>
              </div>
            </div>

            <div className="welcome-card">
              <p>환영합니다, {nickname}님</p>
              <h1>건설 중인 타워에서 오늘의 도전을 확인하세요</h1>
            </div>
          </section>

          <section className="tower-area">
            <div className="tower-skyline">
              <div className="crane-icon">🏗️</div>
              <div className="blueprint-label">Tower Construction</div>
            </div>

            {/* 현재 진행 중인 층 */}
            <div className="tower-board">
              <div className="tower-header">현재 층: Tier {currentTier}</div>
              {renderUnits(currentTier)}
              <div className="action-panel">
                <div>
                  <p className="action-label">현재 진행 유닛</p>
                  <h3>Unit {unlockedUnits}</h3>
                </div>
                <div className="action-buttons">
                  {/* 단어 학습 버튼 */}
                  <button
                    className={`action-btn study-btn ${isStudyDone ? "done" : ""}`}
                    onClick={async () => {
                      try {
                        const parsedUserId = Number(localStorage.getItem("userId"));
                        if (!isNaN(parsedUserId) && parsedUserId > 0) {
                          await markUnitAsDone(parsedUserId, unlockedUnits, "study");
                          setIsStudyDone(true);
                        }
                      } catch (err) {
                        console.error("학습 완료 저장 실패:", err);
                      }
                      navigate(`/memory-card?unitId=${unlockedUnits}`);
                    }}
                    title={isStudyDone ? "완료! 다시 학습할 수 있어요" : "단어 암기 학습 시작"}
                  >
                    <span className="btn-icon">{isStudyDone ? "✅" : "📖"}</span>
                    <span className="btn-label">단어 학습</span>
                    {isStudyDone && <span className="done-badge">완료</span>}
                  </button>

                  {/* 퀴즈 버튼 */}
                  <button
                    className={`action-btn quiz-btn ${isQuizDone ? "done" : ""}`}
                    onClick={async () => {
                      try {
                        const parsedUserId = Number(localStorage.getItem("userId"));
                        if (!isNaN(parsedUserId) && parsedUserId > 0) {
                          await markUnitAsDone(parsedUserId, unlockedUnits, "quiz");
                          setIsQuizDone(true);
                        }
                      } catch (err) {
                        console.error("퀴즈 완료 저장 실패:", err);
                      }
                      navigate(`/quiz/${unlockedUnits}`);
                    }}
                    title={isQuizDone ? "완료! 다시 풀 수 있어요" : "퀴즈 풀기"}
                  >
                    <span className="btn-icon">{isQuizDone ? "✅" : "📝"}</span>
                    <span className="btn-label">퀴즈</span>
                    {isQuizDone && <span className="done-badge">완료</span>}
                  </button>
                  {/* 미니게임 버튼 - 항상 활성 */}
                  <button
                    className="action-btn mini-game-btn"
                    onClick={() => navigate(`/mini-game?unitId=${unlockedUnits}`)}
                    title="언제든지 즐길 수 있는 미니게임"
                  >
                    <span className="btn-icon">🎮</span>
                    <span className="btn-label">미니게임</span>
                    <span className="always-on-badge">Always ON</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 완료된 이전 층 (드롭다운 영역) */}
            {currentTier > 1 && (
              <div className="done-panel">
                <p>완료된 이전 층</p>
                <div className="completed-tiers-list">
                  {/* 역순으로 이전 층들을 배열 (예: 3층 진행중이면 2층, 1층 순서) */}
                  {Array.from({ length: currentTier - 1 }, (_, i) => currentTier - 1 - i).map((tier) => (
                    <div key={`tier-${tier}`} className="completed-tier-group">
                      <button 
                        className="tier-dropdown-btn" 
                        onClick={() => toggleTier(tier)}
                      >
                        Tier {tier} 완료 <span>{expandedTiers[tier] ? '▲' : '▼'}</span>
                      </button>
                      
                      {/* expandedTiers[tier]가 true일 때만 유닛 목록 표시 */}
                      {expandedTiers[tier] && (
                        <div className="tier-dropdown-content">
                          {renderUnits(tier, true)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>

          <section className="bottom-notice">
            {error && <div className="error-text">{error}</div>}
            <p>이 페이지는 타워 레벨 업과 스트릭 연동을 우선 반영한 대시보드 화면입니다.</p>
          </section>
        </main>
      </div>
    {/* 완료된 유닛 클릭 시 결과 모달 */}
      {resultModal && (
        <UnitResultModal
          unitId={resultModal.unitId}
          unitName={resultModal.unitName}
          onClose={() => setResultModal(null)}
        />
      )}
    </div>
  );
};

export default UserMainPage;