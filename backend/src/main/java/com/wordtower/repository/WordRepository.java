package com.wordtower.repository;

import com.wordtower.domain.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * WordRepository: MySQL DB와 통신하여 CRUD를 수행합니다.
 */
@Repository
public interface WordRepository extends JpaRepository<Word, Long> {

    @Query(value = "SELECT * FROM word WHERE difficulty = :difficulty ORDER BY id ASC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Word> findWordsByDifficultyOrdered(
            @Param("difficulty") String difficulty,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    // 특정 난이도(difficulty)의 단어 중에서 랜덤으로 n개 조회
    @Query(value = "SELECT * FROM word WHERE difficulty = :difficulty ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Word> findRandomWordsByDifficulty(
            @Param("difficulty") String difficulty,
            @Param("limit") int limit
    );
    // 오답 단어가 아직 없을 때 임시로 랜덤 단어 n개 조회
    @Query(value = "SELECT * FROM word ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Word> findWrongWordsTemp(@Param("limit") int limit);
}