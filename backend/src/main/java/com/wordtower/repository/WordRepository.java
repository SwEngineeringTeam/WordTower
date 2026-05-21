package com.wordtower.repository;

import com.wordtower.domain.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // ✅ 추가

@Repository
public interface WordRepository extends JpaRepository<Word, Long> {


    @Query(value = "SELECT * FROM word WHERE difficulty = :difficulty ORDER BY id ASC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Word> findWordsByDifficultyOrdered(
            @Param("difficulty") String difficulty,
            @Param("limit") int limit,
            @Param("offset") int offset
    );


    @Query(value = "SELECT * FROM word WHERE difficulty = :difficulty ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Word> findRandomWordsByDifficulty(
            @Param("difficulty") String difficulty,
            @Param("limit") int limit
    );

    @Query(value = "SELECT * FROM word ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Word> findWrongWordsTemp(@Param("limit") int limit);

    // 이것만 하나만 있어야 함!
    @Query(value = "SELECT * FROM word WHERE id BETWEEN :startId AND :endId ORDER BY id ASC LIMIT :limit", nativeQuery = true)
    List<Word> findWordsByUnitId(
            @Param("startId") int startId,
            @Param("endId") int endId,
            @Param("limit") int limit
    );
    
    // ✅ 추가: spelling으로 단어 뜻 조회 (UnitResultService에서 사용)
    Optional<Word> findByWord(String word);

}