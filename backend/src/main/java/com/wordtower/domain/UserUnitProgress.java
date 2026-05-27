package com.wordtower.domain;  // ✅ entity → domain

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 유저별 유닛 진도 및 완료 상태 엔티티
 * - isStudyDone: 단어 암기(학습) 완료 여부
 * - isQuizDone: 퀴즈 완료 여부
 * - 미니게임은 완료 추적 없이 항상 활성화
 */
@Entity
@Table(name = "user_unit_progress")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserUnitProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Integer unitId;

    @Column(nullable = false)
    private Boolean isStudyDone = false;

    @Column(nullable = false)
    private Boolean isQuizDone = false;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}