package com.wordtower.controller;

import com.wordtower.domain.Word;
import com.wordtower.service.WordService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import com.wordtower.domain.UserWord;
import com.wordtower.dto.WrongWordRequest;

/**
 * WordController: 프론트엔드의 요청을 받아 처리 결과를 반환합니다.
 */
@RestController
@RequestMapping("/api/words")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") 
public class WordController {

    private final WordService wordService;

    @GetMapping
    public List<Word> getAllWords() {
        return wordService.findAll();
    }
    @GetMapping("/daily")
    public List<Word> getDailyWords(
            @RequestParam(defaultValue = "1") String unitId,
            @RequestParam(defaultValue = "10") int limit
    ) {
        return wordService.findRandomByDifficulty(unitId, limit);
    }
    @GetMapping("/wrong")
    public List<Word> getWrongWords(
            @RequestParam(defaultValue = "5") int limit
    ) {
        return wordService.findWrongWords(limit);
    }
    @PostMapping("/wrong")
    public UserWord saveWrongWord(@RequestBody WrongWordRequest request) {
        return wordService.saveWrongWord(request);
    }

    @PostMapping
    public Word createWord(@RequestBody Word word) {
        return wordService.save(word);
    }
    @GetMapping("/unit")
    public List<Word> getWordsByUnit(
        @RequestParam(defaultValue = "1") int unitId,
        @RequestParam(defaultValue = "10") int limit
    ) {
        return wordService.findWordsByUnit(unitId, limit);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Word> updateWord(@PathVariable Long id, @RequestBody Word wordDetails) {
        try {
            Word updatedWord = wordService.update(id, wordDetails);
            return ResponseEntity.ok(updatedWord);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWord(@PathVariable Long id) {
        wordService.delete(id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/wrong/{wordId}")
    public ResponseEntity<Void> deleteWrongWord(@PathVariable Long wordId) {
        wordService.deleteWrongWord(wordId);
        return ResponseEntity.ok().build();
    }

}