package com.wordtower.repository;

import com.wordtower.domain.Word;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * WordRepository: MySQL DB와 통신하여 CRUD를 수행합니다.
 */
@Repository
public interface WordRepository extends JpaRepository<Word, Long> {
}