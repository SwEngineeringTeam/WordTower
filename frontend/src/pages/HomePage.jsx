import React from "react";
import { Link, useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  // 로컬 스토리지에서 정보 가져오기
  const role = localStorage.getItem("role"); // 'ADMIN' 또는 'USER'
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear(); // 토큰 및 역할 정보 삭제
    navigate("/login");
  };

  return (
    <div
      style={{ textAlign: "center", marginTop: "100px", fontFamily: "Arial" }}
    >
      <h1 style={{ fontSize: "3rem", color: "#2563eb" }}>Word Tower 🗼</h1>
      <p>토익 정복을 위한 똑똑한 단어장</p>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          flexDirection: "column", // 세로 정렬을 위해 추가
          alignItems: "center",
          gap: "15px",
        }}
      >
        {/* 1. 로그인을 안 했을 때 (토큰이 없을 때) */}
        {!token ? (
          <Link to="/login">
            <button style={buttonStyle}>로그인하기</button>
          </Link>
        ) : (
          /* 2. 로그인을 했을 때 (토큰이 있을 때) */
          <>
            <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
              반갑습니다, <span style={{ color: "#2563eb" }}>
                {localStorage.getItem("nickname") || (role === "ADMIN" ? "관리자" : "유저")}
              </span>
              님!
            </p>

            <div style={{ display: "flex", gap: "10px" }}>
              {/* 관리자라면 관리자 버튼, 일반 유저라면 학습 버튼 */}
              {role === "ADMIN" ? (
                <Link to="/admin">
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#10b981" }}
                  >
                    관리자 페이지 (단어 관리)
                  </button>
                </Link>
              ) : (
                <Link to="/user">
                  <button
                    style={{ ...buttonStyle, backgroundColor: "#55a0d6" }}
                  >
                    오늘의 단어 학습하기
                  </button>
                </Link>
              )}

              {/* 로그아웃 버튼은 로그인 시 항상 노출 */}
              <button
                onClick={handleLogout}
                style={{ ...buttonStyle, backgroundColor: "#ef4444" }}
              >
                로그아웃
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: "12px 24px",
  fontSize: "1rem",
  cursor: "pointer",
  backgroundColor: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "8px",
  transition: "opacity 0.2s",
};

export default HomePage;
