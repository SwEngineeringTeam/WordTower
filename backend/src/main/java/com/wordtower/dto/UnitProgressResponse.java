package com.wordtower.dto;

import lombok.*;

/** 유닛별 완료 상태 응답 DTO */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UnitProgressResponse {
    private Integer unitId;
    private Boolean isStudyDone;
    private Boolean isQuizDone;
}