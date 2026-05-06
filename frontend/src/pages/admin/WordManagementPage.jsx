import React, { useState, useEffect } from 'react';
import { wordService } from '../../services/wordService';
import WordForm from '../../components/word/WordForm';

const WordManagementPage = () => {
  const [words, setWords] = useState([]);
  const [formData, setFormData] = useState({ word: '', meaning: '', example: '', difficulty: '입문' });
  const [editingId, setEditingId] = useState(null);

  // 데이터 로드
  const fetchWords = async () => {
    const res = await wordService.getWords();
    setWords(res.data);
  };

  useEffect(() => { fetchWords(); }, []);

  // 저장/수정 로직
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await wordService.updateWord(editingId, formData);
      setEditingId(null);
    } else {
      await wordService.createWord(formData);
    }
    setFormData({ word: '', meaning: '', example: '', difficulty: '입문' });
    fetchWords();
  };

  const handleDelete = async (id) => {
    if (window.confirm("정말 삭제할까요?")) {
      await wordService.deleteWord(id);
      fetchWords();
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Word Tower 단어 관리</h2>
      <WordForm 
        formData={formData} 
        handleChange={(e) => setFormData({...formData, [e.target.name]: e.target.value})}
        handleSubmit={handleSubmit}
        editingId={editingId}
        onCancel={() => { setEditingId(null); setFormData({word:'', meaning:''}); }}
      />
      {/* 여기에 테이블 부분도 별도 컴포넌트로 만들어서 넣으면 더 완벽합니다! */}
    </div>
  );
};

export default WordManagementPage;