package com.wordtower.controller;

import com.wordtower.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.wordtower.dto.QuizSubmitRequest;

@RestController
@RequestMapping("/api/streak")
@RequiredArgsConstructor
public class StreakController {

    private final StreakService streakService;

    /**
     * 1. 사용자의 현재 스트릭을 조회
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Integer> getUserStreak(@PathVariable Long userId) {
        return ResponseEntity.ok(streakService.getUserStreak(userId));
    }


    /**
     * 2. 퀴즈 제출 시 스트릭 갱신
     */
    @PostMapping("/{userId}/update")
    public ResponseEntity<String> updateStreakAfterQuiz(
            @PathVariable Long userId,
            @RequestBody QuizSubmitRequest request) {

        // 스트릭 갱신 로직은 로그인 시 처리됩니다.
        return ResponseEntity.ok("Streak update is handled on login, not on quiz submission.");
    }
}