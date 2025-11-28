package sis.hust.edu.vn.digital_signature.repository.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import sis.hust.edu.vn.digital_signature.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u LEFT JOIN FETCH u.avatar WHERE u.id = :id")
    Optional<User> findByIdWithAvatar(@Param("id") String id);
}

