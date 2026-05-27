package com.wordtower.controller;

import java.util.HashMap;
import java.util.Map;
import com.wordtower.dto.StreakFreezeRewardRequest;
import com.wordtower.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    /**
     * 사용자의 마지막 학습일(lastActivityDate) 조회 API
     */
    @GetMapping("/{userId}/last-activity")
    public ResponseEntity<?> getLastActivityDate(@PathVariable Long userId) {
        try {
            String dateStr = userService.getLastActivityDate(userId);
            
            // JSON 형태로 안전하게 전달하기 위해 Map 사용
            Map<String, String> response = new HashMap<>();
            response.put("lastActivityDate", dateStr);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(400).body("Error: " + e.getMessage());
        }
    }

    /**
     * 사용자의 현재 열려있는 유닛(unlockedUnits) 조회
     */
    @GetMapping("/{userId}/progress")
    public ResponseEntity<Integer> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUnlockedUnits(userId));
    }

    /**
     * 레벨테스트 통과 후 다음 티어를 엽니다.
     */
    @PostMapping("/{userId}/level-test/pass")
    public ResponseEntity<Integer> passLevelTest(@PathVariable Long userId,
                                                 @RequestParam(defaultValue = "1") int tier) {
        return ResponseEntity.ok(userService.passLevelTest(userId, tier));
    }

    /**
     * 사용자의 스트릭 방어권 보유 개수 조회
     */
    @GetMapping("/{userId}/streak-freeze")
    public ResponseEntity<Integer> getStreakFreezeCount(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getStreakFreezeCount(userId));
    }

    /**
     * 경험치 증가 시 스트릭 방어권을 지급합니다.
     */
    @PostMapping("/{userId}/streak-freeze/reward")
    public ResponseEntity<Integer> rewardStreakFreeze(@PathVariable Long userId,
                                                      @RequestBody StreakFreezeRewardRequest request) {
        return ResponseEntity.ok(userService.rewardStreakFreezeForExp(userId, request.oldExp(), request.newExp()));
    }
}
