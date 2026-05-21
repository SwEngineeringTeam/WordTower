package com.wordtower.dto;

import lombok.*;

/** 유닛 완료 상태 업데이트 요청 DTO - type: "study" | "quiz" */
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UnitProgressUpdateRequest {
    private String type;
}