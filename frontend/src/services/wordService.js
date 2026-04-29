/**
 * wordService: Axios 등을 대신하여 fetch를 이용한 API 통신 로직입니다.
 */
const API_BASE_URL = 'http://localhost:8080/api/words';

export const fetchWords = async () => {
    const response = await fetch(API_BASE_URL);
    return response.json();
};

export const addWord = async (wordData) => {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wordData),
    });
    return response.json();
};

export const removeWord = async (id) => {
    await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
};