import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import "../style/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user_data = await login(email, password);
      if (user_data.streakMessage) {
        window.alert(user_data.streakMessage);
      }
      // 로그인 성공 시 백엔드가 최신 스트릭, 방어권, 마지막 활동일을 반환하고
      // authService가 해당 값을 localStorage에 동기화합니다.
      if (user_data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Word Tower</h2>
          <p>토익 정복을 위한 첫 걸음</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>이메일 주소</label>
            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label>비밀번호</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-button">
            로그인하기
          </button>
        </form>

        <div className="login-footer">
          <p>
            계정이 없으신가요? <button>회원가입</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
