import React, { useState } from "react";
import { timeTravelLastActivity } from "../services/userService";
// Component 폴더에서 한 단계 밖으로 나가 style 폴더의 CSS를 Import 합니다.
import "../style/TimeTravelModal.css"; 

/**
 * 타임 트래블(과거 날짜 조작) 테스트를 위한 팝업창 UI Component입니다.
 * @param {boolean} visible 모달의 화면 표시 여부
 * @param {function} onClose 모달을 닫는 함수
 */
const TimeTravelModal = ({ visible, onClose }) => {
  // 시간 이동 방향 선택 State: "PAST"(과거) 또는 "FUTURE"(미래)
  const [direction, setDirection] = useState("PAST");
  // 시간 이동할 일수 State (기본값: 1, 항상 양수)
  const [days, setDays] = useState(1);
  // API 통신 중 버튼을 비활성화하기 위한 로딩 State
  const [loading, setLoading] = useState(false);

  // visible이 false면 화면에 아무것도 그리지 않음(Rendering 안 함)
  if (!visible) return null;

  /**
   * 확인 버튼 클릭 시 API를 호출하여 날짜를 변경하는 함수입니다.
   * direction(과거/미래)과 days(일수)를 조합하여 백엔드로 전송합니다.
   */
  const handleConfirm = async () => {
    // Local Storage에서 로그인한 유저의 ID를 가져옴
    const userId = localStorage.getItem("userId");
    
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 일수를 숫자로 변환 및 검증
    const daysNum = Number(days);
    if (isNaN(daysNum) || daysNum < 0) {
      alert("일수는 0 이상의 숫자여야 합니다.");
      return;
    }

    try {
      setLoading(true); // 통신 시작 시 로딩 상태 켜기
      // Backend API 호출 (direction과 days를 모두 전달)
      const res = await timeTravelLastActivity(userId, daysNum, direction);
      
      const directionText = direction === "PAST" ? "과거로" : "미래로";
      alert(`성공: ${directionText} ${daysNum}일 이동했습니다.\n${res.message}`);
      
      onClose(); // 성공하면 모달 닫기
      
      // 완료 직후 페이지 전체 새로고침
      window.location.reload(); 

    } catch (err) {
      alert(err.message || "Time travel 실패");
    } finally {
      setLoading(false); // 통신이 끝나면 무조건 로딩 상태 끄기
    }
  };

  return (
    // 배경을 클릭하면 onClose 함수가 실행되어 모달이 닫힘
    <div className="modal-backdrop" onClick={onClose}>
      {/* 모달 내부 하얀 창을 클릭했을 때는 배경 클릭 이벤트가 전달되지 않도록 방어 
        (e.stopPropagation: 이벤트 버블링 차단)
      */}
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h3>Time Travel (Test)</h3>
        <p>테스트 유저의 "DB상 마지막 학습일"을 변경합니다. 적용 후 새로고침 하여 확인해주세요.</p>
        
        {/* 방향 선택 라디오 버튼 */}
        <div className="modal-direction-group">
          <label className="modal-radio">
            <input
              type="radio"
              value="PAST"
              checked={direction === "PAST"}
              onChange={(e) => setDirection(e.target.value)}
              disabled={loading}
            />
            과거로 이동
          </label>
          <label className="modal-radio">
            <input
              type="radio"
              value="FUTURE"
              checked={direction === "FUTURE"}
              onChange={(e) => setDirection(e.target.value)}
              disabled={loading}
            />
            미래로 이동
          </label>
        </div>

        {/* 일수 입력 */}
        <div className="modal-days-group">
          <label htmlFor="days-input">이동할 일수:</label>
          <input
            id="days-input"
            type="number"
            min="0"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            className="modal-input"
            disabled={loading}
            placeholder="0 이상의 숫자"
          />
        </div>

        {/* 하단 버튼 영역 */}
        <div className="modal-button-row">
          <button onClick={onClose} disabled={loading}>취소</button>
          <button onClick={handleConfirm} disabled={loading}>
            {loading ? "처리중..." : "확인"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTravelModal;