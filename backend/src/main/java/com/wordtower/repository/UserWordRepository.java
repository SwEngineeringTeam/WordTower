package com.wordtower.repository;

import com.wordtower.domain.UserWord;
import com.wordtower.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface UserWordRepository extends JpaRepository<UserWord, Long> {
    // 사용자의 오답 단어만 조회 (오답 단어장 기능용)
    List<UserWord> findByUserAndIsWrongTrue(User user);
    
    // 사용자의 즐겨찾기 단어 조회
    List<UserWord> findByUserAndIsFavoriteTrue(User user);
}