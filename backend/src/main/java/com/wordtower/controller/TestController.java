package com.wordtower.controller;

import com.wordtower.dto.AddExpRequest;
import com.wordtower.dto.AddExpResponse;
import com.wordtower.service.StreakService;
import com.wordtower.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TestController {

    // 필요한 Service들을 한 곳에서 모두 주입 받음
    private final StreakService streakService;
    private final UserService userService;

    // 타임 트래블에 사용되는 DTO Record
    // direction: "PAST"(과거) 또는 "FUTURE"(미래), days는 항상 양수(0 이상)
    public static record TimeTravelRequest(Long userId, int days, String direction) {}

    /**
     * 개발/테스트용 API 1: 특정 사용자의 lastActivityDate를 과거 또는 미래 날짜로 강제 변경
     * 보안: user@test.com 계정만 접근 가능
     * 
     * @param req TimeTravelRequest (userId, days, direction)
     *            - days: 이동할 일수 (0 이상의 양수)
     *            - direction: "PAST" 또는 "FUTURE"
     */
    @PostMapping("/time-travel")
    public ResponseEntity<?> timeTravel(@RequestBody TimeTravelRequest req) {
        try {
            streakService.timeTravelSetLastActivity(req.userId(), req.days(), req.direction());
            
            String directionText = "PAST".equalsIgnoreCase(req.direction()) ? "과거로" : "미래로";
            String message = "lastActivityDate updated to " + directionText + " " + req.days() + " days";
            
            return ResponseEntity.ok(message);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body("Access denied: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    /**
     * 개발/테스트용 API 2: 테스트 계정에 EXP를 임의로 추가
     * 보안: user@test.com 계정만 허용
     */
    @PostMapping("/add-exp")
    public ResponseEntity<?> addExp(@RequestBody AddExpRequest request) {
        try {
            AddExpResponse response = userService.addTestExp(request.userId(), request.addedExp());
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(403).body("Access denied: " + e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }
}