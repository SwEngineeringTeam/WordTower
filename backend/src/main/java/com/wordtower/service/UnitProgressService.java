package com.wordtower.service;

import com.wordtower.domain.UserUnitProgress;
import com.wordtower.dto.UnitProgressResponse;
import com.wordtower.dto.UnitProgressUpdateRequest;
import com.wordtower.repository.UserUnitProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 유닛별 학습/퀴즈 완료 상태 관리 서비스
 */
@Service
@RequiredArgsConstructor
public class UnitProgressService {

    private final UserUnitProgressRepository progressRepository;

    @Transactional(readOnly = true)
    public UnitProgressResponse getUnitProgress(Long userId, Integer unitId) {
        return progressRepository
                .findByUserIdAndUnitId(userId, unitId)
                .map(p -> UnitProgressResponse.builder()
                        .unitId(unitId)
                        .isStudyDone(p.getIsStudyDone())
                        .isQuizDone(p.getIsQuizDone())
                        .build())
                .orElse(UnitProgressResponse.builder()
                        .unitId(unitId)
                        .isStudyDone(false)
                        .isQuizDone(false)
                        .build());
    }

    @Transactional
    public UnitProgressResponse markAsDone(Long userId, Integer unitId, UnitProgressUpdateRequest request) {
        UserUnitProgress progress = progressRepository
                .findByUserIdAndUnitId(userId, unitId)
                .orElse(UserUnitProgress.builder()
                        .userId(userId)
                        .unitId(unitId)
                        .isStudyDone(false)
                        .isQuizDone(false)
                        .build());

        switch (request.getType().toLowerCase()) {
            case "study" -> progress.setIsStudyDone(true);
            case "quiz"  -> progress.setIsQuizDone(true);
            default -> throw new IllegalArgumentException("올바르지 않은 타입: " + request.getType());
        }

        UserUnitProgress saved = progressRepository.save(progress);

        return UnitProgressResponse.builder()
                .unitId(unitId)
                .isStudyDone(saved.getIsStudyDone())
                .isQuizDone(saved.getIsQuizDone())
                .build();
    }
}