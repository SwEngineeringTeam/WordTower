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
        
        // QuizRecord의 totalCount(전체 문제 수)가 0보다 크면 퀴즈를 완료한 것으로 인정합니다.
        boolean quizCompleted = request.getTotalCount() > 0; 

        // 스트릭 갱신 서비스 호출
        streakService.updateUserStreak(userId, quizCompleted);
        
        if (quizCompleted) {
            return ResponseEntity.ok("Quiz submitted and streak updated.");
        } else {
            return ResponseEntity.ok("No questions solved. Streak not updated.");
        }
    }
}