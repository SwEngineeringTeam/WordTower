// src/pages/UserProfile.jsx
import React, { useState } from "react";

const UserProfile = ({ nickname, userEmail, streak, currentTier, unlockedUnits, onNicknameChange }) => {
  // 수정 모드 상태 관리 (true일 때 입력창으로 변경)
  const [isEditing, setIsEditing] = useState(false);
  // 입력 중인 닉네임 상태 관리
  const [editNickname, setEditNickname] = useState(nickname);

  // 유닛 진행도 백분율 계산
  const calculateProgressPercentage = () => {
    const currentTierUnitsCompleted = (unlockedUnits - 1) % 5;
    return (currentTierUnitsCompleted / 5) * 100;
  };

  // 저장 버튼 클릭 시 호출
  const handleSave = () => {
    if (!editNickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    // 상위 컴포넌트(UserMainPage)의 상태와 로컬 스토리지를 업데이트하는 함수 호출
    onNicknameChange(editNickname);
    setIsEditing(false);
  };

  // 취소 버튼 클릭 시 호출
  const handleCancel = () => {
    setEditNickname(nickname); // 기존 닉네임으로 원복
    setIsEditing(false);
  };

  return (
    <section className="profile-section">
      <div className="profile-header-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-title">
          {isEditing ? (
            /* 수정 모드일 때 보일 입력창 UI */
            <div className="nickname-edit-group">
              <input
                type="text"
                className="nickname-input"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
              />
              <button className="edit-submit-btn" onClick={handleSave}>완료</button>
              <button className="edit-cancel-btn" onClick={handleCancel}>취소</button>
            </div>
          ) : (
            /* 일반 모드일 때 보일 닉네임 UI */
            <div className="nickname-display-group">
              <h2>{nickname}님의 프로필</h2>
              <button className="edit-trigger-btn" onClick={() => setIsEditing(true)}>✏️ 수정</button>
            </div>
          )}
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

        {/* 2. 경험치 (EXP) */}
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