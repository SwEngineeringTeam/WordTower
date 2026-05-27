import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserStreak, getUserProgress } from "../services/streakService";
import { getStreakFreezeCount, getLastActivityDate } from "../services/userService";
import { getUnitProgress } from "../services/unitProgressService";
import UnitResultModal from "../components/UnitResultModal";
import "../style/UserMainPage.css";
import TimeTravelModal from "../components/TimeTravelModal";
import AddExpModal from "../components/AddExpModal";
/* ══════════════════════════════════════
   픽셀 UI 서브 컴포넌트
══════════════════════════════════════ */

import UserProfile from "./UserProfile";

/**
 * BrickWall — 교차 줄눈 벽돌을 JSX div로 렌더링
 */
const BrickWall = ({ rowCount = 10, wallWidth = 560, brickW = 40, brickH = 16 }) => (
  <div className="brick-wall">
    {Array.from({ length: rowCount }, (_, rowIdx) => {
      const isEven = rowIdx % 2 === 1;
      const offset = isEven ? brickW / 2 : 0;
      const count  = Math.ceil((wallWidth + brickW) / brickW);
      return (
        <div key={rowIdx} className="brick-row" style={{ height: brickH }}>
          {Array.from({ length: count }, (_, colIdx) => (
            <div
              key={colIdx}
              className="brick"
              style={{
                left:   colIdx * brickW - offset,
                width:  brickW - 2,
                height: brickH - 2,
                top:    1,
              }}
            />
          ))}
        </div>
      );
    })}
  </div>
);

/** Merlon — 흉벽 하나 */
const Merlon = ({ width = 68, height = 32 }) => (
  <div className="merlon" style={{ width, height }}>
    <BrickWall rowCount={3} wallWidth={width} brickW={22} brickH={10} />
  </div>
);

/** PixelChar — 픽셀 병사 */
const PixelChar = ({ bodyColor = "body-green", bagSide = "bag-l" }) => (
  <div className="px-char">
    <div className="px-hat-top" />
    <div className="px-hat-brim" />
    <div className="px-head">
      <div className="px-eye eye-l" />
      <div className="px-eye eye-r" />
      <div className="px-mouth" />
    </div>
    <div className={`px-body ${bodyColor}`}>
      <div className={`px-bag ${bagSide}`} />
      <div className="px-arm arm-l" />
      <div className="px-arm arm-r" />
    </div>
    <div className="px-legs">
      <div className="px-leg" /><div className="px-leg" />
    </div>
    <div className="px-feet">
      <div className="px-foot" /><div className="px-foot" />
    </div>
  </div>
);

/** Lamp — 픽셀 아트 가로등 (SVG 기반) */
const Lamp = () => {
  const P = 4;
  const Block = ({ x, y, w = 1, h = 1, color }) => (
    <rect x={x * P} y={y * P} width={w * P} height={h * P} fill={color} />
  );

  return (
    <svg
      width={P * 10} height={P * 22}
      style={{ imageRendering: "pixelated", display: "block" }}
      viewBox={`0 0 ${P * 10} ${P * 22}`}
    >
      {/* 등 머리 가로 */}
      <Block x={1} y={0} w={8} h={2} color="#FDD835" />
      {/* 등 머리 테두리 */}
      <Block x={1} y={0} w={8} h={1} color="#9E8800" />
      {/* 불빛 */}
      <Block x={2} y={1} w={6} h={1} color="#FFF176" />
      {/* 기둥 */}
      <Block x={4} y={2} w={2} h={19} color="#757575" />
      {/* 기둥 하단 */}
      <Block x={3} y={19} w={4} h={2} color="#616161" />
    </svg>
  );
};

/* ══════════════════════════════════════
   UserMainPage (메인)
══════════════════════════════════════ */

/**
 * UserMainPage
 * - 최신 기능(streakFreeze, unitProgress, UnitResultModal) 유지
 * - UI는 픽셀 아트 성 스타일로 교체
 */
