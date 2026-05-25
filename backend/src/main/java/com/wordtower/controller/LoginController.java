package com.wordtower.controller;

import com.wordtower.domain.User;
import com.wordtower.dto.LoginRequest;
import com.wordtower.dto.LoginResponse;
import com.wordtower.repository.UserRepository;
import com.wordtower.service.StreakService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;
    private final StreakService streakService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElse(null);

        if (user == null || !user.getPassword().equals(request.password())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "아이디 또는 비밀번호가 틀렸습니다."));
        }

        String streakMessage = streakService.validateStreakOnLogin(user.getId());
        user = userRepository.findById(user.getId())
                .orElseThrow(() -> new RuntimeException("User not found after streak validation"));

        String token = "fake-jwt-token-" + (user.getRole() == User.Role.ADMIN ? "admin" : "user");

        return ResponseEntity.ok(new LoginResponse(
                user.getId(),
                token,
                user.getRole().name(),
                user.getNickname(),
                user.getCurrentStreak(),
                user.getStreakFreezeCount(),
                user.getLastActivityDate() != null ? user.getLastActivityDate().toString() : null,
                user.getEmail(),
                streakMessage
        ));
    }
}