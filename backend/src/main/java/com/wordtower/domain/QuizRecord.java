package com.wordtower.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class QuizRecord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private int totalCount;
    private int correctCount;
    private double score;
    private double predictedScore; // AI 예측 점수용
    
    private LocalDateTime testDate = LocalDateTime.now();
}