const UserMainPage = () => {
  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("email") || "";
  const [nickname, setNickname] = useState(localStorage.getItem("nickname") || "Tower Learner");


  // ── 상태 (최신 코드 그대로) ──
  const [streak,           setStreak]           = useState(0);
  const [streakFreezeCount,setStreakFreezeCount] = useState(0);
  const [unlockedUnits,    setUnlockedUnits]     = useState(
    parseInt(localStorage.getItem("unlockedUnits")) || 1
  );
  const [lastActivityDate, setLastActivityDate]  = useState(null);
  const [loading,          setLoading]           = useState(true);
  const [error,            setError]             = useState(null);
  const [isStudyDone,      setIsStudyDone]       = useState(false);
  const [isQuizDone,       setIsQuizDone]        = useState(false);
  const [resultModal,      setResultModal]       = useState(null);
  const [showTimeTravelModal, setShowTimeTravelModal] = useState(false); // ← 추가
  const [showAddExpModal,     setShowAddExpModal]     = useState(false); // ← 추가
  // ── 픽셀 UI 전용 상태 ──
  const [activeTab,  setActiveTab]  = useState("dashboard");
  const [activeTier, setActiveTier] = useState(
    parseInt(localStorage.getItem("activeTier")) || 1
  );

  const TOTAL_TIERS = 3;


  // ── 데이터 fetch (최신 코드 그대로) ──
  useEffect(() => {
    if (!userId) { navigate("/login"); return; }

    const fetchData = async () => {
      try {
        setLoading(true);

        const currentStreak = await getUserStreak(Number(userId));
        setStreak(currentStreak);
        const progress = await getUserProgress(Number(userId));
        const localProgress = parseInt(localStorage.getItem("unlockedUnits")) || 1;
        const finalProgress = Math.max(Number(progress) || 1, localProgress);
        setUnlockedUnits(finalProgress);

        const unitProgress = await getUnitProgress(Number(userId), finalProgress);
        setIsStudyDone(unitProgress.isStudyDone);
        setIsQuizDone(unitProgress.isQuizDone);

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


  const onUnitClick = (unitNum) => {
    if (unitNum > unlockedUnits) return;
    if (unitNum < unlockedUnits) {
      setResultModal({ unitId: Number(unitNum), unitName: `Unit ${unitNum}` });
      return;
    }
    navigate(`/memory-card?unitId=${unitNum}`);
  };

  const handleTierClick = (tier) => {
    const unlocked = (tier - 1) * 5 + 1 <= unlockedUnits;
    if (unlocked) {
      localStorage.setItem("activeTier", tier);
      setActiveTier(tier);
    }
  };
  const currentTier = Math.ceil(unlockedUnits / 5) || 1;

const getUnitStatus = (unitNum) => {
  if (unitNum < unlockedUnits) return "done";
  if (unitNum === unlockedUnits) return "current";
  return "locked";
};

const handleNicknameChange = (nextNickname) => {
  localStorage.setItem("nickname", nextNickname);
  setNickname(nextNickname);
};

  /** 픽셀 UI용 유닛 버튼 렌더링 */
  const renderTierUnits = (tier) => {
    const startUnit = (tier - 1) * 5 + 1;
    return Array.from({ length: 5 }, (_, i) => startUnit + i).map((unitNum) => {
      const status = getUnitStatus(unitNum);
      return (
        <button
          key={`unit-${unitNum}`}
          className={`unit-btn ${status}`}
          onClick={() => onUnitClick(unitNum)}
          disabled={status === "locked"}
        >
          <span className="u-label">Unit</span>
          <span className="u-num">{unitNum}</span>
          <span className="u-icon">
            {status === "done"    && "✓"}
            {status === "current" && "▶"}
            {status === "locked"  && "🔒"}
          </span>
        </button>
      );
    });
  };


  

  return (
    <div className="wt-root">
      

      {/* ══ 헤더 ══ */}
      <header className="wt-header">
        <span className="wt-logo">🏰 Word Tower</span>
        <div className="wt-header-right">

          {/* 스트릭 방어권 */}
          {streakFreezeCount > 0 && (
            <div className="freeze-badge">🛡️ {streakFreezeCount}</div>
          )}

          {/* 스트릭 */}
          <div className="streak-badge">
            🔥 {loading ? "…" : `${streak}일`}
          </div>

          {/* 마지막 학습일 */}
          {lastActivityDate && (
            <div className="last-date-badge">
              📅 {lastActivityDate}
            </div>
          )}

          <button
            className={`hdr-btn ${activeTab === "dashboard" ? "on" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >대시보드</button>
          <button
            className={`hdr-btn ${activeTab === "profile" ? "on" : ""}`}
            onClick={() => setActiveTab("profile")}
          >내 프로필</button>
          <button className="hdr-btn">설정</button>
          <button className="hdr-btn">나의 단어장</button>
          <button className="hdr-btn">복습하기</button>
          {/* ← 여기서부터 추가 */}
          {localStorage.getItem("email") === "user@test.com" && (
            <>

              <button className="hdr-btn" onClick={() => setShowTimeTravelModal(true)}>
                Time Travel (Test)
              </button>
              <button className="hdr-btn" onClick={() => setShowAddExpModal(true)}>
                Add EXP (Test)
              </button>
              <TimeTravelModal
                visible={showTimeTravelModal}
                onClose={() => setShowTimeTravelModal(false)}
              />
              <AddExpModal
                visible={showAddExpModal}
                onClose={() => setShowAddExpModal(false)}
              />

              

            </>
          )}
          {/* ← 여기까지 추가 */}
        </div>
      </header>

      {activeTab === "profile" ? (
        <div className="profile-wrap">
          <UserProfile
            nickname={nickname}
            userEmail={userEmail}
            streak={streak}
            currentTier={currentTier}
            unlockedUnits={unlockedUnits}
            onNicknameChange={handleNicknameChange}
          />
        </div>
      ) : (

      /* ══ 게임 씬 ══ */
      <div className="game-scene">

        {/* 구름 */}
        <div className="sky-layer" aria-hidden="true">
          <div className="cloud c1" /><div className="cloud c2" />
        </div>

        {/* Tier 탭 */}
        <nav className="tier-tabs">
          {Array.from({ length: TOTAL_TIERS }, (_, i) => i + 1).map((tier) => {
            const unlocked = (tier - 1) * 5 + 1 <= unlockedUnits;
            return (
              <button
                key={tier}
                className={`tier-tab ${activeTier === tier ? "active" : ""} ${!unlocked ? "locked" : ""}`}
                onClick={() => handleTierClick(tier)}
                disabled={!unlocked}
              >
                Tier {tier}{!unlocked && " 🔒"}
              </button>
            );
          })}
        </nav>



        {/* ══ ground-scene: 성 + 병사 + 잔디 ══ */}
        <div className="ground-scene">

          {/* 잔디 */}
          <div className="grass-layer">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="grass-tuft" style={{ left: `${i * 4.3}%` }} />
            ))}
          </div>
          <div className="grass-fill" />

          {/* 성 양옆 병사 + 가로등 */}
          <div className="side-left">
            <Lamp />
            <PixelChar bodyColor="body-green" bagSide="bag-l" />
          </div>
          <div className="side-right">
            <PixelChar bodyColor="body-blue" bagSide="bag-r" />
            <Lamp />
          </div>

          {/* ── 성 ── */}
          <div className="castle-outer">

            {/* ── 2층 (위층 — 작고 아무 표시 없음) ── */}
            <div className="castle-top-floor">
              {/* 2층 흉벽 */}
              <div className="battlements battlements-top" aria-hidden="true">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="merlon merlon-top">
                    <BrickWall rowCount={3} wallWidth={50} brickW={18} brickH={10} />
                  </div>
                ))}
              </div>
              {/* 2층 벽돌 본체 */}
              <div className="castle-body-wrap castle-floor2-wrap">
                <div className="castle-brick-bg" aria-hidden="true">
                  <BrickWall rowCount={6} wallWidth={340} brickW={40} brickH={16} />
                </div>
                {/* 2층 창문 */}
                <div className="castle-content castle-floor2-content">
                  <div className="castle-window win-left win-top" aria-hidden="true">
                    <div className="win-cross wc-h" /><div className="win-cross wc-v" />
                  </div>
                  <div className="castle-window win-right win-top" aria-hidden="true">
                    <div className="win-cross wc-h" /><div className="win-cross wc-v" />
                  </div>
                </div>
              </div>
            </div>

            {/* ── 1층 (아래층 — 패널, 버튼 등) ── */}
            <div className="castle-floor1">
              {/* 흉벽 */}
              <div className="battlements" aria-hidden="true">
                {Array.from({ length: 6 }).map((_, i) => <Merlon key={i} />)}
              </div>

              {/* 성 본체 */}
              <div className="castle-body-wrap">
                <div className="castle-brick-bg" aria-hidden="true">
                  <BrickWall rowCount={26} wallWidth={560} brickW={40} brickH={16} />
                </div>
                <div className="castle-content">
                  

                  {/* 현재 유닛 패널 */}
                  <div className="info-panel">
                    <div className="panel-header">현재 유닛</div>
                    <div className="panel-title">Unit {unlockedUnits}</div>
                    <div className="panel-sub">Tier {currentTier} · Unit {unlockedUnits}</div>
                  </div>

                  {/* 학습 활동 패널 */}
                  <div className="activity-panel">
                    <div className="panel-header">학습 활동</div>
                    <div className="act-row">
                      <button
                        className={`act-btn sky ${isStudyDone ? "act-done" : ""}`}
                        onClick={() => navigate(`/memory-card?unitId=${unlockedUnits}`)}
                      >
                        {isStudyDone ? "✔" : "📖"} 단어 학습
                        {isStudyDone && <span className="act-done-badge">완료</span>}
                      </button>
                      <button
                        className={`act-btn sky ${isQuizDone ? "act-done" : ""}`}
                        onClick={() => navigate(`/quiz/${unlockedUnits}`)}
                      >
                        {isQuizDone ? "✔" : "✏️"} 퀴즈
                        {isQuizDone && <span className="act-done-badge">완료</span>}
                      </button>
                      <button
                        className="act-btn purple"
                        onClick={() => navigate(`/mini-game?unitId=${unlockedUnits}`)}
                      >
                        🎮 미니게임
                        <span className="act-always-badge">Always ON</span>
                      </button>
                    </div>
                  </div>

                  {/* 유닛 버튼 행 */}
                  <div className="unit-row-wrap">
                    <div className="unit-row-brick-bg" aria-hidden="true">
                      <BrickWall rowCount={4} wallWidth={560} brickW={40} brickH={16} />
                    </div>
                    <div className="unit-row">
                      {renderTierUnits(activeTier)}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>{/* /castle-outer */}

        </div>
      </div>

      )}

      {/* 에러 토스트 */}
      {error && <div className="wt-error" role="alert">{error}</div>}

      {/* 완료 유닛 클릭 시 결과 모달 */}

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

