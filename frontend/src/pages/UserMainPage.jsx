import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserStreak, getUserProgress } from "../services/streakService";
import { getStreakFreezeCount } from "../services/userService";
import { getLastActivityDate } from "../services/userService"; 
import { getUnitProgress } from "../services/unitProgressService";
import UnitResultModal from "../components/UnitResultModal";
import "../style/UserMainPage.css";
import Sidebar from "../components/Sidebar";
import TopStatusBoard from "../components/TopStatusBoard";


const UserMainPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const nickname = localStorage.getItem("nickname") || "Tower Learner";

  const [streak, setStreak] = useState(0);
  const [streakFreezeCount, setStreakFreezeCount] = useState(0);
  const [unlockedUnits, setUnlockedUnits] = useState(
    parseInt(localStorage.getItem("unlockedUnits")) || 1
  ); 
  
  // 1. 마지막 학습일(lastActivityDate)을 담을 상태 변수 추가
  const [lastActivityDate, setLastActivityDate] = useState(null); 
  
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
        
        // 스트릭 가져오기
        const currentStreak = await getUserStreak(Number(userId));
        setStreak(currentStreak);

        // DB에서 유닛 진도 가져오기
        const progress = await getUserProgress(Number(userId));
        const localProgress = parseInt(localStorage.getItem("unlockedUnits")) || 1;
        const finalProgress = Math.max(Number(progress) || 1, localProgress);
        setUnlockedUnits(finalProgress);

        // ✅ 추가: 현재 유닛 완료 상태 조회
        const unitProgress = await getUnitProgress(Number(userId), finalProgress);
        setIsStudyDone(unitProgress.isStudyDone);
        setIsQuizDone(unitProgress.isQuizDone);
        
        // 2. 마지막 학습일 가져오기 (API 호출 로직)
        // 백엔드에 사용자 정보를 가져오는 API가 있다면 호출해서 날짜를 세팅합니다.
        try {
          const dateStr = await getLastActivityDate(Number(userId));
          setLastActivityDate(dateStr);
        } catch (e) {
          console.warn("마지막 학습일 조회 실패", e);
        }
        
      } catch (err) {
        console.error("데이터 조회 오류:", err);
        setError("서버에서 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }

      try {
        const freezeCount = await getStreakFreezeCount(Number(userId));
        setStreakFreezeCount(freezeCount || 0);
      } catch (err) {
        console.warn("스트릭 방어권 조회 실패:", err);
        setStreakFreezeCount(0);
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

  const toggleTier = (tier) => {
    setExpandedTiers((prev) => ({
      ...prev,
      [tier]: !prev[tier],
    }));
  };

  const currentTier = Math.ceil(unlockedUnits / 5) || 1;

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
        <Sidebar />
        <main className="main-panel">
          
          {/* 3. TopStatusBoard 컴포넌트에 lastActivityDate 전달하기 */}
          <TopStatusBoard
            streak={streak}
            streakFreezeCount={streakFreezeCount}
            loading={loading}
            nickname={nickname}
            lastActivityDate={lastActivityDate} 
          />

          <section className="tower-area">
            <div className="tower-skyline">
              <div className="crane-icon">🏗️</div>
              <div className="blueprint-label">Tower Construction</div>
            </div>

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
                    onClick={() => {
                      // ✅ markUnitAsDone 제거 - 단어 학습 완료는 MemoryCard에서 처리
                      navigate(`/memory-card?unitId=${unlockedUnits}`);
                    }}
                    title={isStudyDone ? "완료! 다시 학습할 수 있어요" : "단어 암기 학습 시작"}
                  >
                    <span className="btn-icon">
                    {isStudyDone
                      ? <span style={{ fontSize: "18px", color: "#fff", fontWeight: "bold" }}>✔</span>
                      : "📖"}
                  </span>
                    <span className="btn-label">단어 학습</span>
                    {isStudyDone && <span className="done-badge">완료</span>}
                  </button>

                  {/* 퀴즈 버튼 */}
                  <button
                    className={`action-btn quiz-btn ${isQuizDone ? "done" : ""}`}
                    onClick={() => {
                      // ✅ markUnitAsDone 제거 - 퀴즈 완료는 DailyQuiz에서 처리
                      navigate(`/quiz/${unlockedUnits}`);
                    }}
                    title={isQuizDone ? "완료! 다시 풀 수 있어요" : "퀴즈 풀기"}
                  >
                    <span className="btn-icon">
                    {isQuizDone
                      ? <span style={{ fontSize: "18px", color: "#fff", fontWeight: "bold" }}>✔</span>
                      : "📝"}
                  </span>
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

            {currentTier > 1 && (
              <div className="done-panel">
                <p>완료된 이전 층</p>
                <div className="completed-tiers-list">
                  {Array.from({ length: currentTier - 1 }, (_, i) => currentTier - 1 - i).map((tier) => (
                    <div key={`tier-${tier}`} className="completed-tier-group">
                      <button 
                        className="tier-dropdown-btn" 
                        onClick={() => toggleTier(tier)}
                      >
                        Tier {tier} 완료 <span>{expandedTiers[tier] ? '▲' : '▼'}</span>
                      </button>
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