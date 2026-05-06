package com.wordtower.dto;

public record LoginResponse(Long userId, String token, String role, String nickname) {}
