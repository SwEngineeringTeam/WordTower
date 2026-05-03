package com.wordtower.repository;

import com.wordtower.domain.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * WordRepository: MySQL DB와 통신하여 CRUD를 수행합니다.
 */
@Repository
public interface WordRepository extends JpaRepository<Word, Long> {

    // 랜덤으로 n개 단어 조회
    @Query(value = "SELECT * FROM word ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Word> findRandomWords(int limit);
}