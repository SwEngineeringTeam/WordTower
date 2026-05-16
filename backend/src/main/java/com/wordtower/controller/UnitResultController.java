package com.wordtower.controller;

import com.wordtower.dto.UnitResultDto;
import com.wordtower.service.UnitResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 완료된 유닛 결과 조회 API
 * GET /api/units/{unitId}/result?userId={userId}
 */
@RestController
@RequestMapping("/api/units")
@RequiredArgsConstructor
public class UnitResultController {

    private final UnitResultService unitResultService;

    /**
     * 특정 유닛의 퀴즈 결과 요약 반환
     * (임시: userId를 쿼리 파라미터로 받음 - 추후 Security 적용 시 교체)
     *
     * @param unitId 조회할 유닛 ID (PathVariable)
     * @param userId 현재 유저 ID (RequestParam - 임시)
     * @return UnitResultDto (정답률, 틀린 단어 목록)
     */
    @GetMapping("/{unitId}/result")
    public ResponseEntity<UnitResultDto> getUnitResult(
            @PathVariable int unitId,
            @RequestParam Long userId   // ← Security 없이 임시로 파라미터로 받음
    ) {
        UnitResultDto result = unitResultService.getUnitResult(userId, unitId);
        return ResponseEntity.ok(result);
    }
}