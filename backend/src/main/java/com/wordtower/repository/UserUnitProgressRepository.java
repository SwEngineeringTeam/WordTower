package com.wordtower.repository;

import com.wordtower.domain.UserUnitProgress;  // ✅ entity → domain
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

/**
 * 유저 유닛 진도 Repository
 */
public interface UserUnitProgressRepository extends JpaRepository<UserUnitProgress, Long> {
    Optional<UserUnitProgress> findByUserIdAndUnitId(Long userId, Integer unitId);
}