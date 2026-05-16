package com.wordtower.service;

import com.wordtower.domain.QuizDetail;
import com.wordtower.domain.QuizRecord;
import com.wordtower.dto.UnitResultDto;
import com.wordtower.repository.QuizDetailRepository;
import com.wordtower.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * 완료된 유닛의 결과 요약 조회 서비스
 */
@Service
@RequiredArgsConstructor
public class UnitResultService {

    private final QuizResultRepository quizResultRepository;
    private final QuizDetailRepository quizDetailRepository;

    public UnitResultDto getUnitResult(Long userId, int unitId) {

        Optional<QuizRecord> latestRecord =
                quizResultRepository.findLatestByUserIdAndUnitId(userId, unitId);

        if (latestRecord.isEmpty()) {
            return UnitResultDto.builder()
                    .unitId(unitId)
                    .unitName("Unit " + unitId)
                    .quizAccuracy(0.0)
                    .totalQuestions(0)
                    .correctCount(0)
                    .wrongWords(List.of())
                    .build();
        }

        QuizRecord record = latestRecord.get();
        int totalQuestions = record.getTotalCount();
        int correctCount   = record.getCorrectCount();
        double accuracy    = totalQuestions > 0
                ? Math.round((correctCount * 100.0 / totalQuestions) * 10) / 10.0
                : 0.0;

        // 기존 findByQuizRecord 메서드 활용
        List<QuizDetail> allDetails =
                quizDetailRepository.findByQuizRecord(record);

        List<UnitResultDto.WrongWordDto> wrongWords = allDetails.stream()
                .filter(qd -> !qd.isCorrect())
                .map(qd -> UnitResultDto.WrongWordDto.builder()
                        .wordId(0)
                        .english(qd.getSpelling())
                        .korean(qd.getUserAnswer())
                        .build())
                .collect(Collectors.toList());

        return UnitResultDto.builder()
                .unitId(unitId)
                .unitName("Unit " + unitId)
                .quizAccuracy(accuracy)
                .totalQuestions(totalQuestions)
                .correctCount(correctCount)
                .wrongWords(wrongWords)
                .build();
    }
}