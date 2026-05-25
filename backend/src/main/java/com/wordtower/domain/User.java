package com.wordtower.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "users") 
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nickname;

    private int difficulty = 1;

    private int currentStreak = 0;
    private int longestStreak = 0;
    private LocalDateTime lastActivityDate;
    private LocalDate streakCheckDate;

    // 스트릭 방어권 보유 개수
    @Column(nullable = false, columnDefinition = "int default 0")
    private int streakFreezeCount = 0;

    // 사용자의 현재 누적 경험치
    @Column(nullable = false, columnDefinition = "int default 0")
    private int exp = 0;

    // 사용자가 현재 열어둔 유닛 (기본값: 1)
    @Column(nullable = false, columnDefinition = "int default 1")
    private int unlockedUnits = 1; 

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    public enum Role { ADMIN, USER }
}
