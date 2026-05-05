package com.wordtower.repository;

import com.wordtower.domain.QuizRecord;
import com.wordtower.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface QuizRecordRepository extends JpaRepository<QuizRecord, Long> {
    // 특정 사용자의 최근 테스트 기록 5개 조회 (통계용)
    List<QuizRecord> findTop5ByUserOrderByTestDateDesc(User user);
}