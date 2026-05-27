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
     * 사용자의 스트릭을 갱신. (퀴즈 완료 시 호출됨.)
     * KST 자정 기준으로 전날 활동이 없으면 방어권을 소모하여 스트릭을 유지하거나, 
     * 방어권이 부족하면 스트릭을 1로 초기화합니다.
     * longestStreak은 최대값으로 갱신.
     * 
     * @param userId 사용자 ID
     * @param quizCompleted 퀴즈 완료 여부 (true: 1개 이상 완료 시 인정)
     */
    @Transactional
    public void updateUserStreak(Long userId, boolean quizCompleted) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!quizCompleted) {
            return; // 퀴즈 미완료 시 갱신하지 않음
        }

        // KST 기준 오늘 날짜
        ZonedDateTime nowKst = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
        LocalDate today = nowKst.toLocalDate();

        // 마지막 활동 날짜 (KST로 변환)
        LocalDate lastActivity = user.getLastActivityDate() != null
                ? user.getLastActivityDate().atZone(ZoneId.of("Asia/Seoul")).toLocalDate()
                : null;

        int newCurrentStreak;

        // 1. 처음 퀴즈를 푸는 경우 (기록이 없을 때)
        if (lastActivity == null) {
            newCurrentStreak = 1;
        } 
        // 2. 오늘 이미 푼 경우 (중복 갱신 방지)
        else if (lastActivity.equals(today)) {
            return; 
        } 
        // 3. 어제 풀고 오늘 또 푸는 경우 (정상적인 연속 학습)
        else if (lastActivity.equals(today.minusDays(1))) {
            newCurrentStreak = user.getCurrentStreak() + 1;
        } 
        // 4. 하루 이상 학습을 쉬었을 경우 (스트릭 방어권 로직 발동)
        else {
            // 마지막 접속일과 오늘 사이의 결석 일수 계산
            long missedDays = ChronoUnit.DAYS.between(lastActivity, today) - 1;
            int currentFreezes = user.getStreakFreezeCount();

            // 보유한 방어권이 결석 일수보다 많거나 같으면 방어 성공
            if (currentFreezes >= missedDays && missedDays > 0) {
                user.setStreakFreezeCount((int) (currentFreezes - missedDays)); // 사용한 만큼 방어권 차감
                newCurrentStreak = user.getCurrentStreak() + 1; // 스트릭을 이어서 +1 처리
            } else {
                // 방어권이 부족하면 스트릭이 깨짐 (1부터 다시 시작)
                newCurrentStreak = 1;

                // 남은 방어권 개수를 0으로 변경
                user.setStreakFreezeCount(0);
            }
        }

        // longestStreak 갱신
        int newLongestStreak = Math.max(user.getLongestStreak(), newCurrentStreak);

        // DB 갱신
        user.setCurrentStreak(newCurrentStreak);
        user.setLongestStreak(newLongestStreak);
        user.setLastActivityDate(nowKst.toLocalDateTime()); // KST 시간 저장
        userRepository.save(user);
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