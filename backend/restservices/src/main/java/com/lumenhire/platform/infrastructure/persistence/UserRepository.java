package com.lumenhire.platform.infrastructure.persistence;

import com.lumenhire.platform.domain.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface UserRepository extends JpaRepository<User,String> {
    Optional<User> findByEmail(String username);
}
