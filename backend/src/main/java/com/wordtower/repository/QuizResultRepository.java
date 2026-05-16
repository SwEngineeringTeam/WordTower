package com.wordtower.repository;

import com.wordtower.domain.QuizDetail;
import com.wordtower.domain.QuizRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

/**
 * 퀴즈 결과 Repository
 * QuizDetail(단어별 정오답) 기반으로 유닛 결과 조회
 */
public interface QuizResultRepository extends JpaRepository<QuizRecord, Long> {

    /**
     * 특정 유저의 가장 최근 QuizRecord 1건 조회
     * ※ QuizRecord에 unitId 컬럼 확인 후 WHERE 조건 추가 예정
     */
    @Query("""
        SELECT qr FROM QuizRecord qr
        WHERE qr.user.id = :userId AND qr.unitId = :unitId
        ORDER BY qr.testDate DESC
    """)
    Optional<QuizRecord> findLatestByUserIdAndUnitId(@Param("userId") Long userId,
                                                      @Param("unitId") int unitId);

    /**
     * 특정 QuizRecord에 속한 틀린 단어 목록 조회
     */
    @Query("""
        SELECT qd FROM QuizDetail qd
        WHERE qd.quizRecord.id = :quizRecordId
        AND qd.isCorrect = false
    """)
    List<QuizDetail> findWrongDetailsByQuizRecordId(@Param("quizRecordId") Long quizRecordId);

    /**
     * 특정 QuizRecord에 속한 전체 단어 목록 조회
     */
    @Query("""
        SELECT qd FROM QuizDetail qd
        WHERE qd.quizRecord.id = :quizRecordId
    """)
    List<QuizDetail> findAllDetailsByQuizRecordId(@Param("quizRecordId") Long quizRecordId);
}