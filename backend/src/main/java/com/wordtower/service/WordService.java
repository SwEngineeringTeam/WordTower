package com.wordtower.service;

import com.wordtower.domain.Word;
import com.wordtower.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

/**
 * WordService: 단어 관리의 핵심 로직을 처리합니다.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;

    public List<Word> findAll() {
        return wordRepository.findAll();
    }

    @Transactional
    public Word save(Word word) {
        return wordRepository.save(word);
    }

    @Transactional
    public Word update(Long id, Word wordDetails) {
        Word word = wordRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Word not found with id: " + id));

        word.setWord(wordDetails.getWord());
        word.setMeaning(wordDetails.getMeaning());

        word.setExample(wordDetails.getExample());       // 예문
        word.setDifficulty(wordDetails.getDifficulty());

        return word;
}

    @Transactional
    public void delete(Long id) {
        wordRepository.deleteById(id);
    }
}