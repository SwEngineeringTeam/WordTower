package com.wordtower.service;

import com.wordtower.domain.User;
import com.wordtower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class StreakService {

    private final UserRepository userRepository;

    /**
     * 사용자의 스트릭을 갱신합니다. 퀴즈 완료 시 호출.
     * KST 자정 기준으로 전날 활동이 없으면 스트릭 초기화, 연속이면 +1.
     * longestStreak은 최대값으로 갱신.
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

        // 오늘 이미 퀴즈를 푼 경우 return
        if (lastActivity != null && lastActivity.equals(today)) {
            return; 
        } else if (lastActivity != null && lastActivity.equals(today.minusDays(1))) {
            // 연속: +1
            newCurrentStreak = user.getCurrentStreak() + 1;
        } else {
            // 첫 활동 또는 며칠 쉬었음: 스트릭 1로 초기화
            newCurrentStreak = 1;
        }

        // longestStreak 갱신
        int newLongestStreak = Math.max(user.getLongestStreak(), newCurrentStreak);

        // DB 갱신
        user.setCurrentStreak(newCurrentStreak);
        user.setLongestStreak(newLongestStreak);
        user.setLastActivityDate(nowKst.toLocalDateTime()); // KST 시간 저장
        userRepository.save(user);

        // 테스트용 출력 (코드 리뷰용, 추후 주석 처리 가능)
        System.out.println(user.getNickname() + " (" + user.getId() + ")의 현재 스트릭은 " + user.getCurrentStreak() + " 일입니다.");
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
}