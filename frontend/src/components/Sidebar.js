import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import TimeTravelModal from "./TimeTravelModal";
import AddExpModal from "./AddExpModal";

/**
 * 화면 좌측의 메뉴 네비게이션을 담당하는 UI Component
 * 특정 테스트 계정으로 접속 시 타임 트래블 및 EXP 테스트 기능이 활성화
 */
const Sidebar = () => {
  // 페이지 이동(Routing)을 위한 함수
  const navigate = useNavigate();
  
  // 팝업창(Modal)의 열림/닫힘 상태(State)를 관리하는 변수
  const [showTimeTravelModal, setShowTimeTravelModal] = useState(false);
  const [showAddExpModal, setShowAddExpModal] = useState(false);
  
  // LocalStorage에서 현재 로그인한 사용자의 이메일을 가져옴 (데이터가 없으면 빈 문자열 할당)
  const email = localStorage.getItem("email") || "";

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">Word Tower</div>
      
      {/* 클릭 시 메인 대시보드 화면으로 이동하는 Button */}
      <button className="sidebar-button" onClick={() => navigate("/user")}>대시보드</button>
      <button className="sidebar-button">설정</button>
      <button className="sidebar-button">나의 단어장</button>
      <button className="sidebar-button">복습하기</button>
      <button className="sidebar-button">내 프로필</button>

      {/* 조건부 렌더링(Conditional Rendering): 
        사용자의 이메일이 테스트 계정일 때만 아래의 코드 블록을 화면에 그림 
      */}
      {email === "user@test.com" && (
        <>
          <button
            className="sidebar-button time-travel-btn"
            onClick={() => setShowTimeTravelModal(true)} // 클릭 시 모달 State를 true로 변경하여 화면에 띄움
          >
            Time Travel (Test)
          </button>

          <button
            className="sidebar-button add-exp-btn"
            onClick={() => setShowAddExpModal(true)}
          >
            Add EXP (Test)
          </button>

          {/* 타임 트래블 기능을 실행하는 Modal Component */}
          <TimeTravelModal
            visible={showTimeTravelModal} // 현재 모달이 보여야 하는지 여부를 전달
            onClose={() => setShowTimeTravelModal(false)} // 모달 내부에서 닫기 동작 시 State를 false로 변경하도록 함수 전달
          />

          <AddExpModal
            visible={showAddExpModal}
            onClose={() => setShowAddExpModal(false)}
          />
        </>
      )}
    </aside>
  );
};

export default Sidebar;