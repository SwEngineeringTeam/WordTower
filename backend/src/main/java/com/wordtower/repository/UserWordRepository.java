package com.wordtower.repository;

import com.wordtower.domain.UserWord;
import com.wordtower.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;

@Repository
public interface UserWordRepository extends JpaRepository<UserWord, Long> {
    // 사용자의 오답 단어만 조회 (오답 단어장 기능용)
    List<UserWord> findByUserAndIsWrongTrue(User user);
    
    // 사용자의 즐겨찾기 단어 조회
    List<UserWord> findByUserAndIsFavoriteTrue(User user);
    @Query(value = "SELECT * FROM user_word WHERE spelling = :spelling LIMIT 1", nativeQuery = true)
    Optional<UserWord> findBySpellingNative(@Param("spelling") String spelling);

    @Query(value = "SELECT * FROM user_word WHERE is_wrong = true ORDER BY last_wrong_date DESC LIMIT :limit", nativeQuery = true)
    List<UserWord> findWrongWords(@Param("limit") int limit);
}