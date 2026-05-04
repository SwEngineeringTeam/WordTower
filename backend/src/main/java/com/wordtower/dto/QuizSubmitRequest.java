package com.wordtower.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * 퀴즈 제출 시 프론트엔드에서 백엔드로 전달하는 데이터 바구니
 */
@Getter @Setter
public class QuizSubmitRequest {
    private int totalCount;    // 전체 문제 수
    private int correctCount;  // 맞춘 문제 수
    private double score;      // 획득 점수
}