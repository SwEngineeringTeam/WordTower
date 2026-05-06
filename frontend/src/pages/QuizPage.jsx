import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { submitQuizAndUpdateStreak } from "../services/streakService";

const QuizPage = () => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async () => {
    if (!userId) {
      navigate("/login");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitQuizAndUpdateStreak(Number(userId), Number(unitId));
      
      setMessage("퀴즈 완료! 스트릭이 성공적으로 갱신되었습니다.");
      console.log(result);
    } catch (error) {
      console.error("퀴즈 완료 오류:", error);
      setMessage(`퀴즈 완료 처리 중 오류가 발생했습니다: ${error.message || error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1>학습 유닛 {unitId}</h1>
        <p>이 페이지는 실제 퀴즈 화면이 정의되면 확장할 수 있는 placeholder입니다.</p>
        <div style={{ marginTop: 30 }}>
          <button style={buttonStyle} onClick={handleComplete} disabled={isSubmitting}>
            {isSubmitting ? "처리 중..." : "퀴즈 완료 처리"}
          </button>
          <button style={cancelStyle} onClick={() => navigate("/user")}>대시보드로 돌아가기</button>
        </div>
        {message && <p style={{ marginTop: 16 }}>{message}</p>}
      </div>
    </div>
  );
};

const pageStyle = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(180deg, #e0f2fe 0%, #dbeafe 100%)",
};

const cardStyle = {
  width: "420px",
  padding: "32px",
  borderRadius: "24px",
  boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
  backgroundColor: "white",
  textAlign: "center",
};

const buttonStyle = {
  padding: "14px 26px",
  borderRadius: "999px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  marginRight: "12px",
};

const cancelStyle = {
  ...buttonStyle,
  backgroundColor: "#6b7280",
};

export default QuizPage;
