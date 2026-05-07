package com.wordtower.controller;

import com.wordtower.dto.LoginRequest;  
import com.wordtower.dto.LoginResponse; 
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        
        // 테스트용 하드코딩된 계정
        if ("admin@test.com".equals(request.email()) && "1234".equals(request.password())) {
            return ResponseEntity.ok(new LoginResponse(1L, "fake-jwt-token-admin", "ADMIN", "Tower Admin"));
        } else if ("user@test.com".equals(request.email()) && "1234".equals(request.password())) {
            return ResponseEntity.ok(new LoginResponse(2L, "fake-jwt-token-user", "USER", "Tower Learner"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "아이디 또는 비밀번호가 틀렸습니다."));
    }
}