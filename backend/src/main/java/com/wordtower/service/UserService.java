package com.wordtower.service;

import com.wordtower.domain.User;
import com.wordtower.dto.AddExpResponse;
import com.wordtower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;

    // 1. 유저의 현재 진척도(열린 유닛) 조회
    public int getUnlockedUnits(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getUnlockedUnits();
    }

    // 2. 퀴즈 완료 시 다음 유닛 열기
    @Transactional
    public void unlockNextUnit(Long userId, int completedUnit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 방금 완료한 유닛이 현재 열려있는 가장 높은 유닛과 같다면, 다음 유닛을 열음(+1)
        if (user.getUnlockedUnits() == completedUnit) {
            user.setUnlockedUnits(completedUnit + 1);
            userRepository.save(user);
        }
    }

    /**
     * 사용자의 마지막 학습일(lastActivityDate)을 문자열로 조회
     */
    public String getLastActivityDate(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getLastActivityDate() == null) {
            return null; // 기록이 없으면 null 반환
        }
        
        // 프론트엔드에서 읽기 편하게 문자열(String)로 변환해서 전달
        return user.getLastActivityDate().toString(); 
    }

    /**
     * 사용자의 스트릭 방어권 보유 개수를 조회
     */
    public int getStreakFreezeCount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getStreakFreezeCount();
    }

    /**
     * 경험치 증감에 따라 스트릭 방어권을 지급
     * oldExp와 newExp 사이에서 200 단위 구간을 돌파한 횟수만큼 아이템을 추가
     */
    @Transactional
    public int rewardStreakFreezeForExp(Long userId, int oldExp, int newExp) {
        if (newExp <= oldExp) {
            return getStreakFreezeCount(userId);
        }

        int rewardCount = calculateCrossedFreezeRewards(oldExp, newExp);
        if (rewardCount <= 0) {
            return getStreakFreezeCount(userId);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStreakFreezeCount(user.getStreakFreezeCount() + rewardCount);
        userRepository.save(user);
        return user.getStreakFreezeCount();
    }

    private int calculateCrossedFreezeRewards(int oldExp, int newExp) {
        int oldLevel = Math.max(0, oldExp) / 200;
        int newLevel = Math.max(0, newExp) / 200;
        return Math.max(0, newLevel - oldLevel);
    }


    /**
     * 테스트 전용: 특정 사용자에게 임의의 경험치를 지급하고
     * 필요한 경우 스트릭 방어권 보상을 함께 반영합니다.
     */
    @Transactional
    public AddExpResponse addTestExp(Long userId, int addedExp) {
        if (addedExp < 0) {
            throw new IllegalArgumentException("EXP는 0 이상의 숫자여야 합니다.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!"user@test.com".equals(user.getEmail())) {
            throw new IllegalArgumentException("EXP 추가는 테스트 계정 user@test.com만 허용됩니다.");
        }

        int oldExp = user.getExp();
        int newExp = oldExp + addedExp;
        user.setExp(newExp);

        int rewardCount = calculateCrossedFreezeRewards(oldExp, newExp);
        if (rewardCount > 0) {
            user.setStreakFreezeCount(user.getStreakFreezeCount() + rewardCount);
        }

        userRepository.save(user);
        return new AddExpResponse(newExp, user.getStreakFreezeCount(), rewardCount);
    }
}
