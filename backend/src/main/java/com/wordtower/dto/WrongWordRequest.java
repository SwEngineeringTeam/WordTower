package com.wordtower.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class WrongWordRequest {
    private Long wordId;
    private String word;
    private String meaning;
}