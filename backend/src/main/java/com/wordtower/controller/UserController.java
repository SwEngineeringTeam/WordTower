package com.wordtower.controller;

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
     * 사용자의 현재 열려있는 유닛(unlockedUnits) 조회
     */
    @GetMapping("/{userId}/progress")
    public ResponseEntity<Integer> getUserProgress(@PathVariable Long userId) {
        return ResponseEntity.ok(userService.getUnlockedUnits(userId));
    }
}