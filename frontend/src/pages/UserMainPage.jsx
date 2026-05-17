import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserStreak, getUserProgress } from "../services/streakService";
// 1. 새로 만든 프로필 컴포넌트 import
import UserProfile from "./UserProfile"; 
import "../style/UserMainPage.css";

const UserMainPage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const nickname = localStorage.getItem("nickname") || "Tower Learner";
  const userEmail = localStorage.getItem("userEmail") || "user@wordtower.com";

  const [streak, setStreak] = useState(0);
  const [unlockedUnits, setUnlockedUnits] = useState(
    parseInt(localStorage.getItem("unlockedUnits")) || 1
  ); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [expandedTiers, setExpandedTiers] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const currentStreak = await getUserStreak(Number(userId));
        setStreak(currentStreak);

        const progress = await getUserProgress(Number(userId));
        const localProgress = parseInt(localStorage.getItem("unlockedUnits")) || 1;
        const finalProgress = Math.max(Number(progress) || 1, localProgress);
        setUnlockedUnits(finalProgress);
      } catch (err) {
        console.error("데이터 조회 오류:", err);
        setError("서버에서 정보를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, userId]);

  const onUnitClick = (unitNum) => {
    if (unitNum <= unlockedUnits) {
      navigate(`/quiz/${unitNum}`);
    }
  };

  const toggleTier = (tier) => {
    setExpandedTiers((prev) => ({ ...prev, [tier]: !prev[tier] }));
  };

  const currentTier = Math.ceil(unlockedUnits / 5) || 1;

  const renderUnits = (tier, isCompletedTier = false) => {
    const startUnit = (tier - 1) * 5 + 1;
    const units = Array.from({ length: 5 }, (_, i) => startUnit + i);

    return (
      <div className="unit-row">
        {units.map((unitNum) => {
          const locked = unitNum > unlockedUnits;
          return (
            <button
              key={`unit-${unitNum}`}
              className={`unit-card ${locked ? "locked" : "unlocked"}`}
              onClick={() => onUnitClick(unitNum)}
              disabled={locked}
            >
              <span>Unit {unitNum}</span>
              <strong>{locked ? "LOCKED" : isCompletedTier ? "DONE" : "PLAY"}</strong>
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
          <button 
            className={`sidebar-button ${activeTab === "dashboard" ? "active" : ""}`} 
            onClick={() => setActiveTab("dashboard")}
          >
            대시보드
          </button>
          <button className="sidebar-button">설정</button>
          <button className="sidebar-button">나의 단어장</button>
          <button className="sidebar-button">복습하기</button>
          <button 
            className={`sidebar-button ${activeTab === "profile" ? "active" : ""}`} 
            onClick={() => setActiveTab("profile")}
          >
            내 프로필
          </button>
        </aside>

        <main className="main-panel">
          {activeTab === "dashboard" ? (
            /* 대시보드 메인 타워 화면 */
            <>
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

                <div className="tower-board">
                  <div className="tower-header">현재 층: Tier {currentTier}</div>
                  {renderUnits(currentTier)}
                  <div className="action-panel">
                    <div>
                      <p className="action-label">현재 진행 유닛</p>
                      <h3>Unit {unlockedUnits}</h3>
                    </div>
                    <button
                      className="primary-action"
                      onClick={() => navigate("/memory-card", { state: { unitId: unlockedUnits } })}
                    >
                      현재 유닛 학습 시작
                    </button>
                  </div>
                </div>

                {currentTier > 1 && (
                  <div className="done-panel">
                    <p>완료된 이전 층</p>
                    <div className="completed-tiers-list">
                      {Array.from({ length: currentTier - 1 }, (_, i) => currentTier - 1 - i).map((tier) => (
                        <div key={`tier-${tier}`} className="completed-tier-group">
                          <button className="tier-dropdown-btn" onClick={() => toggleTier(tier)}>
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
            </>
          ) : (
            /* 2. 외부 파일로 분리한 프로필 컴포넌트 렌더링 (Props 전달) */
            <UserProfile 
              nickname={nickname}
              userEmail={userEmail}
              streak={streak}
              currentTier={currentTier}
              unlockedUnits={unlockedUnits}
            />
          )}

          <section className="bottom-notice">
            {error && <div className="error-text">{error}</div>}
            <p>이 페이지는 타워 레벨 업과 스트릭 연동을 우선 반영한 대시보드 화면입니다.</p>
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserMainPage;