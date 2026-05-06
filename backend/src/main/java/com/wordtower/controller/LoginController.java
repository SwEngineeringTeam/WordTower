package com.wordtower.controller;

import com.wordtower.dto.LoginRequest;  // 위에서 만든 DTO 임포트
import com.wordtower.dto.LoginResponse; // 위에서 만든 DTO 임포트
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
        
        // record를 사용하면 request.email() 처럼 괄호를 붙여서 호출합니다.
        if ("admin@test.com".equals(request.email()) && "1234".equals(request.password())) {
            return ResponseEntity.ok(new LoginResponse("fake-jwt-token-admin", "ADMIN"));
        } else if ("user@test.com".equals(request.email()) && "1234".equals(request.password())) {
            return ResponseEntity.ok(new LoginResponse("fake-jwt-token-user", "USER"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                             .body(Map.of("message", "아이디 또는 비밀번호가 틀렸습니다."));
    }
}