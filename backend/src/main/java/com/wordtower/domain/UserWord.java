package com.wordtower.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
public class UserWord {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String spelling;
    private String meaning;
    
    private boolean isWrong; // 오답 여부
    private int wrongCount = 0;
    private LocalDateTime lastWrongDate;
    
    private boolean isFavorite; // 사용자 직접 추가 여부
}