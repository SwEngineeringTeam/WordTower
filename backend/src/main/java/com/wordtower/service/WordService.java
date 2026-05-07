
package com.wordtower.service;

import com.wordtower.domain.Word;
import com.wordtower.repository.WordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import com.wordtower.domain.UserWord;
import com.wordtower.dto.WrongWordRequest;
import com.wordtower.repository.UserWordRepository;
import java.time.LocalDateTime;
import java.util.stream.Collectors;

/**
 * WordService: 단어 관리의 핵심 로직을 처리합니다.
 */
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class WordService {

    private final WordRepository wordRepository;
    private final UserWordRepository userWordRepository;

    public List<Word> findAll() {
        return wordRepository.findAll();
    }
    public List<Word> findRandomByDifficulty(String unitId, int limit) {
        int unit = Integer.parseInt(unitId);
        int difficultyNum = (unit - 1) / 5;          // unit 1~5 → 0, unit 6~10 → 1
        int offset = ((unit - 1) % 5) * limit;        // 0, 10, 20, 30, 40
        String difficulty = String.valueOf(difficultyNum); // int → String 변환
        return wordRepository.findWordsByDifficultyOrdered(difficulty, limit, offset);
    }
    public List<Word> findWrongWords(int limit) {
    List<UserWord> wrongWords = userWordRepository.findWrongWords(limit);

        return wrongWords.stream()
                .map(userWord -> {
                    Word word = new Word();
                    word.setId(userWord.getId());
                    word.setWord(userWord.getSpelling());
                    word.setMeaning(userWord.getMeaning());
                    word.setDifficulty("1");
                    return word;
                })
                .collect(Collectors.toList());
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
    @Transactional
    public UserWord saveWrongWord(WrongWordRequest request) {
        UserWord userWord = userWordRepository
                .findBySpellingNative(request.getWord())
                .orElseGet(UserWord::new);

        userWord.setSpelling(request.getWord());
        userWord.setMeaning(request.getMeaning());
        
        userWord.setLastWrongDate(LocalDateTime.now());
        userWord.setWrong(true);

        userWord.setWrongCount(userWord.getWrongCount() + 1);

        return userWordRepository.save(userWord);
    }
}