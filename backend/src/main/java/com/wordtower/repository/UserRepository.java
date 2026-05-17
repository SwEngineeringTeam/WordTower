package com.wordtower.repository;

import com.wordtower.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // 로그인 기능을 위해 이메일로 사용자를 찾는 메서드 추가
    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);
}
