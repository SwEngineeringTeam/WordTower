package com.wordtower.controller;

import com.wordtower.domain.QuizDetail;
import com.wordtower.domain.QuizRecord;
import com.wordtower.domain.User;
import com.wordtower.repository.QuizDetailRepository;
import com.wordtower.repository.QuizRecordRepository;
import com.wordtower.repository.UserRepository;
import com.wordtower.service.StreakService;
import com.wordtower.service.UserService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class QuizController {

    private final StreakService streakService;
    private final UserService userService;
    private final QuizRecordRepository quizRecordRepository;
    private final UserRepository userRepository;
    private final QuizDetailRepository quizDetailRepository; // ← 추가

    /**
     * 퀴즈 제출 요청 바디 DTO (inner class)
     */
    @Getter @Setter
    public static class QuizSubmitRequest {
        private Long userId;
        private int completedUnit;
        private int totalCount;
        private int correctCount;
        // 단어별 정오답 목록
        private List<QuizDetailRequest> details;

        @Getter @Setter
        public static class QuizDetailRequest {
            private String spelling;   // 영어 단어
            private String userAnswer; // 유저가 입력한 답
            private boolean isCorrect; // 정오답 여부
            private String meaning; // ✅ 추가
        }
    }

    /**
     * 퀴즈 제출 시 스트릭 갱신 + 유닛 진도 + QuizRecord + QuizDetail 저장
     */
    @PostMapping("/submit")
    public ResponseEntity<String> submitQuiz(@RequestBody QuizSubmitRequest request) {

        Long userId = request.getUserId();
        int completedUnit = request.getCompletedUnit();

        // 정답이 하나 이상인 경우에만 스트릭을 증가시킵니다.
        if (request.getCorrectCount() > 0) {
            streakService.updateUserStreak(userId, true);
        }
        
        // 다음 유닛 열기
        userService.unlockNextUnit(userId, completedUnit);

        // QuizRecord 저장
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int totalCount = request.getTotalCount();
        int correctCount = request.getCorrectCount();
        double score = totalCount > 0
                ? Math.round((correctCount * 100.0 / totalCount) * 10) / 10.0
                : 0.0;

        QuizRecord record = new QuizRecord();
        record.setUser(user);
        record.setUnitId(completedUnit);
        record.setTotalCount(totalCount);
        record.setCorrectCount(correctCount);
        record.setScore(score);
        QuizRecord savedRecord = quizRecordRepository.save(record);

        // 4. QuizDetail 저장 (단어별 정오답)
        if (request.getDetails() != null) {
            for (QuizSubmitRequest.QuizDetailRequest detail : request.getDetails()) {
                QuizDetail quizDetail = new QuizDetail();
                quizDetail.setQuizRecord(savedRecord);
                quizDetail.setSpelling(detail.getSpelling());
                quizDetail.setUserAnswer(detail.getUserAnswer());
                quizDetail.setCorrect(detail.isCorrect());
                quizDetail.setMeaning(detail.getMeaning());
                quizDetailRepository.save(quizDetail);
            }
        }

        return ResponseEntity.ok("Quiz submitted!");
    }
}