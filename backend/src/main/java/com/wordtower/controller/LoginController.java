package com.wordtower.controller;

import com.wordtower.domain.User;
import com.wordtower.dto.LoginRequest;  
import com.wordtower.dto.LoginResponse; 
import com.wordtower.repository.UserRepository; // 💡 DB 조회를 위해 임포트 추가
import lombok.RequiredArgsConstructor; // 💡 생성자 주입을 위해 추가
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
@RequiredArgsConstructor // 💡 userRepository를 자동으로 주입받기 위해 추가합니다.
public class LoginController {

    private final UserRepository userRepository; // 💡 DB에 접근할 수 있도록 주입받습니다.
    private final StreakService streakService;


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        
        // 1. [DB 조회] 입력한 이메일로 실제 가입된 유저가 있는지 확인합니다.
        User user = userRepository.findByEmail(request.email())
                .orElse(null);

        // 2. [비밀번호 및 예외 검증] 유저가 없거나, 입력한 비밀번호가 DB의 비밀번호와 다르면 실패 처리
        // (현재 암호화 라이브러리를 안 쓰므로 .equals() 평문 비교를 씁니다.)
        if (user == null || !request.password().equals(user.getPassword())) {
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