package sis.hust.edu.vn.digital_signature.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import sis.hust.edu.vn.digital_signature.entites.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
}
