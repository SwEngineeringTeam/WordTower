
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
    public List<Word> findWordsByUnit(int unitId, int limit) {
        int startId = (unitId - 1) * 10 + 1;  // unit1=1, unit2=11, unit3=21...
        int endId = unitId * 10;               // unit1=10, unit2=20, unit3=30...
        return wordRepository.findWordsByUnitId(startId, endId, limit);
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
    @Transactional
    public void deleteWrongWord(Long wordId) {
        // wordId에 해당하는 오답 기록 삭제 또는 오답 상태 해제 로직
    }
}