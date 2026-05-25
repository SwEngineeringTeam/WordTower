package com.wordtower.dto;

public record LoginResponse(
        Long userId,
        String token,
        String role,
        String nickname,
        int currentStreak,
        int streakFreezeCount,
        String lastActivityDate,
        String email,
        String streakMessage
) {}
