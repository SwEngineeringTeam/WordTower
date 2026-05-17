package com.wordtower.service;

import com.wordtower.domain.User;
import com.wordtower.dto.RegisterRequest;
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
     * 회원가입 및 초기 층 설정 로직 (PBI-17 온보딩)
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
        if (score == null || score <= 200) {
            return 1; 
        }
        
        if (score > 990) {
            score = 990;
        }

        return ((score - 1) / 200) + 1;
    }
}