package com.wordtower.service;

import com.wordtower.domain.User;
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
}