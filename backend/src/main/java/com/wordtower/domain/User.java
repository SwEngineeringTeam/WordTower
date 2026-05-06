package com.wordtower.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Getter @Setter
@NoArgsConstructor
@Table(name = "users") // user는 DB 예약어인 경우가 많아 테이블명을 지정하는 것이 안전합니다.
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

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    public enum Role { ADMIN, USER }
}
