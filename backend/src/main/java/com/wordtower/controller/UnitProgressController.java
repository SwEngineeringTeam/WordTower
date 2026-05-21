package com.wordtower.controller;

import com.wordtower.dto.UnitProgressResponse;
import com.wordtower.dto.UnitProgressUpdateRequest;
import com.wordtower.service.UnitProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * 유닛 진도(완료 상태) REST API 컨트롤러
 * Base URL: /api/progress
 */
@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UnitProgressController {

    private final UnitProgressService unitProgressService;

    /** GET /api/progress/{userId}/unit/{unitId} */
    @GetMapping("/{userId}/unit/{unitId}")
    public ResponseEntity<UnitProgressResponse> getUnitProgress(
            @PathVariable Long userId,
            @PathVariable Integer unitId) {
        return ResponseEntity.ok(unitProgressService.getUnitProgress(userId, unitId));
    }

    /** POST /api/progress/{userId}/unit/{unitId}/done */
    @PostMapping("/{userId}/unit/{unitId}/done")
    public ResponseEntity<UnitProgressResponse> markAsDone(
            @PathVariable Long userId,
            @PathVariable Integer unitId,
            @RequestBody UnitProgressUpdateRequest request) {
        return ResponseEntity.ok(unitProgressService.markAsDone(userId, unitId, request));
    }
}