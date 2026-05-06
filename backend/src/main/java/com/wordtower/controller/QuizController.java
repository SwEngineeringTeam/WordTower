package com.wordtower.controller;

import com.wordtower.service.StreakService;
import com.wordtower.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class QuizController {

    private final StreakService streakService; 
    private final UserService userService;

    /**
     * 퀴즈 제출 시 스트릭 갱신 및 유닛 진도 업데이트
     * @param userId 사용자 ID
     * @param completedUnit 방금 완료한 유닛 번호
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitQuiz(
            @RequestParam Long userId,
            @RequestParam int completedUnit) {
        
        boolean quizCompleted = true; 
        
        // 1. 스트릭 서비스에게 유저의 스트릭 갱신 지시
        streakService.updateUserStreak(userId, quizCompleted);

        // 2. 유저 서비스에게 다음 유닛 열어주기 지시
        userService.unlockNextUnit(userId, completedUnit);

        return ResponseEntity.ok("Quiz submitted! Streak and progress updated.");
    }
}