// src/pages/UserProfile.jsx
import React, { useState } from "react";
import "../style/UserProfile.css";  // ← ../ 로 한 단계 올라가야 함

<<<<<<< HEAD
const UserProfile = ({ nickname, userEmail, streak, currentTier, unlockedUnits, onNicknameChange }) => {
=======
const UserProfile = ({
  nickname,
  userEmail,
  streak,
  currentTier,
  unlockedUnits,
  onNicknameChange,
}) => {
  // 수정 모드 상태 관리 (true일 때 입력창으로 변경)
>>>>>>> feature/register
  const [isEditing, setIsEditing] = useState(false);
  const [editNickname, setEditNickname] = useState(nickname);

  const calculateProgressPercentage = () => {
    const currentTierUnitsCompleted = (unlockedUnits - 1) % 5;
    return (currentTierUnitsCompleted / 5) * 100;
  };

  const handleSave = () => {
    if (!editNickname.trim()) {
      alert("닉네임을 입력해 주세요.");
      return;
    }
    onNicknameChange(editNickname);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditNickname(nickname);
    setIsEditing(false);
  };
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <section className="profile-section">

      {/* 프로필 헤더 카드 */}
      <div className="profile-header-card">
        <div className="profile-avatar">👤</div>
        <div className="profile-title">
          {isEditing ? (
            <div className="nickname-edit-group">
              <input
                type="text"
                className="nickname-input"
                value={editNickname}
                onChange={(e) => setEditNickname(e.target.value)}
              />
              <button className="edit-submit-btn" onClick={handleSave}>
                완료
              </button>
              <button className="edit-cancel-btn" onClick={handleCancel}>
                취소
              </button>
            </div>
          ) : (
            <div className="nickname-display-group">
              <h2>{nickname}님의 프로필</h2>
              <button
                className="edit-trigger-btn"
                onClick={() => setIsEditing(true)}
              >
                ✏️ 수정
              </button>
              <button
                onClick={handleLogout} // 부모 컴포넌트나 전역에서 가져온 로그아웃 함수
                className="logout-btn"
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#fee2e2", // 연한 빨간색
                  color: "#dc2626", // 진한 빨간색 텍스트
                  border: "none",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background 0.2s",
                }}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#fecaca")
                }
                onMouseOut={(e) => (e.target.style.backgroundColor = "#fee2e2")}
              >
                로그아웃
              </button>
            </div>
          )}
          <p className="profile-email">{userEmail}</p>
        </div>
      </div>

      {/* 스탯 카드 그리드 */}
      <div className="profile-grid">

        <div className="profile-stat-card">
          <span className="stat-icon">🔥</span>
          <div className="stat-info">
            <p className="stat-label">현재 스트릭</p>
            <h3 className="stat-value">{streak} 일째</h3>
          </div>
        </div>

        <div className="profile-stat-card">
          <span className="stat-icon">✨</span>
          <div className="stat-info">
            <p className="stat-label">보유 경험치 (EXP)</p>
            <h3 className="stat-value">0 XP</h3>
          </div>
        </div>

        <div className="profile-stat-card">
          <span className="stat-icon">🏢</span>
          <div className="stat-info">
            <p className="stat-label">현재 유닛 위치</p>
            <h3 className="stat-value">
              Tier {currentTier} - Unit {unlockedUnits}
            </h3>
          </div>
        </div>

        <div className="profile-stat-card progress-card-full">
          <span className="stat-icon">📊</span>
<<<<<<< HEAD
          <div className="stat-info">
=======
          <div className="stat-info" style={{ width: "100%" }}>
>>>>>>> feature/register
            <p className="stat-label">현재 층(Tier) 진행도</p>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${calculateProgressPercentage()}%` }}
              ></div>
            </div>
            <p className="progress-text">
              Tier {currentTier}의 5개 유닛 중{" "}
              <strong>{(unlockedUnits - 1) % 5}개</strong> 완료 (
              {calculateProgressPercentage().toFixed(0)}%)
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default UserProfile;
