package com.wordtower.service;

import com.wordtower.domain.QuizDetail;
import com.wordtower.domain.QuizRecord;

import com.wordtower.dto.UnitResultDto;
import com.wordtower.repository.QuizDetailRepository;
import com.wordtower.repository.QuizResultRepository;
import com.wordtower.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UnitResultService {

        private final QuizResultRepository quizResultRepository;
        private final QuizDetailRepository quizDetailRepository;
        // ✅ 추가: 단어 뜻 조회용
        private final WordRepository wordRepository;

        public UnitResultDto getUnitResult(Long userId, int unitId) {

                Optional<QuizRecord> latestRecord = quizResultRepository.findLatestByUserIdAndUnitId(userId, unitId);

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
                int correctCount = record.getCorrectCount();
                double accuracy = totalQuestions > 0
                                ? Math.round((correctCount * 100.0 / totalQuestions) * 10) / 10.0
                                : 0.0;

                List<QuizDetail> allDetails = quizDetailRepository.findByQuizRecord(record);

                List<UnitResultDto.WrongWordDto> wrongWords = allDetails.stream()
                                .filter(qd -> !qd.isCorrect())
                                // ✅ 추가: spelling 기준으로 중복 제거
                                .collect(Collectors.collectingAndThen(
                                                Collectors.toMap(
                                                                QuizDetail::getSpelling,
                                                                qd -> qd,
                                                                (existing, duplicate) -> existing),
                                                map -> map.values().stream()))
                                // 수정 후
                                .map(qd -> UnitResultDto.WrongWordDto.builder()
                                                .wordId(0)
                                                .english(qd.getSpelling())
                                                .korean(qd.getMeaning()) // ✅ QuizDetail에 저장된 뜻 사용
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