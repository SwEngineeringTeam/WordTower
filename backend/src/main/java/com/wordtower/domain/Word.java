package com.wordtower.domain;

import jakarta.persistence.*; // Spring Boot 3 기준
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Word 엔티티: 단어의 속성(단어, 뜻, 난이도, 예문)을 정의합니다.
 */
@Entity
@Getter @Setter
@NoArgsConstructor
public class Word {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String word;      // 영단어

    @Column(nullable = false)
    private String meaning;   // 뜻

    private String difficulty; // 난이도

    @Column(columnDefinition = "TEXT")
    private String example;    // 예문
}