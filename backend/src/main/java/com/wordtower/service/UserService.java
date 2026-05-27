package com.wordtower.service;

import com.wordtower.domain.User;
import com.wordtower.dto.RegisterRequest;
import com.wordtower.dto.AddExpResponse;
import com.wordtower.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true) // 기본적으로 읽기 전용 최적화
public class UserService {
    
    private final UserRepository userRepository;

    // 1. 유저의 현재 진척도(열린 유닛) 조회
    public int getUnlockedUnits(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return user.getUnlockedUnits();
    }

    // 2. 퀴즈 완료 시 다음 유닛 열기
    @Transactional // 쓰기 작업이므로 readOnly 해제
    public void unlockNextUnit(Long userId, int completedUnit) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 방금 완료한 유닛이 현재 열려있는 가장 높은 유닛과 같다면, 다음 유닛을 열음(+1)
        if (user.getUnlockedUnits() == completedUnit) {
            user.setUnlockedUnits(completedUnit + 1);
        }
    }

    /**
<<<<<<< HEAD
     * 회원가입 및 초기 층 설정 로직 (PBI-17 온보딩)
=======
     * 레벨테스트 통과 시 다음 티어의 첫 유닛을 엽니다.
     */
    @Transactional
    public int passLevelTest(Long userId, int tier) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        int nextTierUnit = tier * 5 + 1;
        if (user.getUnlockedUnits() < nextTierUnit) {
            user.setUnlockedUnits(nextTierUnit);
            userRepository.save(user);
        }
        return user.getUnlockedUnits();
    }

    /**
     * 사용자의 마지막 학습일(lastActivityDate)을 문자열로 조회
>>>>>>> origin/develop
     */
    @Transactional // 쓰기 작업이므로 readOnly 해제
    public void register(RegisterRequest request) {
        // 1. 이메일 중복 검증
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
        }

        // 2. 새로운 유저 엔티티 생성
        User user = new User();
        user.setEmail(request.getEmail());
        user.setNickname(request.getNickname());
        
        // 💡 시큐리티 라이브러리가 없으므로 일단 평문(비밀번호 그대로) 저장합니다.
        user.setPassword(request.getPassword()); 

        // [PBI-17] 토익 점수에 따른 시작 층(Floor) 자동 계산
        int initialFloor = calculateInitialFloor(request.getToeicScore());

        // 계산된 초기 층수로 세팅 (difficulty와 unlockedUnits를 싱크 맞춤)
        user.setDifficulty(initialFloor);    // 난이도 단계
        user.setUnlockedUnits(initialFloor); // 오픈된 유닛(시작 층)
        
        user.setExp(0);
        user.setRole(User.Role.USER);

        // 3. DB에 저장
        userRepository.save(user);
    }

    /**
     * 토익 점수를 기반으로 초기 학습 단계(Floor)를 자동 계산하는 로직
     */
    private int calculateInitialFloor(Integer score) {
    if (score == null) {
        return 1;
    }

    // TOEIC 범위 제한
    score = Math.max(0, Math.min(score, 990));

    if (score <= 200) {
        return 1;
    } else if (score <= 400) {
        return 6;   // 2티어
    } else if (score <= 600) {
        return 11;  // 3티어
    } else if (score <= 800) {
        return 16;  // 4티어
    } else {
        return 21;  // 5티어
    }
}

     /* 사용자의 마지막 학습일(lastActivityDate)을 문자열로 조회 */
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
