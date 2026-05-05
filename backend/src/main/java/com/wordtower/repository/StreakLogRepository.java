package com.wordtower.repository;

import com.wordtower.domain.StreakLog;
import com.wordtower.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface StreakLogRepository extends JpaRepository<StreakLog, Long> {
    // 특정 사용자의 모든 스트릭 기록 조회 (잔디 심기용)
    List<StreakLog> findByUser(User user);
}