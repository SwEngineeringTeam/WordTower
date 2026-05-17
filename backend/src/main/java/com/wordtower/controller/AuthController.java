package com.wordtower.controller;

import com.wordtower.dto.RegisterRequest;
import com.wordtower.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService; // 💡 오직 UserService만 주입받아야 합니다!

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.ok("회원가입이 완료되었습니다.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            // 스프링 부트 터미널에 진짜 에러 원인을 찍어보기 위해 프린트문 추가
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body("서버 오류: " + e.getMessage());
        }
    }
}