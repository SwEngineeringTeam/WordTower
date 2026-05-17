import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../style/LoginPage.css"; // 로그인 스타일 재활용

const RegisterPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const navigate = useNavigate();

  // 💡 [PBI-17] 토익 점수 상태 관리
  const [toeicScore, setToeicScore] = useState("");
  const [dontKnowScore, setDontKnowScore] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 💡 "모르겠어요"를 체크했으면 null(또는 0), 입력했으면 숫자로 변환
      const finalScore = dontKnowScore ? null : Number(toeicScore);

      // 💡 백엔드로 점수(finalScore)까지 함께 전송합니다.
      await register(email, password, nickname, finalScore);

      alert("회원가입 및 온보딩이 완료되었습니다! 로그인 페이지로 이동합니다.");
      navigate("/login"); // 가입 성공 시 로그인 페이지로 이동
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Word Tower</h2>
          <p>새로운 계정을 만들어보세요</p>
        </div>

        <form onSubmit={handleRegister} className="login-form">
          <div className="input-group">
            <label>이메일 주소</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>닉네임</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 💡 [PBI-17 추가] 토익 점수 입력 섹션 */}
          <div className="input-group" style={{ marginTop: "15px" }}>
            <label style={{ fontWeight: "bold" }}>기존 토익 점수</label>
            <input
              type="number"
              placeholder="예: 700 (미입력 시 0층 시작)"
              value={toeicScore}
              onChange={(e) => setToeicScore(e.target.value)}
              disabled={dontKnowScore} // "모르겠어요" 체크 시 입력창 비활성화
              min="0"
              max="990"
              required={!dontKnowScore} // 체크 안 했을 때만 필수 입력하게 만듦
            />
          </div>

          {/* 💡 [PBI-17 추가] "모르겠어요" 체크박스 */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              marginBottom: "20px",
              width: "100%",
            }}
          >
            <input
              type="checkbox"
              id="dontKnow"
              checked={dontKnowScore}
              onChange={(e) => {
                setDontKnowScore(e.target.checked);
                if (e.target.checked) {
                  setToeicScore(""); // 체크하면 적어두었던 점수 칸 비우기
                }
              }}
            />
            <label
              htmlFor="dontKnow"
              style={{
                fontSize: "0.9rem",
                cursor: "pointer",
                color: "#4b5563",
              }}
            >
              토익 점수를 모르겠어요. (0층부터 시작)
            </label>
          </div>

          <button
            type="submit"
            className="login-button"
            style={{ backgroundColor: "#10b981" }}
          >
            회원가입하기
          </button>
        </form>

        <div className="login-footer">
          <p>
            이미 계정이 있으신가요?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              style={{
                border: "none",
                background: "none",
                color: "#2563eb",
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
