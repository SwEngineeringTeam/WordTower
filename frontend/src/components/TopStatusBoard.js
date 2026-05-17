import React from "react";

/**
 * TopStatusBoard 컴포넌트
 * * 대시보드 상단에서 사용자의 현재 연속 학습일(Streak)과
 * 스트릭 방어권(Streak Freeze) 보유 개수를 표시합니다.
 * * Props:
 * - streak: 현재 연속 학습일 (number)
 * - streakFreezeCount: 보유 중인 방어권 개수 (number)
 * - loading: 데이터 로딩 중 여부 (boolean)
 * - nickname: 사용자 닉네임 (string)
 * - lastActivityDate: 마지막 학습 날짜 (string, 테스트 디버깅용)
 */
const TopStatusBoard = ({ streak, streakFreezeCount, loading, nickname, lastActivityDate }) => {
  // 테스트 계정 여부를 확인하기 위해 Local Storage에서 이메일을 가져옵니다.
  const email = localStorage.getItem("email");

  return (
    <section className="top-status">
      <div className="streak-card">
        <div className="streak-icon">🔥</div>
        <div>
          <p className="status-label">연속 학습일</p>
          <h2>{loading ? "..." : streak}</h2>
        </div>

        {/* 스트릭 방어권 표시 */}
        <div className="streak-freeze-info">
          <span className="freeze-icon">❄️</span>
          <span className="freeze-count">
            {loading ? "..." : streakFreezeCount}
          </span>
        </div>
      </div>

      <div className="welcome-card">
        <p>환영합니다, {nickname}님</p>
        <h1>건설 중인 타워에서 오늘의 도전을 확인하세요</h1>
        
        {/* 테스트 계정 전용 Debug UI */}
        {email === "user@test.com" && (
          <div style={{ fontSize: "12px", color: "gray", marginTop: "10px" }}>
            [DEBUG] DB상 마지막 학습일: {lastActivityDate ? lastActivityDate.split('.')[0].replace('T', ' ') : "기록 없음"}
          </div>
        )}
      </div>
    </section>
  );
};

export default TopStatusBoard;