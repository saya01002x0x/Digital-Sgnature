package sis.hust.edu.vn.digital_signature.repository.signature;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sis.hust.edu.vn.digital_signature.entity.model.Signature;
import sis.hust.edu.vn.digital_signature.repository.BaseRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SignatureRepository extends BaseRepository<Signature, String> {
    List<Signature> findByUserId(String userId);
    Optional<Signature> findByIdAndUserId(String id, String userId);
    
    @Modifying
    @Query("UPDATE Signature s SET s.isDefault = false WHERE s.userId = :userId")
    void clearDefaultForUser(@Param("userId") String userId);
}

