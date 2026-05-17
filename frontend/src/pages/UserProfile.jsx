// src/pages/UserProfile.jsx
import React from "react";

const UserProfile = ({ nickname, userEmail, streak, currentTier, unlockedUnits }) => {
  // 유닛 진행도 백분율 계산
  const calculateProgressPercentage = () => {
    const currentTierUnitsCompleted = (unlockedUnits - 1) % 5;
    return (currentTierUnitsCompleted / 5) * 100;
  };

  return (
    <section className="profile-section">
      <div className="profile-header-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-title">
          <h2>{nickname}님의 프로필</h2>
          <p className="profile-email">{userEmail}</p>
        </div>
      </div>

      <div className="profile-grid">
        {/* 1. 스트릭 상태 */}
        <div className="profile-stat-card">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <p className="stat-label">현재 스트릭</p>
            <h3 className="stat-value">{streak} 일째</h3>
          </div>
        </div>

        {/* 2. 경험치 (임시 0 처리) */}
        <div className="profile-stat-card">
          <span className="stat-icon">✨</span>
          <div className="stat-info">
            <p className="stat-label">보유 경험치 (EXP)</p>
            <h3 className="stat-value">0 XP</h3>
          </div>
        </div>

        {/* 3. 현재 유닛 위치 */}
        <div className="profile-stat-card">
          <span className="stat-icon">🏢</span>
          <div className="stat-info">
            <p className="stat-label">현재 유닛 위치</p>
            <h3 className="stat-value">Tier {currentTier} - Unit {unlockedUnits}</h3>
          </div>
        </div>

        {/* 4. 유닛 진행도 */}
        <div className="profile-stat-card progress-card-full">
          <span className="stat-icon">📊</span>
          <div className="stat-info" style={{ width: '100%' }}>
            <p className="stat-label">현재 층(Tier) 진행도</p>
            <div className="progress-bar-container">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${calculateProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="progress-text">
              Tier {currentTier}의 5개 유닛 중 <strong>{(unlockedUnits - 1) % 5}개</strong> 완료 ({calculateProgressPercentage().toFixed(0)}%)
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UserProfile;