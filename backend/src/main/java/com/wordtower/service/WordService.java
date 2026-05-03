
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
    public List<Word> findRandom(int limit) {
        return wordRepository.findRandomWords(limit);
    }
    // [여기에 추가!] 오늘의 단어 10개를 무작위로 가져오는 로직
    public List<Word> findDailyWords(int limit) {
        // 1. DB에서 모든 단어를 일단 가져옵니다.
        List<Word> allWords = wordRepository.findAll();
        
        // 2. 무작위로 섞습니다.
        java.util.Collections.shuffle(allWords);
        
        // 3. 요청한 개수(limit)만큼만 잘라서 반환합니다.
        return allWords.stream()
                .limit(limit)
                .collect(java.util.stream.Collectors.toList());
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