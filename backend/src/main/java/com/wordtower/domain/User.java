package com.wordtower.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
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

    // 💡 [필수 추가] 변수(필드)가 먼저 선언되어 있어야 에러가 안 납니다!
    @Column(nullable = false, columnDefinition = "int default 0")
    private int exp = 0; 

    private int currentStreak = 0;
    private int longestStreak = 0;
    private LocalDateTime lastActivityDate;

    // [추가] 사용자가 현재 열어둔 유닛 (기본값: 1)
    @Column(nullable = false, columnDefinition = "int default 1")
    private int unlockedUnits = 1; 

    @Enumerated(EnumType.STRING)    
    private Role role = Role.USER;

    public enum Role { ADMIN, USER }

    // 변수가 선언되었기 때문에 이제 이 setter 메서드도 정상 작동합니다.
    public void setExp(int exp) {
        this.exp = exp;
    }
}