package com.wordtower.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * 완료된 유닛의 결과 요약 DTO
 * - 퀴즈 정답률, 틀린 단어 목록 포함
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UnitResultDto {

    private int unitId;
    private String unitName;

    // 퀴즈 정답률 (0~100)
    private double quizAccuracy;

    // 총 문제 수 / 맞힌 수
    private int totalQuestions;
    private int correctCount;

    // 틀린 단어 목록
    private List<WrongWordDto> wrongWords;

    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WrongWordDto {
        private int wordId;
        private String english;
        private String korean;
    }
}