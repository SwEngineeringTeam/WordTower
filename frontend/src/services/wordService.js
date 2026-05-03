/**
 * wordService: fetch를 이용한 API 통신 로직
 */
const API_BASE_URL = "http://localhost:8080/api/words";

// 1. 목록 조회
export const fetchWords = async () => {
  const response = await fetch(API_BASE_URL);
  if (!response.ok) throw new Error("데이터를 불러오는데 실패했습니다.");
  return response.json();
};

// 2. 단어 추가 (Create)
export const addWord = async (wordData) => {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wordData),
  });
  return response.json();
};

// 3. 단어 수정 (Update) - [새로 추가]
export const updateWord = async (id, wordData) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: "PUT", // 수정은 보통 PUT을 사용합니다.
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(wordData),
  });
  return response.json();
};

// 4. 단어 삭제 (Delete)
export const removeWord = async (id) => {
  const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("삭제에 실패했습니다.");
};
