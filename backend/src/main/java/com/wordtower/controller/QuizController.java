package com.wordtower.controller;

import com.wordtower.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class QuizController {

    // 단어 대신 스트릭 서비스를 가져와서 씁니다.
    private final StreakService streakService; 

     /**
     * 퀴즈 제출 시 스트릭 갱신.
     * 퀴즈 완료 시 updateUserStreak 호출.
     * @param userId 사용자 ID
     * @param quizData 퀴즈 데이터 (생략)
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitQuiz(@RequestParam Long userId) {
        
        // 퀴즈 완료 여부 판단 (1개 이상 풀었는지 확인 로직 필요, 지금은 퀴즈를 풀었다고 가정.)
        boolean quizCompleted = true; 
        // 스트릭 서비스에게 유저의 스트릭을 갱신하라고 지시합니다.
        streakService.updateUserStreak(userId, quizCompleted);

        return ResponseEntity.ok("Quiz submitted and streak updated");
    }
}