import React, { useState } from "react";
import { addTestExp } from "../services/userService";
import "../style/TimeTravelModal.css";

/**
 * 테스트 계정 전용 EXP 추가 팝업입니다.
 * @param {boolean} visible 모달 표시 여부
 * @param {function} onClose 모달 닫기 함수
 */
const AddExpModal = ({ visible, onClose }) => {
  const [expValue, setExpValue] = useState(0);
  const [loading, setLoading] = useState(false);

  if (!visible) return null;

  const handleConfirm = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("로그인이 필요합니다.");
      return;
    }

    const amount = Number(expValue);
    if (isNaN(amount) || amount < 0) {
      alert("추가할 EXP는 0 이상의 숫자여야 합니다.");
      return;
    }

    try {
      setLoading(true);
      const response = await addTestExp(userId, amount);
      alert(`성공: EXP ${amount}만큼 지급되었습니다. 현재 EXP: ${response.updatedExp}`);
      onClose();
    } catch (error) {
      alert(error.message || "EXP 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h3>Add EXP (Test)</h3>
        <p>테스트 계정(user@test.com)에서만 사용 가능합니다.</p>

        <input
          type="number"
          min="0"
          value={expValue}
          onChange={(e) => setExpValue(e.target.value)}
          className="modal-input"
        />

        <div className="modal-button-row">
          <button onClick={onClose} disabled={loading}>취소</button>
          <button onClick={handleConfirm} disabled={loading}>
            {loading ? "처리중..." : "EXP 추가"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddExpModal;
