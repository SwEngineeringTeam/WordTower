package com.wordtower.domain;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
public class QuizDetail {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_record_id")
    private QuizRecord quizRecord;

    private String spelling;
    private String userAnswer;
    private boolean isCorrect;
}