package sis.hust.edu.vn.digital_signature.repository.crypto;

import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.model.UserKeyPair;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

import java.util.Optional;

@Repository
public interface UserKeyPairRepository extends BaseRepository<UserKeyPair, String> {
    Optional<UserKeyPair> findByUserId(String userId);
    boolean existsByUserId(String userId);
}
