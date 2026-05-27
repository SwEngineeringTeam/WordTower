package com.wordtower.service;

import com.wordtower.domain.User;
import com.wordtower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;

/**
 * 사용자의 Streak 및 방어권(Freeze) 아이템 적용을 관리하는 Service 클래스
 */
@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserRepository userRepository;

    /**
     * 로그인 시 호출되는 스트릭 지속성 검증.
     * 마지막 학습일과 streak freeze 개수를 기준으로 스트릭 연결 여부를 판단합니다.
     * 필요 시 freeze를 차감하거나 스트릭을 초기화하며, 메시지를 반환합니다.
     *
     * @param userId 사용자 ID
     * @return 로그인 시 표시할 메시지 또는 null
     */
    @Transactional
    public String validateStreakOnLogin(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ZonedDateTime nowKst = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDate today = nowKst.toLocalDate();

        LocalDate lastActivity = user.getLastActivityDate() != null
                ? user.getLastActivityDate().atZone(ZoneId.of("Asia/Seoul")).toLocalDate()
                : null;

        user.setStreakCheckDate(today);
        String message = null;

        if (lastActivity == null) {
            userRepository.save(user);
            return null;
        }

        if (lastActivity.equals(today) || lastActivity.equals(today.minusDays(1))) {
            userRepository.save(user);
            return null;
        }

        long missedDays = ChronoUnit.DAYS.between(lastActivity, today) - 1;
        int currentFreezes = user.getStreakFreezeCount();

        if (missedDays > 0 && currentFreezes >= missedDays) {
            user.setStreakFreezeCount(currentFreezes - (int) missedDays);
            message = missedDays + "일에 대해 freeze 아이템 " + missedDays + "개를 사용했어요! 남은 freeze 아이템은 "
                    + user.getStreakFreezeCount() + "개 입니다.";
        } else {
            user.setCurrentStreak(0);
            message = "마지막 접속일로부터 " + missedDays + "일이 지나서 스트릭이 깨졌어요...";
        }

        userRepository.save(user);
        return message;
    }

    /**
     * 사용자의 스트릭을 갱신. (퀴즈 완료 시 호출됨.)
     * KST 자정 기준으로 퀴즈 완료 날짜를 기준으로 스트릭을 증가시킵니다.
     * longestStreak은 최대값으로 갱신합니다.
     *
     * @param userId 사용자 ID
     * @param quizCompleted 퀴즈 완료 여부
     */
    @Transactional
    public boolean updateUserStreak(Long userId, boolean quizCompleted) {
        if (!quizCompleted) {
            return false;
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        ZonedDateTime nowKst = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDate today = nowKst.toLocalDate();

        LocalDate lastActivity = user.getLastActivityDate() != null
                ? user.getLastActivityDate().atZone(ZoneId.of("Asia/Seoul")).toLocalDate()
                : null;

        if (lastActivity != null && lastActivity.equals(today)) {
            return false;
        }

        int oldStreak = user.getCurrentStreak();
        int newCurrentStreak;
        if (lastActivity == null) {
            newCurrentStreak = 1;
        } else if (lastActivity.equals(today.minusDays(1))) {
            newCurrentStreak = user.getCurrentStreak() + 1;
        } else if (user.getStreakCheckDate() != null && user.getStreakCheckDate().equals(today)) {
            newCurrentStreak = user.getCurrentStreak() > 0 ? user.getCurrentStreak() + 1 : 1;
        } else {
            long missedDays = lastActivity == null ? 0 : ChronoUnit.DAYS.between(lastActivity, today) - 1;
            int currentFreezes = user.getStreakFreezeCount();
            if (missedDays > 0 && currentFreezes >= missedDays) {
                user.setStreakFreezeCount(currentFreezes - (int) missedDays);
                newCurrentStreak = user.getCurrentStreak() + 1;
            } else {
                newCurrentStreak = 1;
                user.setStreakFreezeCount(0);
            }
        }

        int newLongestStreak = Math.max(user.getLongestStreak(), newCurrentStreak);
        user.setCurrentStreak(newCurrentStreak);
        user.setLongestStreak(newLongestStreak);
        user.setLastActivityDate(nowKst.toLocalDateTime());
        user.setStreakCheckDate(null);
        userRepository.save(user);
        return newCurrentStreak > oldStreak;
    }

    /**
     * 사용자의 현재 스트릭을 조회합니다.
     * @param userId 사용자 ID
     * @return 현재 스트릭 값
     */
    public int getUserStreak(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getCurrentStreak();
    }

    
    /**
     * 테스트 전용: 특정 사용자의 마지막 활동일을 과거 또는 미래로 강제 설정
     * 보안: user@test.com 계정만 허용
     * 
     * @param userId 대상 사용자 ID
     * @param days 변경할 일수 (항상 0 이상의 양수)
     * @param direction "PAST" 또는 "FUTURE"
     *                  - "PAST": minusDays(days) - 과거로 설정
     *                  - "FUTURE": plusDays(days) - 미래로 설정
     * @throws IllegalArgumentException user@test.com이 아닌 경우 또는 잘못된 direction
     */
    @Transactional
    public void timeTravelSetLastActivity(Long userId, int days, String direction) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // 보안 검증: user@test.com만 허용
        if (!user.getEmail().equals("user@test.com")) {
            throw new IllegalArgumentException("Time travel is only allowed for test account (user@test.com)");
        }
        
        // direction 검증
        if (!("PAST".equalsIgnoreCase(direction) || "FUTURE".equalsIgnoreCase(direction))) {
            throw new IllegalArgumentException("Invalid direction: must be 'PAST' or 'FUTURE'");
        }
        
        ZonedDateTime nowKst = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDateTime newLastActivity;
        
        // direction에 따라 과거 또는 미래로 설정
        if ("PAST".equalsIgnoreCase(direction)) {
            // 과거로 설정: 음수만큼 빼기
            newLastActivity = nowKst.minusDays(days).toLocalDateTime();
        } else {
            // 미래로 설정: 양수만큼 더하기
            newLastActivity = nowKst.plusDays(days).toLocalDateTime();
        }
        
        user.setLastActivityDate(newLastActivity);
        userRepository.save(user);
    }
}