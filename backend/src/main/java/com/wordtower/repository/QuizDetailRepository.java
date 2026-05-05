package com.wordtower.repository;

import com.wordtower.domain.QuizDetail;
import com.wordtower.domain.QuizRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizDetailRepository extends JpaRepository<QuizDetail, Long> {
    // 특정 퀴즈 회차의 상세 결과(틀린 단어 등) 조회
    List<QuizDetail> findByQuizRecord(QuizRecord quizRecord);
}