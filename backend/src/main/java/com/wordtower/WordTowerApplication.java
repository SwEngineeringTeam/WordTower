package com.wordtower;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Word Tower 프로젝트의 시작점입니다.
 * 이 클래스가 실행되면서 스프링 부트 엔진이 가동됩니다.
 */
@SpringBootApplication
public class WordTowerApplication {

    public static void main(String[] args) {
        SpringApplication.run(WordTowerApplication.class, args);
    }
}